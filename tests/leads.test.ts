import { describe, expect, it } from "vitest";
import {
  LEAD_LIMITS,
  coarseTimestamp,
  normaliseEmail,
  normalizeEgyptMobile,
  sanitizeAttribution,
  validateLead,
  type LeadSubmission,
} from "@/lib/leads";

/*
 * The lead contract (README "Lead forward contract"), run on both sides of the
 * contact form: the browser uses it for inline hints, /api/lead re-runs it.
 * A slip here turns a real restaurant owner — typing on an Arabic keyboard, or
 * pasting a number with +20 — into a validation error nobody sees in analytics.
 */

const E164 = "+201055930032";

describe("normalizeEgyptMobile", () => {
  it.each([
    // The four shapes people type.
    ["national 01x", "01055930032"],
    ["+20", "+201055930032"],
    ["0020", "00201055930032"],
    ["20 without plus", "201055930032"],
    ["bare national number", "1055930032"],
    // Separators and pastes.
    ["spaced", "010 5593 0032"],
    ["dashed", "010-5593-0032"],
    ["dotted and bracketed", "(010) 5593.0032"],
    ["international, spaced", "+20 10 5593 0032"],
    ["a pasted tel: link", "tel:+201055930032"],
    ["padded", "  01055930032  "],
    // Keyboards.
    ["Arabic-Indic digits", "٠١٠٥٥٩٣٠٠٣٢"],
    ["Persian digits", "۰۱۰۵۵۹۳۰۰۳۲"],
    ["Arabic-Indic with +٢٠", "+٢٠١٠٥٥٩٣٠٠٣٢"],
  ])("accepts %s", (_label, raw) => {
    expect(normalizeEgyptMobile(raw)).toBe(E164);
  });

  it.each([
    ["010 (Vodafone)", "01012345678", "+201012345678"],
    ["011 (Etisalat)", "01112345678", "+201112345678"],
    ["012 (Orange)", "01212345678", "+201212345678"],
    ["015 (WE)", "01512345678", "+201512345678"],
  ])("accepts operator prefix %s", (_label, raw, expected) => {
    expect(normalizeEgyptMobile(raw)).toBe(expected);
  });

  it.each([
    ["013", "01312345678"],
    ["014", "01412345678"],
    ["016", "01612345678"],
    ["017", "01712345678"],
    ["018", "01812345678"],
    ["019", "01912345678"],
    ["Cairo landline", "0223456789"],
    ["Alexandria landline", "033456789"],
    ["Saudi mobile", "+966501234567"],
    ["Saudi mobile, national", "0501234567"],
    ["UK mobile", "+447911123456"],
    ["one digit short", "0105593003"],
    ["one digit long", "010559300321"],
    ["+20 with a national 0 kept", "+20 010 5593 0032"],
    ["letters", "010-CALL-ME"],
    ["empty", ""],
    ["separators only", " - ( ) "],
  ])("rejects %s", (_label, raw) => {
    expect(normalizeEgyptMobile(raw)).toBeNull();
  });
});

describe("validateLead", () => {
  const VALID: LeadSubmission = {
    name: "Ahmed Mahmoud",
    restaurant: "Koshary El Tahrir",
    email: "test@devya.dev",
    phone: "01055930032",
  };

  function errorsFor(patch: Partial<Record<keyof LeadSubmission, unknown>>) {
    const result = validateLead({ ...VALID, ...patch } as LeadSubmission);
    return result.ok ? {} : result.errors;
  }

  function leadFor(patch: Partial<Record<keyof LeadSubmission, unknown>>) {
    const result = validateLead({ ...VALID, ...patch } as LeadSubmission);
    if (!result.ok) throw new Error(`expected a valid lead, got ${JSON.stringify(result.errors)}`);
    return result.lead;
  }

  it("pins the limits the README promises the receiving end", () => {
    expect(LEAD_LIMITS).toEqual({ name: 80, restaurant: 120, email: 254, message: 1200, branches: 500 });
  });

  it("normalises a minimal valid lead", () => {
    expect(validateLead(VALID)).toEqual({
      ok: true,
      lead: {
        name: "Ahmed Mahmoud",
        restaurant: "Koshary El Tahrir",
        email: "test@devya.dev",
        phone: E164,
        branches: null,
        message: null,
        locale: "ar",
      },
    });
  });

  it("reports every missing required field at once", () => {
    expect(validateLead({})).toEqual({
      ok: false,
      errors: { name: "required", restaurant: "required", email: "required", phone: "required" },
    });
  });

  describe.each([
    ["name", LEAD_LIMITS.name],
    ["restaurant", LEAD_LIMITS.restaurant],
  ] as const)("%s", (field, max) => {
    it.each([
      ["missing", undefined, "required"],
      ["empty", "", "required"],
      ["whitespace only", " \t\n ", "required"],
      ["not a string", 42, "required"],
      ["one character", "A", "too_short"],
      ["one character, padded", "  A  ", "too_short"],
      ["one over the cap", "x".repeat(max + 1), "too_long"],
    ])("is %s → %s", (_label, value, code) => {
      expect(errorsFor({ [field]: value })).toEqual({ [field]: code });
    });

    it.each([
      ["two characters", "Ab", "Ab"],
      ["exactly the cap", "x".repeat(max), "x".repeat(max)],
      ["Arabic", "مطعم الفلاح", "مطعم الفلاح"],
      ["inner runs of whitespace collapsed", "  Abu \t  Tarek \n", "Abu Tarek"],
      // Collapsing happens before the cap is checked.
      ["over the cap only before collapsing", `a${" ".repeat(max)}b`, "a b"],
    ])("accepts %s", (_label, value, expected) => {
      expect(leadFor({ [field]: value })[field]).toBe(expected);
    });
  });

  describe("email", () => {
    // 244 + "@devya.dev" (10) is exactly the cap.
    const AT_CAP = `${"a".repeat(LEAD_LIMITS.email - 10)}@devya.dev`;

    it.each([
      ["missing", undefined, "required"],
      ["empty", "", "required"],
      ["blank", " \t ", "required"],
      ["not a string", 42, "required"],
      ["without an @", "test.devya.dev", "invalid_email"],
      ["with two @", "test@@devya.dev", "invalid_email"],
      ["without a local part", "@devya.dev", "invalid_email"],
      ["without a domain", "test@", "invalid_email"],
      ["without a dot in the domain", "test@devya", "invalid_email"],
      ["with a one-letter top-level label", "test@devya.d", "invalid_email"],
      ["with an empty domain label", "test@devya..dev", "invalid_email"],
      ["with an inner space", "te st@devya.dev", "invalid_email"],
      ["with a control character", "test\u0000@devya.dev", "invalid_email"],
      ["with a bidi override", "test\u202E@devya.dev", "invalid_email"],
      ["with a bidi isolate", "\u2066test@devya.dev", "invalid_email"],
      ["one over the cap", `a${AT_CAP}`, "invalid_email"],
    ])("is %s → %s", (_label, value, code) => {
      expect(errorsFor({ email: value })).toEqual({ email: code });
    });

    // Each of these has one @ and passes the store's shape, and a mailer reads
    // each as a display name, a comment or a list around test@devya.dev: the
    // reply would reach that mailbox under a string the store's unsubscribe
    // and one-sequence-per-address checks have never seen.
    it.each([
      ["a display name", "name<test@devya.dev>"],
      ["angle brackets", "<test@devya.dev>"],
      ["a trailing bracket", "test@devya.dev>"],
      ["a trailing comment", "test@devya.dev(1)"],
      ["a leading comment", "(2)test@devya.dev"],
      ["a comma list", "a,test@devya.dev"],
      ["a semicolon list", "a;test@devya.dev"],
      ["a group", "team:test@devya.dev"],
      ["a quoted part", '"q"test@devya.dev'],
      ["a domain literal", "test@[devya.dev]"],
      ["a backslash", "te\\st@devya.dev"],
      ["a leading dot", ".test@devya.dev"],
      ["a double dot in the local part", "te..st@devya.dev"],
    ])("refuses %s, which a mailer would rewrite", (_label, value) => {
      expect(errorsFor({ email: value })).toEqual({ email: "invalid_email" });
    });

    it.each([
      ["lowercased", "Test@Devya.DEV", "test@devya.dev"],
      ["trimmed", "  test@devya.dev \n", "test@devya.dev"],
      ["with a plus tag", "test+lead@devya.dev", "test+lead@devya.dev"],
      ["on a subdomain", "test@mail.devya.dev", "test@mail.devya.dev"],
      ["with RFC 5322 symbols", "o'brien_&-x@devya.dev", "o'brien_&-x@devya.dev"],
      ["with a hyphenated label", "test@mail-1.devya.dev", "test@mail-1.devya.dev"],
      ["with an Arabic local part", "أحمد@devya.dev", "أحمد@devya.dev"],
      ["exactly the cap", AT_CAP, AT_CAP],
    ])("takes an address %s", (_label, value, expected) => {
      expect(leadFor({ email: value }).email).toBe(expected);
    });

    it("normaliseEmail answers null for anything that is not an address", () => {
      expect(normaliseEmail(undefined)).toBeNull();
      expect(normaliseEmail(null)).toBeNull();
      expect(normaliseEmail(["test@devya.dev"])).toBeNull();
      expect(normaliseEmail("")).toBeNull();
      expect(normaliseEmail("test@devya")).toBeNull();
      expect(normaliseEmail(" TEST@devya.dev ")).toBe("test@devya.dev");
    });
  });

  describe("phone", () => {
    it.each([
      ["missing", undefined, "required"],
      ["blank", "   ", "required"],
      ["not a string", 1055930032, "required"],
      ["a landline", "02 2345 6789", "invalid_phone"],
      ["a foreign number", "+966501234567", "invalid_phone"],
      ["an unknown operator", "01355930032", "invalid_phone"],
    ])("is %s → %s", (_label, value, code) => {
      expect(errorsFor({ phone: value })).toEqual({ phone: code });
    });

    it.each([
      ["0020 with spaces", "0020 105 593 0032"],
      ["Arabic-Indic digits", "٠١٠٥٥٩٣٠٠٣٢"],
      ["Persian digits with +20", "+۲۰۱۰۵۵۹۳۰۰۳۲"],
    ])("stores %s as E.164", (_label, value) => {
      expect(leadFor({ phone: value }).phone).toBe(E164);
    });
  });

  describe("branches", () => {
    it.each([
      ["absent", undefined, null],
      ["null", null, null],
      ["empty", "", null],
      ["blank", "   ", null],
      ["a number", 3, 3],
      ["a numeric string", "12", 12],
      ["padded", " 7 ", 7],
      ["Arabic-Indic", "٣", 3],
      ["Persian", "۱۲", 12],
      ["the minimum", 1, 1],
      ["the cap", LEAD_LIMITS.branches, LEAD_LIMITS.branches],
    ])("takes %s as %s", (_label, value, expected) => {
      expect(leadFor({ branches: value }).branches).toBe(expected);
    });

    it.each([
      ["zero", 0],
      ["negative", "-2"],
      ["fractional", "2.5"],
      ["one over the cap", LEAD_LIMITS.branches + 1],
      ["words", "three"],
      ["a range", "3-5"],
      ["NaN", Number.NaN],
      ["Infinity", Number.POSITIVE_INFINITY],
    ])("refuses %s", (_label, value) => {
      expect(errorsFor({ branches: value })).toEqual({ branches: "invalid_branches" });
    });
  });

  describe("message", () => {
    it.each([
      ["absent", undefined, null],
      ["null", null, null],
      ["blank", "  \n ", null],
      ["not a string", 7, null],
      ["trimmed, inner lines kept", "  first line\nsecond line  ", "first line\nsecond line"],
      ["exactly the cap", "m".repeat(LEAD_LIMITS.message), "m".repeat(LEAD_LIMITS.message)],
      ["the cap once trimmed", `  ${"m".repeat(LEAD_LIMITS.message)}  `, "m".repeat(LEAD_LIMITS.message)],
    ])("takes %s", (_label, value, expected) => {
      expect(leadFor({ message: value }).message).toBe(expected);
    });

    it("refuses one character over the cap", () => {
      expect(errorsFor({ message: "m".repeat(LEAD_LIMITS.message + 1) })).toEqual({ message: "too_long" });
    });
  });

  it.each([
    ["en", "en"],
    ["ar", "ar"],
    [undefined, "ar"],
    ["fr", "ar"],
    ["EN", "ar"],
  ])("files locale %s as %s", (locale, expected) => {
    expect(leadFor({ locale }).locale).toBe(expected);
  });
});

describe("sanitizeAttribution", () => {
  it.each([undefined, null, "utm_source=meta", 42, []])("returns {} for %j", (input) => {
    expect(sanitizeAttribution(input)).toEqual({});
  });

  it("keeps the known keys, trimmed, and drops everything else", () => {
    expect(
      sanitizeAttribution({
        source: "  meta ",
        medium: "cpc",
        campaign: "eg-launch",
        term: "pos egypt",
        content: "video-a",
        referrer: "https://www.facebook.com/",
        landingPath: "/ar?utm_source=meta",
        landingAt: "2026-10-22T09:41:00.000Z",
        ip: "198.51.100.1",
        email: "owner@example.test",
        __proto__: { polluted: true },
      }),
    ).toEqual({
      source: "meta",
      medium: "cpc",
      campaign: "eg-launch",
      term: "pos egypt",
      content: "video-a",
      referrer: "https://www.facebook.com/",
      landingPath: "/ar?utm_source=meta",
      landingAt: "2026-10-22T09:41:00.000Z",
    });
  });

  it("drops empty, blank and non-string values", () => {
    expect(
      sanitizeAttribution({ source: "", medium: "   ", campaign: 7, term: null, content: { a: 1 } }),
    ).toEqual({});
  });

  it.each([
    ["source", 200],
    ["medium", 200],
    ["campaign", 200],
    ["term", 200],
    ["content", 200],
    ["referrer", 500],
    ["landingPath", 300],
    ["landingAt", 40],
  ] as const)("caps %s at %i characters", (key, cap) => {
    const out = sanitizeAttribution({ [key]: "x".repeat(cap + 50) });
    expect(out[key]).toBe("x".repeat(cap));
  });
});

describe("coarseTimestamp", () => {
  it.each([
    ["2026-10-22T09:41:37.912Z", "2026-10-22T09:41:00.000Z"],
    ["2026-10-22T09:41:00.000Z", "2026-10-22T09:41:00.000Z"],
    ["2026-12-31T23:59:59.999Z", "2026-12-31T23:59:00.000Z"],
  ])("rounds %s down to %s", (input, expected) => {
    expect(coarseTimestamp(new Date(input))).toBe(expected);
  });

  it("defaults to now", () => {
    // Bracketed, so a minute boundary between the calls cannot fail it.
    const before = Date.now();
    const stamp = Date.parse(coarseTimestamp());
    const after = Date.now();
    expect(stamp).toBeGreaterThanOrEqual(Math.floor(before / 60_000) * 60_000);
    expect(stamp).toBeLessThanOrEqual(after);
  });
});
