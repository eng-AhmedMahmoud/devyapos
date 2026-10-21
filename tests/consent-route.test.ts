import { mkdtempSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/*
 * POST /api/consent, called as the route handler: the consent banner posts one
 * receipt per choice (GDPR Art. 7(1)). A well-formed receipt is accepted with
 * an empty 204 and kept on the data volume, anything else is refused and kept
 * nowhere, and nothing that could identify the visitor — IP, user agent,
 * referer, cookies, or fields the client slipped in — is echoed back, stored or
 * logged. tests/consent-receipt.test.ts covers the file itself (append-only,
 * retention, owner-only, rate limit).
 */

const RECEIPT = {
  id: "3f2a9c1e-5b7d-4e0a-9c41-2d6b8e0f1a73",
  at: "2026-10-22T09:41:00.000Z",
  policy: "2026-10-01",
  action: "save",
  choices: { preferences: true, analytics: false, marketing: true },
  locale: "ar",
};

/** Request headers that identify a visitor; none may reach a response, the file or a log. */
const VISITOR = {
  "x-real-ip": "203.0.113.9",
  "x-forwarded-for": "192.0.2.44, 203.0.113.9",
  "user-agent": "Mozilla/5.0 (T3 consent test)",
  referer: "https://pos.devya.dev/ar/privacy?utm_source=visitor-trace",
  cookie: "session=visitor-cookie-value",
};

let logs: string[];
let dir: string;

beforeEach(() => {
  vi.resetModules();
  dir = mkdtempSync(join(tmpdir(), "consent-route-"));
  vi.stubEnv("LEAD_OUTBOX_DIR", dir);
  logs = [];
  for (const level of ["log", "info", "warn", "error", "debug"] as const) {
    vi.spyOn(console, level).mockImplementation((...args: unknown[]) => {
      logs.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" "));
    });
  }
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

async function post(body: unknown, raw?: string) {
  const { POST } = await import("@/app/api/consent/route");
  return POST(
    new Request("https://pos.devya.dev/api/consent", {
      method: "POST",
      // sendBeacon posts a string body as text/plain; the route must not care.
      headers: { "content-type": "text/plain;charset=UTF-8", ...VISITOR },
      body: raw ?? JSON.stringify(body),
    }),
  );
}

/** Everything written under the data directory, whichever file it went to. */
function storedText(): string {
  return readdirSync(dir)
    .filter((name) => !name.endsWith(".tmp"))
    .map((name) => readFileSync(join(dir, name), "utf8"))
    .join("");
}

/** The receipts kept on the data volume, parsed. */
function stored(): Record<string, unknown>[] {
  return storedText()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

/** The receipt breadcrumbs the route wrote to the log, parsed. */
function logged(): Record<string, unknown>[] {
  return logs
    .map((line) => {
      try {
        return JSON.parse(line) as Record<string, unknown>;
      } catch {
        return null;
      }
    })
    .filter((r): r is Record<string, unknown> => r?.event === "consent");
}

describe("POST /api/consent", () => {
  it.each(["accept_all", "reject_all", "save"])("accepts a well-formed %s receipt with an empty 204", async (action) => {
    const res = await post({ ...RECEIPT, action });
    expect(res.status).toBe(204);
    expect(await res.text()).toBe("");
    expect(stored()).toHaveLength(1);
  });

  it("keeps the choice, and only the choice, on the data volume and in the log", async () => {
    await post({
      ...RECEIPT,
      // Fields a client might add; none of them belongs in a receipt.
      email: "owner@example.test",
      ip: "198.51.100.77",
      userAgent: "spoofed-agent",
      path: "/ar/contact?phone=01055930032",
      choices: { ...RECEIPT.choices, tracking: true },
    });

    const [receipt] = stored();
    expect(receipt).toEqual({
      event: "consent",
      site: "pos.devya.dev",
      id: RECEIPT.id,
      at: RECEIPT.at,
      receivedAt: expect.stringMatching(/^\d{4}-\d\d-\d\dT[\d:.]+Z$/),
      policy: RECEIPT.policy,
      action: "save",
      choices: RECEIPT.choices,
      locale: "ar",
    });
    // The log line is a breadcrumb of the same record, nothing more.
    expect(logged()).toEqual([receipt]);

    const everywhere = `${storedText()}\n${logs.join("\n")}`;
    for (const trace of [
      ...Object.values(VISITOR),
      "203.0.113.9",
      "visitor-trace",
      "owner@example.test",
      "198.51.100.77",
      "spoofed-agent",
      "01055930032",
      "tracking",
    ]) {
      expect(everywhere).not.toContain(trace);
    }
  });

  it("records an unknown locale as null rather than whatever was sent", async () => {
    await post({ ...RECEIPT, locale: "<script>" });
    expect(stored()[0].locale).toBeNull();
    expect(`${storedText()}\n${logs.join("\n")}`).not.toContain("<script>");
  });

  it("still answers 204 without a data directory, and says the receipt was not stored", async () => {
    vi.stubEnv("LEAD_OUTBOX_DIR", "");
    const res = await post(RECEIPT);
    // The beacon never reads the answer; an unconfigured volume is a
    // deployment gap for the logs, not the visitor's problem.
    expect(res.status).toBe(204);
    expect(logs.filter((line) => /NOT STORED/.test(line))).toEqual([
      `[consent] receipt NOT STORED id=${RECEIPT.id} error=not_configured`,
    ]);
  });

  it.each([
    ["broken JSON", "{not json"],
    ["an empty body", ""],
    ["JSON null", "null"],
    ["a JSON number", "42"],
    ["a JSON boolean", "true"],
    ["a JSON string", '"accept_all"'],
    ["a JSON array", "[]"],
  ])("refuses %s with 400, not 500", async (_label, raw) => {
    const res = await post(null, raw);
    expect(res.status).toBe(400);
    expect(await res.text()).toBe("");
    expect(stored()).toEqual([]);
    expect(logged()).toEqual([]);
  });

  it.each([
    ["no id", { id: undefined }],
    ["a short id", { id: "abc123" }],
    ["an id with spaces", { id: "3f2a9c1e 5b7d 4e0a" }],
    ["a 65-char id", { id: "a".repeat(65) }],
    ["no timestamp", { at: undefined }],
    ["a timestamp that is not a date", { at: "yesterday-ish" }],
    ["a date without a time", { at: "2026-10-22" }],
    ["a timestamp with free text after it", { at: "2026-10-22T09:41:00.000Z (call me)" }],
    ["no policy", { policy: undefined }],
    ["a 33-char policy", { policy: "p".repeat(33) }],
    ["a policy with spaces", { policy: "v 1" }],
    ["an unknown action", { action: "maybe" }],
    ["no action", { action: undefined }],
    ["no choices", { choices: undefined }],
    ["a missing category", { choices: { preferences: true, analytics: false } }],
    ["a category that is not a boolean", { choices: { ...RECEIPT.choices, marketing: "yes" } }],
  ])("refuses a receipt with %s", async (_label, patch) => {
    const res = await post({ ...RECEIPT, ...patch });
    expect(res.status).toBe(400);
    expect(stored()).toEqual([]);
    expect(logged()).toEqual([]);
  });

  it("refuses with 400 when the body cannot be read", async () => {
    const { POST } = await import("@/app/api/consent/route");
    const broken = new ReadableStream({
      pull(controller) {
        controller.error(new Error("connection reset"));
      },
    });
    const res = await POST(
      new Request("https://pos.devya.dev/api/consent", {
        method: "POST",
        body: broken,
        duplex: "half",
      } as RequestInit & { duplex: "half" }),
    );
    expect(res.status).toBe(400);
    expect(stored()).toEqual([]);
  });

  it("refuses a body over 2,000 characters with 413, before parsing it", async () => {
    const res = await post(null, JSON.stringify({ ...RECEIPT, pad: "x".repeat(2_000) }));
    expect(res.status).toBe(413);
    expect(stored()).toEqual([]);
  });

  it("accepts a receipt right at the 2,000-character cap", async () => {
    const base = JSON.stringify({ ...RECEIPT, pad: "" });
    const raw = JSON.stringify({ ...RECEIPT, pad: "x".repeat(2_000 - base.length) });
    expect(raw).toHaveLength(2_000);
    expect((await post(null, raw)).status).toBe(204);
    // The padding was read past, not kept.
    expect(storedText()).not.toContain("xxxx");
  });

  it("answers 405 to GET", async () => {
    const { GET } = await import("@/app/api/consent/route");
    expect(GET().status).toBe(405);
  });
});
