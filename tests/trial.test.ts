import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { normalisePhone } from "@/lib/phone";
import {
  TRIAL_HONEYPOT,
  TRIAL_LIMITS,
  readClaimAnswer,
  validateTrial,
  type TrialValues,
} from "@/lib/trial";

/*
 * The accounting-trial sign-up: the inline checks (a copy of the store's rules
 * in bohub-pos ops-store/src/trial/validate.ts) and the reading of the claim
 * route's answer. readClaimAnswer is the gate in front of the one thing on the
 * page a person acts on — a setup link and token — so every way a 201 can be
 * not quite right must come out as an error, never as a success.
 */

describe("normalisePhone — Egypt", () => {
  it.each([
    ["national mobile", "01055930032", "+201055930032"],
    ["+20", "+201055930032", "+201055930032"],
    ["0020", "00201055930032", "+201055930032"],
    ["20 without plus", "201055930032", "+201055930032"],
    ["bare mobile", "1055930032", "+201055930032"],
    ["spaced, bracketed, dotted, dashed", "(010) 5593.00-32", "+201055930032"],
    ["with bidi marks after the plus", "+‎20 10 5593 0032‏", "+201055930032"],
    ["with a bidi mark before a national number", "‏010 5593 0032", "+201055930032"],
    ["Arabic-Indic", "٠١٠٥٥٩٣٠٠٣٢", "+201055930032"],
    ["Persian", "۰۱۰۵۵۹۳۰۰۳۲", "+201055930032"],
    ["any mobile block (shape only)", "01355930032", "+201355930032"],
    ["Cairo landline", "02 2345 6789", "+20223456789"],
    ["Alexandria landline", "03 345 6789", "+2033456789"],
    ["landline 0501234567", "0501234567", "+20501234567"],
    // A bare number that merely starts with the country code's digits stays
    // national: only 12 digits or more are read as 20 + a national number.
    ["bare Cairo landline that starts with 20", "201234567", "+20201234567"],
  ])("accepts %s", (_label, raw, expected) => {
    expect(normalisePhone(raw, "EG")).toBe(expected);
  });

  it.each([
    ["a Saudi number", "+966501234567"],
    ["0020 with a national 0", "+20 010 5593 0032"],
    ["a pasted tel: link", "tel:+201055930032"],
    ["letters", "010-CALL-ME"],
    ["two plus signs", "++201055930032"],
    ["a plus in the middle", "20+1055930032"],
    ["20 and a landline, without the plus (ambiguous, so national)", "20223456789"],
    ["a mobile one digit short", "010559300"],
    ["a mobile one digit long", "010559300321"],
    ["a landline too short", "02 234 567"],
    ["empty", ""],
    ["blank", "   "],
  ])("rejects %s", (_label, raw) => {
    expect(normalisePhone(raw, "EG")).toBeNull();
  });
});

describe("normalisePhone — Saudi Arabia", () => {
  it.each([
    ["national mobile", "0501234567", "+966501234567"],
    ["+966", "+966501234567", "+966501234567"],
    ["00966", "00966501234567", "+966501234567"],
    ["966 without plus", "966501234567", "+966501234567"],
    ["bare mobile", "501234567", "+966501234567"],
    ["spaced", "+966 50 123 4567", "+966501234567"],
    ["Arabic-Indic", "٠٥٠١٢٣٤٥٦٧", "+966501234567"],
    ["Riyadh landline", "011 234 5678", "+966112345678"],
  ])("accepts %s", (_label, raw, expected) => {
    expect(normalisePhone(raw, "SA")).toBe(expected);
  });

  it.each([
    ["an Egyptian number", "+201055930032"],
    ["0020 for Saudi", "00201055930032"],
    ["a mobile one digit short", "050123456"],
    ["a mobile one digit long", "05012345678"],
    ["a 06 prefix", "0601234567"],
    ["a 9-digit 966 that is too short to carry a country code", "966501234"],
  ])("rejects %s", (_label, raw) => {
    expect(normalisePhone(raw, "SA")).toBeNull();
  });
});

describe("validateTrial", () => {
  const VALID: TrialValues = {
    name: "Ahmed Mahmoud",
    company: "Koshary El Tahrir",
    email: "owner@koshary.example",
    phone: "01055930032",
    country: "EG",
  };

  const errorsFor = (patch: Partial<TrialValues>) => validateTrial({ ...VALID, ...patch });

  it("passes a valid sign-up, Egyptian or Saudi", () => {
    expect(validateTrial(VALID)).toEqual({});
    expect(validateTrial({ ...VALID, country: "SA", phone: "0501234567" })).toEqual({});
  });

  describe.each([
    ["name", TRIAL_LIMITS.name.max],
    ["company", TRIAL_LIMITS.company.max],
  ] as const)("%s", (field, max) => {
    it.each([
      ["empty", "", "required"],
      ["blank", " \t ", "required"],
      ["one character", " A ", "too_short"],
      ["one over the cap", "x".repeat(max + 1), "too_long"],
    ])("is %s → %s", (_label, value, code) => {
      expect(errorsFor({ [field]: value })).toEqual({ [field]: code });
    });

    it.each([
      ["two characters", "Ab"],
      ["exactly the cap", "x".repeat(max)],
      ["over the cap only before whitespace collapses", `a${" ".repeat(max)}b`],
    ])("accepts %s", (_label, value) => {
      expect(errorsFor({ [field]: value })).toEqual({});
    });
  });

  describe("email", () => {
    it.each([
      ["empty", "", "required"],
      ["blank", "   ", "required"],
      ["no @", "owner.example.com", "invalid"],
      ["no domain dot", "owner@example", "invalid"],
      ["a one-letter TLD", "owner@example.c", "invalid"],
      ["a space inside", "own er@example.com", "invalid"],
      ["two @", "owner@@example.com", "invalid"],
      ["an empty label", "owner@example..com", "invalid"],
      ["a leading dot in the domain", "owner@.example.com", "invalid"],
      ["no local part", "@example.com", "invalid"],
      ["255 characters", `${"a".repeat(244)}@example.com`, "invalid"],
    ])("is %s → %s", (_label, value, code) => {
      expect(errorsFor({ email: value })).toEqual({ email: code });
    });

    it.each([
      ["plain", "owner@example.com"],
      ["upper case", "Owner@Example.COM"],
      ["padded", "  owner@example.com  "],
      ["a subdomain and a plus tag", "owner+trial@mail.example.com.eg"],
      ["exactly 254 characters", `${"a".repeat(242)}@example.com`],
    ])("accepts %s", (_label, value) => {
      expect(errorsFor({ email: value })).toEqual({});
    });
  });

  describe("country and phone", () => {
    it("asks for a country before judging the phone", () => {
      expect(errorsFor({ country: "AE" as TrialValues["country"], phone: "" })).toEqual({ country: "required" });
    });

    it.each([
      ["blank", "  ", "required"],
      ["the wrong country's number", "+966501234567", "invalid"],
      ["garbage", "call me", "invalid"],
    ])("phone %s → %s", (_label, phone, code) => {
      expect(errorsFor({ phone })).toEqual({ phone: code });
    });

    it("judges the phone by the chosen country", () => {
      expect(errorsFor({ country: "SA", phone: "01055930032" })).toEqual({ phone: "invalid" });
      expect(errorsFor({ country: "SA", phone: "+966501234567" })).toEqual({});
    });
  });

  it("reports every problem at once", () => {
    expect(validateTrial({ name: "", company: "x", email: "nope", phone: "", country: "EG" })).toEqual({
      name: "required",
      company: "too_short",
      email: "invalid",
      phone: "required",
    });
  });
});

describe("readClaimAnswer", () => {
  const STACK = "https://acme-7f3a.trial.example.test";
  const CLAIMED = {
    url: STACK,
    setupUrl: `${STACK}/setup`,
    setupToken: "Zx9_q2-LmN4pR7sT",
    expiresAt: "2026-11-05T00:00:00.000Z",
  };

  it("reads a well-formed 201 as claimed, and passes on only the four fields", () => {
    expect(readClaimAnswer(201, { ...CLAIMED, internalId: 42, adminPassword: "x" })).toEqual({
      kind: "claimed",
      ...CLAIMED,
    });
  });

  it.each([
    ["a stack URL with a port", { url: `${STACK}:8443`, setupUrl: `${STACK}:8443/setup` }],
    ["a token at the 256-character cap", { setupToken: "t".repeat(256) }],
    ["a token of every printable ASCII kind", { setupToken: "!~#$%&'()*+,-./0123456789:;<=>?@[]^_`{|}" }],
    ["a date-only expiry", { expiresAt: "2026-11-05" }],
  ])("still accepts %s", (_label, patch) => {
    expect(readClaimAnswer(201, { ...CLAIMED, ...patch }).kind).toBe("claimed");
  });

  it.each([
    ["no body", null],
    ["a string body", "created"],
    ["an empty object", {}],
    ["an http stack URL", { ...CLAIMED, url: "http://acme.trial.example.test", setupUrl: "http://acme.trial.example.test/setup" }],
    ["a stack URL with a path", { ...CLAIMED, url: `${STACK}/app`, setupUrl: `${STACK}/app/setup` }],
    ["a stack URL with credentials", { ...CLAIMED, url: "https://user:pw@acme.example.test", setupUrl: "https://user:pw@acme.example.test/setup" }],
    ["a javascript: URL", { ...CLAIMED, url: "javascript:alert(1)", setupUrl: "javascript:alert(1)/x" }],
    ["a non-string URL", { ...CLAIMED, url: 42 }],
    ["a setup link on another host", { ...CLAIMED, setupUrl: "https://evil.example.test/setup" }],
    ["a setup link on a look-alike host", { ...CLAIMED, setupUrl: `${STACK}.evil.example.test/setup` }],
    ["a setup link that is the bare stack URL", { ...CLAIMED, setupUrl: STACK }],
    ["a non-string setup link", { ...CLAIMED, setupUrl: null }],
    ["a 15-character token", { ...CLAIMED, setupToken: "t".repeat(15) }],
    ["a 257-character token", { ...CLAIMED, setupToken: "t".repeat(257) }],
    ["a token with a space", { ...CLAIMED, setupToken: "abcdefgh ijklmnop" }],
    ["a token with a newline", { ...CLAIMED, setupToken: "abcdefghijklmnop\n" }],
    ["a non-ASCII token", { ...CLAIMED, setupToken: "abcdefghijklmnopé" }],
    ["a numeric token", { ...CLAIMED, setupToken: 1234567890123456 }],
    ["an expiry that is not a date", { ...CLAIMED, expiresAt: "soon" }],
    ["a numeric expiry", { ...CLAIMED, expiresAt: 1_767_225_600_000 }],
    ["no expiry", { ...CLAIMED, expiresAt: undefined }],
  ])("refuses a 201 with %s", (_label, body) => {
    expect(readClaimAnswer(201, body)).toEqual({ kind: "error" });
  });

  it("does not show a success for any other 2xx", () => {
    expect(readClaimAnswer(200, CLAIMED)).toEqual({ kind: "error" });
    expect(readClaimAnswer(202, CLAIMED)).toEqual({ kind: "error" });
  });

  it.each([
    [{ code: "POOL_EMPTY" }, { kind: "pool_empty" }],
    [{ code: "ALREADY_HAS_TRIAL" }, { kind: "already_has_trial" }],
    [{ code: "SOMETHING_ELSE" }, { kind: "error" }],
    [{}, { kind: "error" }],
    [null, { kind: "error" }],
  ])("reads 409 %j", (body, expected) => {
    expect(readClaimAnswer(409, body)).toEqual(expected);
  });

  it("does not read a 409 code off any other status", () => {
    expect(readClaimAnswer(400, { code: "POOL_EMPTY" })).toEqual({ kind: "error" });
    expect(readClaimAnswer(500, { code: "ALREADY_HAS_TRIAL" })).toEqual({ kind: "error" });
  });

  describe("400 INVALID", () => {
    it("keeps the known fields with known codes, and drops the rest", () => {
      expect(
        readClaimAnswer(400, {
          code: "INVALID",
          fields: {
            name: "too_short",
            company: "too_long",
            email: "invalid",
            phone: "required",
            country: "required",
            website: "invalid", // the honeypot is not a field the page shows
            password: "required", // not a field at all
          },
        }),
      ).toEqual({
        kind: "invalid",
        fields: { name: "too_short", company: "too_long", email: "invalid", phone: "required", country: "required" },
      });
    });

    it("drops a field whose code the page cannot render", () => {
      expect(readClaimAnswer(400, { code: "INVALID", fields: { email: "blocked_domain", phone: "invalid" } })).toEqual({
        kind: "invalid",
        fields: { phone: "invalid" },
      });
    });

    it.each([
      ["no fields", { code: "INVALID" }],
      ["null fields", { code: "INVALID", fields: null }],
      ["fields as a string", { code: "INVALID", fields: "email" }],
      ["only unknown fields", { code: "INVALID", fields: { password: "invalid" } }],
      ["only unknown codes", { code: "INVALID", fields: { email: 3, phone: "nope" } }],
      ["another 400 code", { code: "BAD_REQUEST", fields: { email: "invalid" } }],
      ["no body", null],
    ])("is an error with %s", (_label, body) => {
      expect(readClaimAnswer(400, body)).toEqual({ kind: "error" });
    });
  });

  it.each([
    [{ retryAfterSeconds: 90 }, 90],
    [{ retryAfterSeconds: 0 }, 0],
    [{ retryAfterSeconds: "90" }, null],
    [{}, null],
    [null, null],
  ])("reads 429 %j as rate limited, retry after %s", (body, seconds) => {
    expect(readClaimAnswer(429, body)).toEqual({ kind: "rate_limited", retryAfterSeconds: seconds });
  });

  it("reads 503 as closed, whatever the body", () => {
    expect(readClaimAnswer(503, null)).toEqual({ kind: "closed" });
    expect(readClaimAnswer(503, { ...CLAIMED })).toEqual({ kind: "closed" });
  });

  it.each([0, 204, 301, 401, 403, 404, 422, 500, 502, 504])("reads %i as an error", (status) => {
    expect(readClaimAnswer(status, { ...CLAIMED, code: "POOL_EMPTY", retryAfterSeconds: 5 })).toEqual({
      kind: "error",
    });
  });
});

describe("claimTrial", () => {
  const CLAIM_URL = "https://ops.example.test/api/trial/claim";
  const VALUES: TrialValues = {
    name: "Ahmed Mahmoud",
    company: "Koshary El Tahrir",
    email: "owner@koshary.example",
    phone: "01055930032",
    country: "EG",
  };
  const STACK = "https://acme.trial.example.test";
  const CLAIMED = {
    url: STACK,
    setupUrl: `${STACK}/setup`,
    setupToken: "Zx9_q2-LmN4pR7sT",
    expiresAt: "2026-11-05T00:00:00.000Z",
  };

  let fetchMock: ReturnType<typeof vi.fn<(url: string, init?: RequestInit) => Promise<Response>>>;

  beforeEach(() => {
    vi.resetModules();
    fetchMock = vi.fn(async () => Response.json(CLAIMED, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  /** lib/trial reads its claim URL at import, as the build bakes it in. */
  async function load(claimUrl: string) {
    vi.stubEnv("NEXT_PUBLIC_TRIAL_CLAIM_URL", claimUrl);
    return import("@/lib/trial");
  }

  it("is closed, and posts nothing, on a build without a claim URL", async () => {
    for (const unset of ["", "   "]) {
      const { claimTrial, TRIAL_CLAIM_URL } = await load(unset);
      expect(TRIAL_CLAIM_URL).toBeNull();
      expect(await claimTrial(VALUES, "ar", "")).toEqual({ kind: "closed" });
      vi.resetModules();
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the sign-up as JSON, without credentials, and reads the answer", async () => {
    const { claimTrial } = await load(`  ${CLAIM_URL}  `);
    expect(await claimTrial(VALUES, "en", "")).toEqual({ kind: "claimed", ...CLAIMED });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(CLAIM_URL);
    expect(init?.method).toBe("POST");
    expect(init?.credentials).toBe("omit");
    expect(new Headers(init?.headers).get("content-type")).toBe("application/json");
    expect(JSON.parse(String(init?.body))).toEqual({ ...VALUES, locale: "en", [TRIAL_HONEYPOT]: "" });
  });

  it("sends any locale but English as Arabic, and passes the honeypot through", async () => {
    const { claimTrial } = await load(CLAIM_URL);
    await claimTrial(VALUES, "fr", "http://spam.example");
    const body = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(body.locale).toBe("ar");
    expect(body[TRIAL_HONEYPOT]).toBe("http://spam.example");
  });

  it("reads a non-JSON answer by its status alone", async () => {
    const { claimTrial } = await load(CLAIM_URL);
    fetchMock.mockResolvedValueOnce(new Response("<html>Bad gateway</html>", { status: 503 }));
    expect(await claimTrial(VALUES, "ar", "")).toEqual({ kind: "closed" });
    fetchMock.mockResolvedValueOnce(new Response("<html>ok</html>", { status: 201 }));
    expect(await claimTrial(VALUES, "ar", "")).toEqual({ kind: "error" });
  });

  it("turns a network failure into an error rather than throwing", async () => {
    const { claimTrial } = await load(CLAIM_URL);
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    expect(await claimTrial(VALUES, "ar", "")).toEqual({ kind: "error" });
  });

  it("gives up after 20 seconds", async () => {
    const { claimTrial } = await load(CLAIM_URL);
    vi.useFakeTimers();
    fetchMock.mockImplementationOnce(
      (_url, init) =>
        new Promise<Response>((_resolve, reject) => {
          init!.signal!.addEventListener("abort", () => reject(init!.signal!.reason));
        }),
    );
    const pending = claimTrial(VALUES, "ar", "");
    await vi.advanceTimersByTimeAsync(19_999);
    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(await pending).toEqual({ kind: "error" });
  });
});
