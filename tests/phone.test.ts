import { describe, expect, it } from "vitest";
import { foldDigits } from "@/lib/format";
import { validateLead } from "@/lib/leads";
import { normalisePhone, type PhoneCountry } from "@/lib/phone";
import { validateTrial } from "@/lib/trial";

/*
 * One phone parser (lib/phone.ts) where there used to be two: lib/leads.ts had
 * its own Egyptian-mobile reader and lib/trial.ts a copy of the store's, each
 * with its own digit folding. The merge must not move either form's answer by
 * a single number, so the two replaced functions are kept below verbatim, as
 * they were on main at da1cc0b, and the new parser is run against them on
 * every shape people type plus a few thousand generated ones.
 */

/** lib/leads.ts `normalizeEgyptMobile`, before the merge. */
function leadRuleBefore(raw: string): string | null {
  let digits = raw
    .replace(/[٠-٩۰-۹]/g, (d) => {
      const code = d.charCodeAt(0);
      return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
    })
    .replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("20")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  return /^1[0125]\d{8}$/.test(digits) ? `+20${digits}` : null;
}

/** lib/trial.ts `normalisePhone`, before the merge (the store's rule). */
function storeRuleBefore(raw: string, country: PhoneCountry): string | null {
  const folded = raw.trim().replace(/[٠-٩۰-۹]/g, (ch) => {
    const code = ch.charCodeAt(0);
    return String(code >= 0x06f0 ? code - 0x06f0 : code - 0x0660);
  });
  if (!/^\+?[\d\s().\-‎‏]+$/.test(folded)) return null;
  let digits = folded.replace(/[^\d+]/g, "");
  const plus = digits.startsWith("+");
  digits = digits.replace(/\+/g, "");
  const cc = country === "EG" ? "20" : "966";
  let national: string;
  if (plus) {
    if (!digits.startsWith(cc)) return null;
    national = digits.slice(cc.length);
  } else if (digits.startsWith(`00${cc}`)) {
    national = digits.slice(cc.length + 2);
  } else if (digits.startsWith("0")) {
    national = digits.slice(1);
  } else if (digits.startsWith(cc) && digits.length > (country === "EG" ? 11 : 10)) {
    national = digits.slice(cc.length);
  } else {
    national = digits;
  }
  const shape = country === "EG" ? /^(1\d{9}|[2-9]\d{7,8})$/ : /^(5\d{8}|1\d{8})$/;
  return shape.test(national) ? `+${cc}${national}` : null;
}

const leadRule = (raw: string) => normalisePhone(raw, "EG", { mobileOnly: true, lenient: true });

/** Deterministic, so a failure names an input that reproduces. */
function prng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Inputs built from the pieces a phone field actually receives: prefixes,
 * national numbers of every length around the real ones, separators, both
 * Arabic digit sets, pasted junk, and the odd stray plus.
 */
function generated(count: number, seed: number): string[] {
  const rand = prng(seed);
  const pick = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)];
  const digits = (n: number) => Array.from({ length: n }, () => String(Math.floor(rand() * 10))).join("");
  const prefixes = [
    "", "", "+", "00", "0", "20", "966", "+20", "+966", "0020", "00966", "+0", "+00", "++", "00+", "tel:", "tel:+20",
    "20+", "+20 0", "0000", "000020", "+0020", "+000020", "00 0020", "0000966", "+00966", "0 0", "000",
  ];
  const leads = ["1", "10", "11", "12", "15", "13", "19", "2", "3", "5", "50", "9", "0", ""];
  const seps = ["", "", "", " ", "-", ".", "(", ")", "‎", "‏", "/", "x"];
  const arabic = (text: string) =>
    text.replace(/\d/g, (d) => (rand() < 0.5 ? String.fromCharCode(0x0660 + Number(d)) : String.fromCharCode(0x06f0 + Number(d))));
  const out: string[] = [];
  for (let i = 0; i < count; i += 1) {
    // Mostly the lengths around a real number, so a fair share is accepted.
    const body = `${pick(leads)}${digits(pick([0, 3, 6, 7, 7, 8, 8, 8, 9, 9, 9, 10, 11]))}`;
    let text = "";
    for (const ch of `${pick(prefixes)}${body}`) text += ch + (rand() < 0.15 ? pick(seps) : "");
    if (rand() < 0.2) text = arabic(text);
    if (rand() < 0.1) text = ` ${text} `;
    out.push(text);
  }
  return out;
}

/** The shapes the forms' own tests name, so the comparison covers them too. */
const NAMED = [
  "01055930032", "+201055930032", "00201055930032", "201055930032", "1055930032",
  "010 5593 0032", "010-5593-0032", "(010) 5593.0032", "+20 10 5593 0032", "tel:+201055930032",
  "  01055930032  ", "٠١٠٥٥٩٣٠٠٣٢", "۰۱۰۵۵۹۳۰۰۳۲", "+٢٠١٠٥٥٩٣٠٠٣٢", "01312345678", "0223456789",
  "033456789", "+966501234567", "0501234567", "+447911123456", "0105593003", "010559300321",
  "+20 010 5593 0032", "010-CALL-ME", "", " - ( ) ", "+01055930032", "+1055930032", "001055930032",
  "0001055930032", "+001055930032", "+00201055930032", "00+201055930032", "++201055930032",
  "20+1055930032", "201234567", "20223456789", "+‎20 10 5593 0032‏", "‏010 5593 0032",
  "011 234 5678", "966501234", "05012345678", "0601234567", "00966501234567",
  // A doubled international prefix: the lead rule takes one 00 off, then a
  // trunk 0, and refuses what is left. Found by the security review of #21.
  "000020 1012345678", "+000020 1012345678", "00 0020 1012345678", "tel:000020-101-234-5678",
  "0000201012345678", "+0020 1012345678", "000201012345678",
];

describe("foldDigits (lib/format.ts) — the one digit folder", () => {
  it.each([
    ["Arabic-Indic", "٠١٢٣٤٥٦٧٨٩", "0123456789"],
    ["Persian (Extended Arabic-Indic)", "۰۱۲۳۴۵۶۷۸۹", "0123456789"],
    ["mixed with ASCII and separators", "+٢٠ 1۰٥-593", "+20 105-593"],
    ["a Saudi prefix", "+٩٦٦ ٥٠", "+966 50"],
    ["ASCII unchanged", "01055930032", "01055930032"],
    ["Arabic letters untouched", "رقم ٣", "رقم 3"],
    ["empty", "", ""],
  ])("folds %s", (_label, input, expected) => {
    expect(foldDigits(input)).toBe(expected);
  });
});

describe("normalisePhone — the lead rule reads every number as it did before", () => {
  it.each(NAMED)("%j", (raw) => {
    expect(leadRule(raw)).toBe(leadRuleBefore(raw));
  });

  it("agrees on 20,000 generated inputs", () => {
    const differ = generated(20_000, 21).filter((raw) => leadRule(raw) !== leadRuleBefore(raw));
    expect(differ).toEqual([]);
  });
});

describe("normalisePhone — the store's rule reads every number as it did before", () => {
  for (const country of ["EG", "SA"] as const) {
    it.each(NAMED)(`${country} %j`, (raw) => {
      expect(normalisePhone(raw, country)).toBe(storeRuleBefore(raw, country));
    });

    it(`${country}: agrees on 20,000 generated inputs`, () => {
      const differ = generated(20_000, country === "EG" ? 22 : 23).filter(
        (raw) => normalisePhone(raw, country) !== storeRuleBefore(raw, country),
      );
      expect(differ).toEqual([]);
    });
  }
});

describe("the two forms, side by side", () => {
  const trialPhoneOk = (phone: string) =>
    validateTrial({ name: "Ahmed", company: "Koshary", email: "a@b.co", phone, country: "EG" }).phone ===
    undefined;
  const leadPhoneOk = (phone: string) => {
    const result = validateLead({ name: "Ahmed", restaurant: "Koshary", phone });
    return result.ok || result.errors.phone === undefined;
  };

  // The one thing a visitor would notice: a real Egyptian mobile, typed any
  // ordinary way, is accepted by both forms and stored as the same number.
  it.each([
    "01012345678", "+201112345678", "00201212345678", "015 1234 5678", "+20 10 1234 5678",
    "٠١٠١٢٣٤٥٦٧٨", "(012) 3456-7890",
  ])("a real mobile passes both: %s", (phone) => {
    expect(leadPhoneOk(phone)).toBe(true);
    expect(trialPhoneOk(phone)).toBe(true);
    expect(leadRule(phone)).toBe(normalisePhone(phone, "EG"));
  });

  // The differences are the two named options, nothing else.
  it.each([
    ["a Cairo landline (mobileOnly)", "02 2345 6789"],
    ["a block no operator uses (mobileOnly)", "01312345678"],
  ])("the trial takes, the lead form refuses: %s", (_label, phone) => {
    expect(trialPhoneOk(phone)).toBe(true);
    expect(leadPhoneOk(phone)).toBe(false);
  });

  it.each([
    ["a pasted tel: link (lenient)", "tel:+201055930032"],
    ["a plus before the national number (lenient)", "+01055930032"],
  ])("the lead form takes, the trial refuses: %s", (_label, phone) => {
    expect(leadPhoneOk(phone)).toBe(true);
    expect(trialPhoneOk(phone)).toBe(false);
  });
});
