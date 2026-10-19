import { mkdtempSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { keepInOutbox, pruned } from "@/lib/lead-outbox";

const DAY = 86_400_000;
const line = (id: string, at: number) => JSON.stringify({ id, receivedAt: new Date(at).toISOString() });

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
    expect(await keepInOutbox({ id: "a", receivedAt: new Date().toISOString() })).toBe(false);
  });

  it("appends owner-only JSON lines, one write at a time", async () => {
    const dir = mkdtempSync(join(tmpdir(), "outbox-"));
    vi.stubEnv("LEAD_OUTBOX_DIR", dir);
    const at = new Date().toISOString();
    const results = await Promise.all(
      ["a", "b", "c"].map((id) => keepInOutbox({ id, receivedAt: at })),
    );
    expect(results).toEqual([true, true, true]);
    const path = join(dir, "leads-outbox.jsonl");
    const ids = readFileSync(path, "utf8").trim().split("\n").map((l) => JSON.parse(l).id);
    expect(ids.sort()).toEqual(["a", "b", "c"]);
    expect(statSync(path).mode & 0o777).toBe(0o600);
  });
});
