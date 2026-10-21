import { chmodSync, existsSync, mkdtempSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { POST } from "@/app/api/consent/route";

/*
 * Consent receipts are the Art. 7(1) proof, so they go to an append-only file
 * on the data volume, not only to container logs that every deploy deletes
 * (X-Ray SEC-F4). What is stored is exactly what the log line always carried.
 */

const DAY = 86_400_000;
const IP = "203.0.113.77";
const UA = "Mozilla/5.0 (TestAgent)";
const asRoot = process.getuid?.() === 0;

let ipSeq = 0;
let dir: string;
let errors: MockInstance<typeof console.error>;

function receipt(overrides: Record<string, unknown> = {}) {
  return {
    id: "3f0c2a8e-1b7d-4a55-9e2f-0c6d8b1a2e33",
    at: new Date().toISOString(),
    policy: "2026-10-19",
    action: "save",
    choices: { preferences: false, analytics: false, marketing: true },
    locale: "ar",
    ...overrides,
  };
}

function send(body: unknown, ip = `192.0.2.${++ipSeq}`): Promise<Response> {
  return POST(
    new Request("http://localhost/api/consent", {
      method: "POST",
      headers: { "content-type": "text/plain", "x-real-ip": ip, "x-forwarded-for": ip, "user-agent": UA },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

const file = () => join(dir, "consent-receipts.jsonl");
const stored = () => readFileSync(file(), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "consent-"));
  vi.stubEnv("LEAD_OUTBOX_DIR", dir);
  vi.spyOn(console, "info").mockImplementation(() => undefined);
  errors = vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("consent receipts", () => {
  it("appends the receipt to the data volume, owner-only, with no IP or user agent", async () => {
    const res = await send(receipt(), IP);
    expect(res.status).toBe(204);
    const [row] = stored();
    expect(Object.keys(row).sort()).toEqual(
      ["action", "at", "choices", "event", "id", "locale", "policy", "receivedAt", "site"].sort(),
    );
    expect(row).toMatchObject({ event: "consent", action: "save", choices: { marketing: true }, locale: "ar" });
    const text = readFileSync(file(), "utf8");
    expect(text).not.toContain(IP);
    expect(text).not.toContain("TestAgent");
    expect(statSync(file()).mode & 0o777).toBe(0o600);
  });

  it("keeps the log line, identical to the stored receipt, as a breadcrumb", async () => {
    await send(receipt());
    const info = vi.mocked(console.info);
    expect(info).toHaveBeenCalledTimes(1);
    expect(JSON.parse(String(info.mock.calls[0][0]))).toEqual(stored()[0]);
  });

  it("adds every receipt to the file and never rewrites earlier ones", async () => {
    await send(receipt({ action: "accept_all" }));
    const first = readFileSync(file(), "utf8");
    await send(receipt({ action: "reject_all" }));
    expect(readFileSync(file(), "utf8").startsWith(first)).toBe(true);
    expect(stored().map((r) => r.action)).toEqual(["accept_all", "reject_all"]);
  });

  it("stores nothing for an invalid receipt", async () => {
    expect((await send(receipt({ action: "maybe" }))).status).toBe(400);
    expect((await send("{not json")).status).toBe(400);
    expect((await send("x".repeat(2_001))).status).toBe(413);
    expect(existsSync(file())).toBe(false);
  });

  it("drops receipts past CONSENT_RECEIPT_RETENTION_DAYS and keeps the rest", async () => {
    vi.stubEnv("CONSENT_RECEIPT_RETENTION_DAYS", "30");
    const at = (ms: number) => new Date(Date.now() - ms).toISOString();
    writeFileSync(
      file(),
      [
        JSON.stringify({ event: "consent", id: "old-receipt", receivedAt: at(40 * DAY) }),
        JSON.stringify({ event: "consent", id: "recent-receipt", receivedAt: at(10 * DAY) }),
      ].join("\n") + "\n",
      { mode: 0o600 },
    );
    await send(receipt());
    expect(stored().map((r) => r.id)).toEqual(["recent-receipt", receipt().id]);
  });

  it.skipIf(asRoot)("says so loudly, and leaves the file alone, when the receipt cannot be stored", async () => {
    const before = `${JSON.stringify({ event: "consent", id: "earlier", receivedAt: new Date().toISOString() })}\n`;
    writeFileSync(file(), before, { mode: 0o600 });
    chmodSync(file(), 0o000);
    let res: Response;
    try {
      res = await send(receipt());
    } finally {
      chmodSync(file(), 0o600);
    }
    expect(res.status).toBe(503);
    expect(errors).toHaveBeenCalledTimes(1);
    expect(errors.mock.calls[0][0]).toMatch(/NOT STORED/);
    expect(readFileSync(file(), "utf8")).toBe(before);
  });

  it("limits one address, so it cannot fill the file for everyone", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 21; i += 1) statuses.push((await send(receipt(), "198.18.0.1")).status);
    expect(statuses.slice(0, 20).every((s) => s === 204)).toBe(true);
    expect(statuses[20]).toBe(429);
    expect(stored()).toHaveLength(20);
  });
});
