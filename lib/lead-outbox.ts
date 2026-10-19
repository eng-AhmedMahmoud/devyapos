import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * The durable sink for a lead that could not be forwarded.
 *
 * It replaces the old last resort — the whole lead (name, phone, message) on
 * an error-level log line — which put personal data in logs and was not
 * durable either: on the VPS, `docker compose up --build` recreates the
 * container and its logs go with it. Now the lead goes to an append-only
 * JSON-lines file on a Docker volume (`LEAD_OUTBOX_DIR`, `/data` in
 * production — docker-compose.prod.yml), owner-only (0600), and the log line
 * carries the lead's id and nothing else.
 *
 * Retention: every write drops entries older than `LEAD_OUTBOX_RETENTION_DAYS`
 * (default 365 — the twelve months the privacy policy promises). Recover leads
 * with `docker exec devya-devyapos cat /data/leads-outbox.jsonl`; the README
 * says how.
 */

const FILE = "leads-outbox.jsonl";
const DAY_MS = 86_400_000;

/** Writes run one at a time: read-prune-rewrite must not interleave. */
let queue: Promise<unknown> = Promise.resolve();

export function outboxConfigured(): boolean {
  return Boolean(process.env.LEAD_OUTBOX_DIR);
}

export function keepInOutbox(entry: { id: string; receivedAt: string }): Promise<boolean> {
  const run = queue.then(() => write(entry));
  queue = run.catch(() => undefined);
  return run;
}

async function write(entry: { id: string; receivedAt: string }): Promise<boolean> {
  const dir = process.env.LEAD_OUTBOX_DIR;
  if (!dir) return false;
  const retentionDays = Number(process.env.LEAD_OUTBOX_RETENTION_DAYS) || 365;
  try {
    await mkdir(dir, { recursive: true, mode: 0o700 });
    const path = join(dir, FILE);
    const kept = pruned(await readOrEmpty(path), Date.now() - retentionDays * DAY_MS);
    const tmp = `${path}.${process.pid}.tmp`;
    await writeFile(tmp, kept + JSON.stringify(entry) + "\n", { mode: 0o600 });
    await rename(tmp, path);
    return true;
  } catch {
    return false;
  }
}

async function readOrEmpty(path: string): Promise<string> {
  try {
    return await readFile(path, "utf8");
  } catch {
    return "";
  }
}

/** Lines received at or after `cutoff`; an unreadable line is kept, not lost. */
export function pruned(text: string, cutoff: number): string {
  return text
    .split("\n")
    .filter(Boolean)
    .filter((line) => {
      try {
        const at = Date.parse((JSON.parse(line) as { receivedAt?: string }).receivedAt ?? "");
        return !Number.isFinite(at) || at >= cutoff;
      } catch {
        return true;
      }
    })
    .map((line) => `${line}\n`)
    .join("");
}
