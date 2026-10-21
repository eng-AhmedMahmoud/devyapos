import { chmodSync, mkdtempSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { pruned } from "@/lib/jsonl-sink";
import { keepInOutbox, outboxPending } from "@/lib/lead-outbox";

const DAY = 86_400_000;
const line = (id: string, at: number) => JSON.stringify({ id, receivedAt: new Date(at).toISOString() });
const entry = (id: string) => ({ id, receivedAt: new Date().toISOString() });
/** Root reads a 000 file anyway, so the permission test means nothing there. */
const asRoot = process.getuid?.() === 0;

function outboxWith(text: string): { dir: string; path: string } {
  const dir = mkdtempSync(join(tmpdir(), "outbox-"));
  const path = join(dir, "leads-outbox.jsonl");
  if (text) writeFileSync(path, text, { mode: 0o600 });
  vi.stubEnv("LEAD_OUTBOX_DIR", dir);
  return { dir, path };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("lead outbox", () => {
  it("drops entries older than the cutoff and keeps unreadable lines", () => {
    const now = Date.now();
    const text = [line("old", now - 400 * DAY), line("new", now - DAY), "not json"].join("\n") + "\n";
    const out = pruned(text, now - 365 * DAY);
    expect(out).toContain('"new"');
    expect(out).toContain("not json");
    expect(out).not.toContain('"old"');
  });

  it("is off without LEAD_OUTBOX_DIR", async () => {
    vi.stubEnv("LEAD_OUTBOX_DIR", "");
    expect(await keepInOutbox(entry("a"))).toEqual({ ok: false, error: "not_configured" });
  });

  it("appends owner-only JSON lines, one write at a time", async () => {
    const { path } = outboxWith("");
    const results = await Promise.all(["a", "b", "c"].map((id) => keepInOutbox(entry(id))));
    expect(results).toEqual([{ ok: true }, { ok: true }, { ok: true }]);
    const ids = readFileSync(path, "utf8").trim().split("\n").map((l) => JSON.parse(l).id);
    expect(ids.sort()).toEqual(["a", "b", "c"]);
    expect(statSync(path).mode & 0o777).toBe(0o600);
    expect(await outboxPending()).toBe(3);
  });

  it("appends in place: stored leads are never rewritten by a write", async () => {
    const before = `${line("kept", Date.now() - DAY)}\n`;
    const { path } = outboxWith(before);
    const inode = statSync(path).ino;
    expect((await keepInOutbox(entry("new"))).ok).toBe(true);
    expect(statSync(path).ino).toBe(inode);
    expect(readFileSync(path, "utf8").startsWith(before)).toBe(true);
  });

  // ARC-F2: the old outbox read an unreadable file as "", then renamed a file
  // holding only the new lead over it — every stored lead gone, and a 200.
  it.skipIf(asRoot)("never overwrites an outbox it cannot read, and reports the failure", async () => {
    const before = [line("a", Date.now() - DAY), line("b", Date.now())].join("\n") + "\n";
    const { path } = outboxWith(before);
    chmodSync(path, 0o000);
    try {
      const result = await keepInOutbox(entry("c"));
      expect(result).toEqual({ ok: false, error: "EACCES" });
    } finally {
      chmodSync(path, 0o600);
    }
    expect(readFileSync(path, "utf8")).toBe(before);
    expect(await outboxPending()).toBe(2);
  });

  it("starts a new line after a torn write instead of gluing onto it", async () => {
    const torn = `${line("a", Date.now())}\n{"id":"half`;
    const { path } = outboxWith(torn);
    expect((await keepInOutbox(entry("b"))).ok).toBe(true);
    const lines = readFileSync(path, "utf8").split("\n").filter(Boolean);
    expect(lines).toHaveLength(3);
    expect(lines[1]).toBe('{"id":"half');
    expect(JSON.parse(lines[2]).id).toBe("b");
  });

  it("prunes past retention but keeps every line it cannot date", async () => {
    const now = Date.now();
    const { path } = outboxWith(
      [line("old", now - 400 * DAY), "not json", '{"id":"undated"}', line("recent", now - DAY)].join("\n") + "\n",
    );
    expect((await keepInOutbox(entry("new"))).ok).toBe(true);
    const text = readFileSync(path, "utf8");
    for (const kept of ["not json", '"undated"', '"recent"', '"new"']) expect(text).toContain(kept);
    expect(text).not.toContain('"old"');
    expect(statSync(path).mode & 0o777).toBe(0o600);
  });

  it("ignores a zero or negative retention setting instead of pruning everything", async () => {
    vi.stubEnv("LEAD_OUTBOX_RETENTION_DAYS", "-1");
    const { path } = outboxWith(`${line("recent", Date.now() - DAY)}\n`);
    expect((await keepInOutbox(entry("new"))).ok).toBe(true);
    expect(readFileSync(path, "utf8")).toContain('"recent"');
  });
});
