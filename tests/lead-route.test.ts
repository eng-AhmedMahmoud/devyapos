import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { POST } from "@/app/api/lead/route";

/*
 * The lead route's delivery paths: the forward contract (version field, a 4xx
 * is final, a transient failure is retried once) and the one loud, PII-free
 * log line every unforwarded lead must produce (X-Ray ARC-F6, REQ-F5,
 * ARC-F1, AIN-F9).
 */

const LEAD = { name: "Sara Mostafa", restaurant: "Koshary Corner", phone: "01012345678", message: "Call after 5", locale: "en" };
const PII = ["Sara", "Koshary", "1012345678", "Call after"];
const asRoot = process.getuid?.() === 0;

let ipSeq = 0;
let errors: MockInstance<typeof console.error>;
let dir: string;

function submit(): Promise<Response> {
  ipSeq += 1;
  return POST(
    new Request("http://localhost/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json", "x-real-ip": `198.51.100.${ipSeq}` },
      body: JSON.stringify(LEAD),
    }),
  );
}

function stubForward(...statuses: (number | "network")[]) {
  const fetch = vi.fn(async () => {
    const next = statuses.shift() ?? 200;
    if (next === "network") throw new TypeError("fetch failed");
    return new Response(null, { status: next });
  });
  vi.stubGlobal("fetch", fetch);
  vi.stubEnv("LEAD_FORWARD_URL", "http://receiver.test/leads");
  return fetch;
}

const outbox = () => readFileSync(join(dir, "leads-outbox.jsonl"), "utf8");

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "lead-route-"));
  vi.stubEnv("LEAD_OUTBOX_DIR", dir);
  vi.stubEnv("LEAD_FORWARD_URL", "");
  errors = vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.spyOn(console, "log").mockImplementation(() => undefined);
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

/**
 * The single error line: one argument, one line, `key=value` fields — and
 * nothing of the lead itself.
 */
function loudLine() {
  expect(errors).toHaveBeenCalledTimes(1);
  const args = errors.mock.calls[0] as unknown[];
  expect(args).toHaveLength(1);
  const message = String(args[0]);
  expect(message).not.toContain("\n");
  for (const value of PII) expect(message).not.toContain(value);
  const fields = Object.fromEntries([...message.matchAll(/(\w+)=(\S+)/g)].map(([, k, v]) => [k, v]));
  return { message, fields };
}

describe("lead route", () => {
  it("forwards a versioned payload and logs no error", async () => {
    const fetch = stubForward(200);
    const res = await submit();
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, delivered: ["forward"] });
    const sent = JSON.parse(String((fetch.mock.calls[0] as unknown as [string, RequestInit])[1].body));
    expect(sent).toMatchObject({ type: "lead", version: 1 });
    expect(errors).not.toHaveBeenCalled();
  });

  it("does not retry a 4xx: it is a permanent rejection", async () => {
    const fetch = stubForward(422, 200);
    const res = await submit();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(await res.json()).toMatchObject({ ok: true, delivered: ["outbox"] });
    const { message, fields } = loudLine();
    expect(message).toMatch(/NOT FORWARDED/);
    expect(fields).toMatchObject({ reason: "rejected", status: "422", pending: "1" });
  });

  it("retries a 5xx once and is done when the retry lands", async () => {
    const fetch = stubForward(503, 200);
    const res = await submit();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(await res.json()).toMatchObject({ ok: true, delivered: ["forward"] });
    expect(errors).not.toHaveBeenCalled();
  });

  it("keeps the lead in the outbox after two transient failures", async () => {
    const fetch = stubForward("network", 502);
    const res = await submit();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(await res.json()).toMatchObject({ ok: true, delivered: ["outbox"] });
    expect(loudLine().fields).toMatchObject({ reason: "failed", pending: "1" });
    expect(JSON.parse(outbox().trim())).toMatchObject({ version: 1, lead: { phone: "+201012345678" } });
  });

  it("with no forward URL, logs one error line per lead with a running count", async () => {
    await submit();
    expect(loudLine().fields).toMatchObject({ reason: "not_configured", pending: "1" });
    errors.mockClear();
    const res = await submit();
    const { fields } = loudLine();
    expect(fields).toMatchObject({ reason: "not_configured", pending: "2" });
    expect(fields.id).toBe((await res.json()).id);
  });

  it.skipIf(asRoot)("answers 503 and leaves the outbox intact when it cannot be read", async () => {
    const path = join(dir, "leads-outbox.jsonl");
    const before = `{"id":"earlier","receivedAt":"${new Date().toISOString()}"}\n`;
    writeFileSync(path, before, { mode: 0o600 });
    chmodSync(path, 0o000);
    let res: Response;
    try {
      res = await submit();
    } finally {
      chmodSync(path, 0o600);
    }
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: "unavailable" });
    const { message, fields } = loudLine();
    expect(message).toMatch(/LOST/);
    expect(fields).toMatchObject({ reason: "not_configured", outbox: "EACCES" });
    expect(outbox()).toBe(before);
  });
});
