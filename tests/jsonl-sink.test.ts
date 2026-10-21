import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createJsonlSink } from "@/lib/jsonl-sink";

/*
 * The failure modes of lib/jsonl-sink.ts that need a broken filesystem: a
 * read that fails with something other than "no such file" must fail the
 * write and leave the file exactly as it was (X-Ray ARC-F2).
 */

const fault = vi.hoisted(() => ({ readFile: null as string | null }));

vi.mock("node:fs/promises", async (importOriginal) => {
  const real = await importOriginal<typeof import("node:fs/promises")>();
  return {
    ...real,
    readFile: ((...args: Parameters<typeof real.readFile>) => {
      if (fault.readFile) {
        return Promise.reject(Object.assign(new Error(fault.readFile), { code: fault.readFile }));
      }
      return real.readFile(...args);
    }) as typeof real.readFile,
  };
});

const now = () => new Date().toISOString();

function sinkIn(text: string, maxBytes = 1_000_000) {
  const dir = mkdtempSync(join(tmpdir(), "sink-"));
  const path = join(dir, "test.jsonl");
  if (text) writeFileSync(path, text, { mode: 0o600 });
  vi.stubEnv("LEAD_OUTBOX_DIR", dir);
  const sink = createJsonlSink({ file: "test.jsonl", retentionEnv: "TEST_RETENTION_DAYS", defaultRetentionDays: 365, maxBytes });
  return { sink, path };
}

afterEach(() => {
  fault.readFile = null;
  vi.unstubAllEnvs();
});

describe("jsonl sink", () => {
  it("fails the write on an I/O error and leaves the file untouched", async () => {
    const before = `{"id":"a","receivedAt":"${now()}"}\n{"id":"b","receivedAt":"${now()}"}\n`;
    const { sink, path } = sinkIn(before);
    fault.readFile = "EIO";
    expect(await sink.append({ receivedAt: now() })).toEqual({ ok: false, error: "EIO" });
    fault.readFile = null;
    expect(readFileSync(path, "utf8")).toBe(before);
  });

  it("treats only a missing file as empty", async () => {
    const { sink, path } = sinkIn("");
    fault.readFile = "ENOENT";
    expect(await sink.append({ receivedAt: now() })).toEqual({ ok: true });
    fault.readFile = null;
    expect(readFileSync(path, "utf8").split("\n").filter(Boolean)).toHaveLength(1);
  });

  it("reports status without reading anything but the timestamps", async () => {
    const { sink } = sinkIn(
      [
        '{"id":"a","receivedAt":"2026-10-01T10:00:00.000Z","lead":{"phone":"+201012345678"}}',
        "not json",
        '{"id":"b","receivedAt":"2026-10-20T10:00:00.000Z"}',
      ].join("\n") + "\n",
    );
    expect(await sink.status()).toEqual({ entries: 3, oldestReceivedAt: "2026-10-01T10:00:00.000Z" });
    fault.readFile = "EACCES";
    await expect(sink.status()).rejects.toThrow("EACCES");
  });

  it("refuses a write that would take the file past its size cap", async () => {
    const before = `{"id":"a","receivedAt":"${now()}"}\n`;
    const { sink, path } = sinkIn(before, before.length + 10);
    expect(await sink.append({ receivedAt: now() })).toEqual({ ok: false, error: "full" });
    expect(readFileSync(path, "utf8")).toBe(before);
  });
});
