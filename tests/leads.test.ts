import { describe, expect, it } from "vitest";
import {
  LEAD_LIMITS,
  coarseTimestamp,
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
    expect(LEAD_LIMITS).toEqual({ name: 80, restaurant: 120, message: 1200, branches: 500 });
  });

  it("normalises a minimal valid lead", () => {
    expect(validateLead(VALID)).toEqual({
      ok: true,
      lead: {
        name: "Ahmed Mahmoud",
        restaurant: "Koshary El Tahrir",
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
      errors: { name: "required", restaurant: "required", phone: "required" },
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
