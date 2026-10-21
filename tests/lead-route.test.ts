import { mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";

/*
 * POST /api/lead, called as the route handler it is: a Request in, a Response
 * out, `fetch` stubbed where the forward would leave the box, and the outbox
 * pointed at a temp directory. The assertions stay on what the outside world
 * sees — status, response JSON, what was forwarded, whether an outbox line
 * appeared, what reached the logs — so they hold however the route is
 * arranged inside.
 *
 * The module is re-imported for every test: the rate limiter and the forward
 * timeout are module state, read once at import.
 */

const FORWARD_URL = "https://crm.example.test/hooks/lead";
const BEARER = "t3-bearer";
const IP = "203.0.113.7";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/** A lead as the browser posts it: Egyptian mobile typed with spaces, extra attribution junk. */
const LEAD = {
  name: "  Ahmed   Mahmoud ",
  restaurant: "Koshary El Tahrir",
  phone: "0105 593 0032",
  branches: "3",
  message: "  We need a POS for three branches.  ",
  locale: "en",
  attribution: {
    source: " meta ",
    campaign: "eg-launch",
    landingPath: "/en?utm_source=meta",
    ip: "198.51.100.1",
  },
  company: "",
};

type Fetch = Mock<(input: string | URL | Request, init?: RequestInit) => Promise<Response>>;

let fetchMock: Fetch;
let logs: string[];

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("LEAD_FORWARD_URL", FORWARD_URL);
  vi.stubEnv("LEAD_FORWARD_TOKEN", BEARER);
  vi.stubEnv("LEAD_OUTBOX_DIR", "");
  vi.stubEnv("LEAD_FORWARD_TIMEOUT_MS", "");
  fetchMock = vi.fn(async () => new Response(null, { status: 202 }));
  vi.stubGlobal("fetch", fetchMock);

  // Everything the route logs, as one string per call, for the "no lead in
  // the logs" checks. Silenced so the run stays readable.
  logs = [];
  for (const level of ["log", "info", "warn", "error", "debug"] as const) {
    vi.spyOn(console, level).mockImplementation((...args: unknown[]) => {
      logs.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" "));
    });
  }
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

async function route() {
  return import("@/app/api/lead/route");
}

function request(
  body: unknown,
  { headers = {}, raw }: { headers?: Record<string, string>; raw?: string } = {},
): Request {
  return new Request("https://pos.devya.dev/api/lead", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-real-ip": IP,
      "user-agent": "Mozilla/5.0 (T3 test)",
      referer: "https://pos.devya.dev/en/contact",
      ...headers,
    },
    body: raw ?? JSON.stringify(body),
  });
}

async function send(body: unknown, options?: Parameters<typeof request>[1]) {
  const { POST } = await route();
  const res = await POST(request(body, options));
  return { res, json: (await res.json()) as Record<string, unknown> };
}

/** The JSON bodies the route forwarded, in call order. */
function forwarded(): Record<string, unknown>[] {
  return fetchMock.mock.calls.map(([, init]) => JSON.parse(String(init?.body)));
}

function outboxDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "lead-route-"));
  vi.stubEnv("LEAD_OUTBOX_DIR", dir);
  return dir;
}

/** Every JSON line in every file under `dir` — the outbox's file name is its own business. */
function outboxLines(dir: string): Record<string, unknown>[] {
  const lines: Record<string, unknown>[] = [];
  const walk = (path: string) => {
    for (const name of readdirSync(path)) {
      const full = join(path, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (!name.endsWith(".tmp")) {
        for (const line of readFileSync(full, "utf8").split("\n").filter(Boolean)) {
          lines.push(JSON.parse(line));
        }
      }
    }
  };
  walk(dir);
  return lines;
}

/** A forward target that answers each call with the next status in the list. */
function answers(...statuses: number[]) {
  let i = 0;
  fetchMock.mockImplementation(async () => new Response(null, { status: statuses[i++] ?? 500 }));
}

describe("POST /api/lead — accepted", () => {
  it("forwards a valid lead in the documented shape, with the bearer token", async () => {
    const before = Date.now();
    const { res, json } = await send(LEAD);

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, id: expect.stringMatching(UUID), delivered: ["forward"] });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe(FORWARD_URL);
    expect(init?.method).toBe("POST");
    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toBe(`Bearer ${BEARER}`);
    expect(headers.get("content-type")).toMatch(/^application\/json/);

    const [payload] = forwarded();
    expect(payload).toMatchObject({ type: "lead", id: json.id, site: "pos.devya.dev" });
    expect(payload.lead).toEqual({
      name: "Ahmed Mahmoud",
      restaurant: "Koshary El Tahrir",
      phone: "+201055930032",
      branches: 3,
      message: "We need a POS for three branches.",
      locale: "en",
    });
    // Whitelisted and trimmed; an unknown key the client slipped in is gone.
    expect(payload.attribution).toEqual({
      source: "meta",
      campaign: "eg-launch",
      landingPath: "/en?utm_source=meta",
    });
    expect(payload.context).toEqual({
      userAgent: "Mozilla/5.0 (T3 test)",
      referer: "https://pos.devya.dev/en/contact",
      country: null,
    });

    // Rounded down to the minute, and not in the future.
    const receivedAt = String(payload.receivedAt);
    expect(receivedAt).toMatch(/^\d{4}-\d\d-\d\dT\d\d:\d\d:00\.000Z$/);
    expect(Date.parse(receivedAt)).toBeLessThanOrEqual(Date.now());
    expect(Date.parse(receivedAt)).toBeGreaterThan(before - 60_000);

    // The client's IP is used for rate limiting only — never forwarded.
    expect(JSON.stringify(payload)).not.toContain(IP);
  });

  it("sends no authorization header when no token is configured", async () => {
    vi.stubEnv("LEAD_FORWARD_TOKEN", "");
    const { res } = await send(LEAD);
    expect(res.status).toBe(200);
    expect(new Headers(fetchMock.mock.calls[0][1]?.headers).has("authorization")).toBe(false);
  });

  it("caps the client hints it forwards", async () => {
    await send(LEAD, { headers: { "user-agent": "u".repeat(5_000), referer: `https://x.test/${"r".repeat(5_000)}` } });
    const { context } = forwarded()[0] as { context: { userAgent: string; referer: string } };
    expect(context.userAgent.length).toBeLessThanOrEqual(300);
    expect(context.referer.length).toBeLessThanOrEqual(500);
  });

  it("passes injection-shaped text through as data and echoes none of it back", async () => {
    const hostile = {
      ...LEAD,
      name: `<script>alert(1)</script>`,
      restaurant: `Robert'); DROP TABLE leads;--`,
      message: `{{7*7}} \${process.env} <img src=x onerror=alert(1)>`,
    };
    const { res, json } = await send(hostile);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/^application\/json/);
    expect(Object.keys(json).sort()).toEqual(["delivered", "id", "ok"]);
    const lead = forwarded()[0].lead as Record<string, string>;
    expect(lead.name).toBe(hostile.name);
    expect(lead.restaurant).toBe(hostile.restaurant);
    expect(lead.message).toBe(hostile.message);
  });
});

describe("POST /api/lead — refused before anything leaves the box", () => {
  it.each([
    ["text/plain", "text/plain;charset=UTF-8"],
    ["a form post", "application/x-www-form-urlencoded"],
    ["multipart", "multipart/form-data; boundary=x"],
  ])("answers 415 to %s", async (_label, type) => {
    const { res, json } = await send(LEAD, { headers: { "content-type": type } });
    expect(res.status).toBe(415);
    expect(json).toEqual({ ok: false, error: "unsupported_media_type" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ["broken JSON", "{not json"],
    ["an empty body", ""],
    ["JSON null", "null"],
    ["a JSON string", '"lead"'],
    ["a JSON number", "42"],
  ])("answers 400 invalid_json to %s", async (_label, raw) => {
    const { res, json } = await send(null, { raw });
    expect(res.status).toBe(400);
    expect(json).toEqual({ ok: false, error: "invalid_json" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ["missing name", { name: undefined }, { name: "required" }],
    ["blank name", { name: "   " }, { name: "required" }],
    ["one-letter name", { name: "A" }, { name: "too_short" }],
    ["81-char name", { name: "n".repeat(81) }, { name: "too_long" }],
    ["missing restaurant", { restaurant: "" }, { restaurant: "required" }],
    ["one-letter restaurant", { restaurant: "K" }, { restaurant: "too_short" }],
    ["121-char restaurant", { restaurant: "r".repeat(121) }, { restaurant: "too_long" }],
    ["missing phone", { phone: "" }, { phone: "required" }],
    ["Egyptian landline", { phone: "02 2345 6789" }, { phone: "invalid_phone" }],
    ["013 prefix", { phone: "01355930032" }, { phone: "invalid_phone" }],
    ["Saudi mobile", { phone: "+966 50 123 4567" }, { phone: "invalid_phone" }],
    ["zero branches", { branches: "0" }, { branches: "invalid_branches" }],
    ["501 branches", { branches: 501 }, { branches: "invalid_branches" }],
    ["fractional branches", { branches: "2.5" }, { branches: "invalid_branches" }],
    ["1201-char message", { message: "m".repeat(1201) }, { message: "too_long" }],
  ])("answers 400 validation_failed for a %s", async (_label, patch, fields) => {
    const { res, json } = await send({ ...LEAD, ...patch });
    expect(res.status).toBe(400);
    expect(json).toEqual({ ok: false, error: "validation_failed", fields });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports every bad field at once", async () => {
    const { res, json } = await send({});
    expect(res.status).toBe(400);
    expect(json.fields).toEqual({ name: "required", restaurant: "required", phone: "required" });
  });

  it("refuses an oversized body and forwards nothing", async () => {
    const dir = outboxDir();
    const { res } = await send({ ...LEAD, message: "x".repeat(1_000_000) });
    // 400 (the message cap) today; 413 once the route caps bytes before parsing.
    expect([400, 413]).toContain(res.status);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(outboxLines(dir)).toEqual([]);
  });

  it("answers a filled honeypot with a quiet 200 and keeps nothing", async () => {
    const dir = outboxDir();
    const { res, json } = await send({ ...LEAD, company: "Acme Bots Ltd" });
    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, id: expect.stringMatching(UUID), delivered: [] });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(outboxLines(dir)).toEqual([]);
  });

  it("does not treat a whitespace-only honeypot as a bot", async () => {
    const { json } = await send({ ...LEAD, company: "   " });
    expect(json.delivered).toEqual(["forward"]);
  });

  it("answers 405 to GET", async () => {
    const { GET } = await route();
    const res = GET();
    expect(res.status).toBe(405);
    expect(await res.json()).toEqual({ ok: false, error: "method_not_allowed" });
  });
});

describe("POST /api/lead — when the forward fails", () => {
  it("retries a 5xx once with the same id, and stops at the first success", async () => {
    answers(503, 200);
    const { res, json } = await send(LEAD);
    expect(res.status).toBe(200);
    expect(json.delivered).toEqual(["forward"]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [first, second] = forwarded();
    expect(second.id).toBe(first.id);
    expect(first.id).toBe(json.id);
  });

  it("keeps the lead in the outbox after two 5xx answers", async () => {
    const dir = outboxDir();
    answers(500, 502);
    const { res, json } = await send(LEAD);
    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, id: expect.stringMatching(UUID), delivered: ["outbox"] });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // One line, carrying the lead under the id the visitor was given — however
    // the outbox chooses to wrap it.
    const lines = outboxLines(dir);
    expect(lines).toHaveLength(1);
    const kept = JSON.stringify(lines[0]);
    expect(kept).toContain(`"${String(json.id)}"`);
    expect(kept).toContain('"+201055930032"');
    expect(kept).toContain('"Koshary El Tahrir"');
  });

  it("keeps the lead in the outbox when the target refuses it with a 4xx", async () => {
    const dir = outboxDir();
    answers(422, 422);
    const { res, json } = await send(LEAD);
    expect(res.status).toBe(200);
    expect(json.delivered).toEqual(["outbox"]);
    expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(1);
    expect(fetchMock.mock.calls.length).toBeLessThanOrEqual(2);
    expect(outboxLines(dir)).toHaveLength(1);
  });

  // README (LEAD_FORWARD_TIMEOUT_MS) promises "4xx is treated as permanent and
  // not retried", and the route's own comment agrees, but forward() calls
  // postOnce() a second time whatever the first answer was. Routed to the lead
  // durability track (T2), which owns the forward contract.
  it.todo("does not retry a 4xx — one forward call, then the outbox");

  it("keeps the lead in the outbox when the target cannot be reached", async () => {
    const dir = outboxDir();
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    const { res, json } = await send(LEAD);
    expect(res.status).toBe(200);
    expect(json.delivered).toEqual(["outbox"]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(outboxLines(dir)).toHaveLength(1);
  });

  it("gives up on a target that hangs, after the timeout, and keeps the lead", async () => {
    const dir = outboxDir();
    vi.stubEnv("LEAD_FORWARD_TIMEOUT_MS", "40");
    const signals: AbortSignal[] = [];
    fetchMock.mockImplementation(
      (_url, init) =>
        new Promise<Response>((_resolve, reject) => {
          const signal = init!.signal!;
          signals.push(signal);
          signal.addEventListener("abort", () => reject(signal.reason));
        }),
    );

    const started = Date.now();
    const { res, json } = await send(LEAD);
    expect(res.status).toBe(200);
    expect(json.delivered).toEqual(["outbox"]);
    expect(signals.length).toBeGreaterThanOrEqual(1);
    expect(signals.every((s) => s.aborted)).toBe(true);
    // Two attempts at 40 ms each: well inside one attempt at the 4 s default,
    // with room for a busy CI runner.
    expect(Date.now() - started).toBeLessThan(3_500);
    expect(outboxLines(dir)).toHaveLength(1);
  });

  it("goes straight to the outbox when no forward target is configured", async () => {
    const dir = outboxDir();
    vi.stubEnv("LEAD_FORWARD_URL", "");
    const { res, json } = await send(LEAD);
    expect(res.status).toBe(200);
    expect(json.delivered).toEqual(["outbox"]);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(outboxLines(dir)).toHaveLength(1);
  });

  it("answers 503 when the lead can be neither forwarded nor kept", async () => {
    answers(500, 500);
    const { res, json } = await send(LEAD);
    expect(res.status).toBe(503);
    expect(json).toEqual({ ok: false, error: "unavailable" });
  });

  it("answers 503 when the outbox cannot be written", async () => {
    const dir = mkdtempSync(join(tmpdir(), "lead-route-"));
    const file = join(dir, "not-a-directory");
    writeFileSync(file, "");
    vi.stubEnv("LEAD_OUTBOX_DIR", join(file, "outbox"));
    vi.stubEnv("LEAD_FORWARD_URL", "");
    const { res, json } = await send(LEAD);
    expect(res.status).toBe(503);
    expect(json).toEqual({ ok: false, error: "unavailable" });
  });

  it("never puts the lead itself in the logs, whichever way it went", async () => {
    const dir = outboxDir();
    await send(LEAD); // forwarded
    answers(500, 500);
    await send({ ...LEAD, phone: "+20 115 593 0032" }); // outbox
    vi.stubEnv("LEAD_OUTBOX_DIR", "");
    await send(LEAD); // lost
    await send({ ...LEAD, company: "bot" }); // honeypot
    expect(outboxLines(dir)).toHaveLength(1);

    const all = logs.join("\n");
    expect(logs.length).toBeGreaterThan(0);
    for (const secret of [
      "Ahmed Mahmoud",
      "Koshary",
      "1055930032",
      "1155930032",
      "0105 593 0032",
      "three branches",
      "Mozilla/5.0 (T3 test)",
      "/en/contact",
      IP,
    ]) {
      expect(all).not.toContain(secret);
    }
  });
});

describe("POST /api/lead — rate limit", () => {
  async function burst(count: number, headers: (i: number) => Record<string, string>) {
    const { POST } = await route();
    const statuses: number[] = [];
    let last: Response | undefined;
    for (let i = 0; i < count; i++) {
      last = await POST(request(LEAD, { headers: headers(i) }));
      statuses.push(last.status);
    }
    return { POST, statuses, last: last! };
  }

  it("refuses the 13th request inside the window from one IP, and not another IP", async () => {
    const { POST, statuses, last } = await burst(13, () => ({ "x-real-ip": "198.51.100.20" }));
    expect(statuses.slice(0, 12).every((s) => s === 200)).toBe(true);
    expect(last.status).toBe(429);
    const retryAfter = Number(last.headers.get("retry-after"));
    expect(retryAfter).toBeGreaterThan(0);
    expect(retryAfter).toBeLessThanOrEqual(600);
    expect(await last.json()).toEqual({ ok: false, error: "rate_limited", retryAfter });
    expect(fetchMock).toHaveBeenCalledTimes(12);

    const other = await POST(request(LEAD, { headers: { "x-real-ip": "198.51.100.21" } }));
    expect(other.status).toBe(200);
  });

  it("counts rejected submissions too", async () => {
    const { POST } = await route();
    for (let i = 0; i < 12; i++) {
      const res = await POST(request({ name: "x" }, { headers: { "x-real-ip": "198.51.100.30" } }));
      expect(res.status).toBe(400);
    }
    const res = await POST(request(LEAD, { headers: { "x-real-ip": "198.51.100.30" } }));
    expect(res.status).toBe(429);
  });

  it("keys on X-Real-IP, so a rotating X-Forwarded-For does not get round it", async () => {
    const { statuses } = await burst(13, (i) => ({
      "x-real-ip": "198.51.100.40",
      "x-forwarded-for": `192.0.2.${i + 1}`,
    }));
    expect(statuses.at(-1)).toBe(429);
  });

  it("keys on the last X-Forwarded-For hop, which the client cannot choose", async () => {
    const { statuses } = await burst(13, (i) => ({
      "x-real-ip": "",
      "x-forwarded-for": `192.0.2.${i + 1}, 198.51.100.50`,
    }));
    expect(statuses.at(-1)).toBe(429);
  });

  it("puts every request without a client address in one shared bucket", async () => {
    const { statuses } = await burst(13, () => ({ "x-real-ip": "" }));
    expect(statuses.at(-1)).toBe(429);
  });

  // About a second locally; the headroom is for a slow CI runner.
  it("tracks at most 5,000 addresses, forgetting the least recently seen first", { timeout: 20_000 }, async () => {
    const { POST } = await route();
    const hit = (ip: string) => POST(request({}, { headers: { "x-real-ip": ip } }));

    for (let i = 0; i < 12; i++) await hit("198.51.100.70");
    expect((await hit("198.51.100.70")).status).toBe(429);

    // 5,000 other addresses push the limited one out of the table…
    for (let i = 0; i < 5_000; i++) await hit(`10.${(i >> 16) & 255}.${(i >> 8) & 255}.${i & 255}`);
    // …so it starts again from an empty window, and the heap stays bounded.
    expect((await hit("198.51.100.70")).status).toBe(400);
  });

  it("opens again once the window has passed", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-22T10:00:00Z"));
    const { POST, last } = await burst(13, () => ({ "x-real-ip": "198.51.100.60" }));
    expect(last.status).toBe(429);

    vi.setSystemTime(new Date("2026-10-22T10:09:00Z"));
    expect((await POST(request(LEAD, { headers: { "x-real-ip": "198.51.100.60" } }))).status).toBe(429);

    vi.setSystemTime(new Date("2026-10-22T10:10:01Z"));
    expect((await POST(request(LEAD, { headers: { "x-real-ip": "198.51.100.60" } }))).status).toBe(200);
  });
});
