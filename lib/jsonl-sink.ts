import { randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, stat, unlink } from "node:fs/promises";
import { dirname, join } from "node:path";

/**
 * An append-only JSON-lines file on the data volume.
 *
 * This site has no database. The two records it must keep on its own server —
 * leads that were not forwarded (lib/lead-outbox.ts) and consent receipts
 * (lib/consent-receipts.ts) — each go to one file in `LEAD_OUTBOX_DIR`. In
 * production that is `/data`, the named volume `docker-compose.prod.yml`
 * mounts into the container on the Devya VPS: every deploy recreates the
 * container and its logs go with it, the volume stays.
 *
 * What a sink promises, and why:
 *
 * - A write never truncates or rewrites what is already stored. Entries go in
 *   through an O_APPEND handle and are fsynced before the write reports
 *   success. The old outbox read the file, treated any read error as "empty"
 *   and renamed a fresh file over it, so one EACCES or EIO erased every lead
 *   it held (X-Ray ARC-F2).
 * - Any error other than "the file does not exist yet" fails the write. The
 *   caller then answers honestly — the lead route returns 503 and the form
 *   offers WhatsApp and email — rather than 200 over a record that is gone.
 * - Retention pruning rewrites the file only after it was read in full, via a
 *   temp file in the same directory that is fsynced and renamed over the
 *   original, and only if the file did not change size in between. A line that
 *   does not parse, or has no readable `receivedAt`, is kept: pruning only
 *   drops what it can prove is past retention.
 * - The file has a size cap, so a flood of requests cannot fill the disk of a
 *   VPS other services share. A full sink fails its writes, loudly.
 * - Writes to one file run one at a time in this process (the container runs
 *   a single `next start` process).
 */

const DAY_MS = 86_400_000;
/** Pruning reads the whole file, so it runs on the first write after a start and then at most daily. */
const PRUNE_EVERY_MS = DAY_MS;

/** Every stored entry carries the server time it was received; retention counts from it. */
export interface SinkEntry {
  receivedAt: string;
}

export interface SinkOptions {
  /** File name inside `LEAD_OUTBOX_DIR`. */
  file: string;
  /** Env var holding the retention in days. */
  retentionEnv: string;
  defaultRetentionDays: number;
  /** Writes that would take the file past this many bytes fail. */
  maxBytes: number;
}

/** `error` is an errno code or one of the sink's own codes — never data from an entry. */
export type SinkResult = { ok: true } | { ok: false; error: string };

export interface SinkStatus {
  /** Non-empty lines, readable or not. */
  entries: number;
  /** Earliest readable `receivedAt`, or null when there is none. */
  oldestReceivedAt: string | null;
}

export interface JsonlSink {
  append(entry: SinkEntry): Promise<SinkResult>;
  /** Null when no directory is configured. Throws when the file cannot be read. */
  status(): Promise<SinkStatus | null>;
}

/** Thrown for the sink's own refusals, so the code reaches the caller. */
class SinkRefusal extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}

/** One queue per file path: append and prune of the same file must not interleave. */
const queues = new Map<string, Promise<unknown>>();
/** When each file was last pruned by this process. */
const lastPruned = new Map<string, number>();

export function createJsonlSink(options: SinkOptions): JsonlSink {
  const pathNow = () => {
    const dir = process.env.LEAD_OUTBOX_DIR;
    return dir ? join(dir, options.file) : null;
  };

  return {
    append(entry) {
      const path = pathNow();
      if (!path) return Promise.resolve({ ok: false, error: "not_configured" });
      const run = (queues.get(path) ?? Promise.resolve()).then(() =>
        write(path, entry, options),
      );
      queues.set(path, run.catch(() => undefined));
      return run;
    },

    async status() {
      const path = pathNow();
      if (!path) return null;
      const text = await readOrNothing(path);
      return summarise(text ?? "");
    },
  };
}

async function write(path: string, entry: SinkEntry, options: SinkOptions): Promise<SinkResult> {
  try {
    await mkdir(dirname(path), { recursive: true, mode: 0o700 });
    const now = Date.now();
    if (now - (lastPruned.get(path) ?? -Infinity) >= PRUNE_EVERY_MS) {
      if (await prune(path, now - retentionDays(options) * DAY_MS)) lastPruned.set(path, now);
    }
    await appendLine(path, `${JSON.stringify(entry)}\n`, options.maxBytes);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: errorCode(err) };
  }
}

/**
 * A missing, zero, negative or non-numeric setting falls back to the default.
 * A negative value would put the cutoff in the future and prune every entry.
 */
export function retentionDays(options: Pick<SinkOptions, "retentionEnv" | "defaultRetentionDays">): number {
  const days = Number(process.env[options.retentionEnv]);
  return Number.isFinite(days) && days > 0 ? days : options.defaultRetentionDays;
}

async function appendLine(path: string, line: string, maxBytes: number): Promise<void> {
  // "a+" creates the file 0600 if needed, appends only, and needs read access
  // — a file this process cannot read is a fault to report, not to write past.
  const handle = await open(path, "a+", 0o600);
  try {
    const { size } = await handle.stat();
    let text = line;
    if (size > 0) {
      const last = Buffer.alloc(1);
      await handle.read(last, 0, 1, size - 1);
      // A crash mid-write can leave a line without its newline. Start a new
      // line rather than glue this entry onto it and make both unreadable.
      if (last[0] !== 0x0a) text = `\n${line}`;
    }
    if (size + Buffer.byteLength(text) > maxBytes) throw new SinkRefusal("full");
    await handle.appendFile(text);
    await handle.datasync();
  } finally {
    await handle.close();
  }
}

/** False when the file changed while it was being pruned; the next write tries again. */
async function prune(path: string, cutoff: number): Promise<boolean> {
  const raw = await readOrNothing(path, "buffer");
  if (raw === null) return true;
  const text = raw.toString("utf8");
  const kept = pruned(text, cutoff);
  if (lineCount(kept) === lineCount(text)) return true;

  const tmp = `${path}.${process.pid}.${randomUUID()}.tmp`;
  try {
    const handle = await open(tmp, "wx", 0o600);
    try {
      await handle.writeFile(kept);
      await handle.sync();
    } finally {
      await handle.close();
    }
    // Replace only the file that was read. If it grew in the meantime the
    // rewrite would drop the new entries, so keep everything and prune on a
    // later write instead.
    if ((await stat(path)).size !== raw.length) {
      await unlink(tmp);
      return false;
    }
    await rename(tmp, path);
  } catch (err) {
    await unlink(tmp).catch(() => undefined);
    throw err;
  }
  await syncDir(dirname(path));
  return true;
}

/** The rename is durable once the directory entry is; best effort where a platform refuses. */
async function syncDir(dir: string): Promise<void> {
  try {
    const handle = await open(dir, "r");
    try {
      await handle.sync();
    } finally {
      await handle.close();
    }
  } catch {
    // Some filesystems do not fsync directories; the data itself is already synced.
  }
}

/** The file's contents; null only when it does not exist. Every other error is thrown. */
async function readOrNothing(path: string): Promise<string | null>;
async function readOrNothing(path: string, as: "buffer"): Promise<Buffer | null>;
async function readOrNothing(path: string, as?: "buffer"): Promise<string | Buffer | null> {
  try {
    return as === "buffer" ? await readFile(path) : await readFile(path, "utf8");
  } catch (err) {
    if (errorCode(err) === "ENOENT") return null;
    throw err;
  }
}

/** Lines received at or after `cutoff`; an unreadable line is kept, not lost. */
export function pruned(text: string, cutoff: number): string {
  return text
    .split("\n")
    .filter(Boolean)
    .filter((line) => {
      const at = receivedAtOf(line);
      return at === null || at >= cutoff;
    })
    .map((line) => `${line}\n`)
    .join("");
}

/** Entry count and oldest readable `receivedAt` — nothing else is read out of an entry. */
export function summarise(text: string): SinkStatus {
  let entries = 0;
  let oldest: number | null = null;
  for (const line of text.split("\n")) {
    if (!line) continue;
    entries += 1;
    const at = receivedAtOf(line);
    if (at !== null && (oldest === null || at < oldest)) oldest = at;
  }
  return { entries, oldestReceivedAt: oldest === null ? null : new Date(oldest).toISOString() };
}

function receivedAtOf(line: string): number | null {
  try {
    const parsed: unknown = JSON.parse(line);
    if (!parsed || typeof parsed !== "object") return null;
    const at = Date.parse(String((parsed as { receivedAt?: unknown }).receivedAt ?? ""));
    return Number.isFinite(at) ? at : null;
  } catch {
    return null;
  }
}

function lineCount(text: string): number {
  return text.split("\n").filter(Boolean).length;
}

function errorCode(err: unknown): string {
  if (err instanceof SinkRefusal) return err.code;
  const code = (err as NodeJS.ErrnoException | null)?.code;
  return typeof code === "string" ? code : "unknown";
}
