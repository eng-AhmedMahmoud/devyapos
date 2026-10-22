/**
 * The one phone-number rule on this site.
 *
 * Both forms read a typed number with `normalisePhone`, and each form's server
 * decides with the same call, so an inline hint never disagrees with the answer
 * that follows the submit:
 *
 *  - The lead form and `/api/lead` both run `validateLead` (lib/leads.ts),
 *    which reads the phone with the lead rule: `{ mobileOnly, lenient }`. A
 *    lead is followed up on WhatsApp, so only a mobile on one of Egypt's four
 *    operator blocks will do, which is the `+201[0125]…` the README's lead
 *    forward contract promises the receiving end.
 *  - The accounting-trial form runs it with no options, which is the claim
 *    route's own rule (bohub-pos ops-store/src/trial/validate.ts, the store
 *    that decides): Egypt or Saudi Arabia, landlines too, and the shape only,
 *    never the block. The store's tests sign up on synthetic 013 numbers. Keep
 *    the no-option path in step with that file.
 *
 * Until 2026-10-22 these were two parsers that disagreed in ways nobody had
 * written down. Now there is one parser and two named options, and
 * tests/phone.test.ts pins both forms' acceptance against the parsers they
 * replaced. Whether the lead form should take landlines, or the trial form
 * pasted text, is a product decision that moves a server, not this file.
 *
 * Dependency-free and free of Node built-ins: it runs in the browser and in
 * the route handler alike.
 */

import { foldDigits } from "@/lib/format";

export type PhoneCountry = "EG" | "SA";

export interface PhoneRule {
  /**
   * Only a number WhatsApp can reach: a mobile on one of the country's
   * operator blocks. Without it a number passes on its shape, landlines
   * included.
   */
  mobileOnly?: boolean;
  /**
   * Forgive what a paste or a habit drags in: a `tel:` link, a label, any
   * stray character, and a `+` or `00` typed in front of a national number
   * ("+010…" means 010…). Without it, only digits, one leading `+`, and the
   * separators people type (spaces, dashes, dots, brackets, bidi marks) are
   * read, the prefix must be a real one, and anything else is not a phone
   * number.
   */
  lenient?: boolean;
}

interface CountryRule {
  /** Calling code, without the `+`. */
  cc: string;
  /**
   * The longest national number written without its trunk `0`. A bare number
   * longer than this that starts with the calling code is read as one with the
   * code in front, so a Cairo landline that happens to start with 20 stays
   * national.
   */
  bareMax: number;
  /** `mobileOnly`: a mobile on an operator block. */
  mobile: RegExp;
  /** Otherwise: the shape of any number in the country, never the block. */
  any: RegExp;
}

const COUNTRIES: Record<PhoneCountry, CountryRule> = {
  EG: {
    cc: "20",
    bareMax: 11,
    // 010 Vodafone, 011 e&, 012 Orange, 015 WE.
    mobile: /^1[0125]\d{8}$/,
    // A mobile `1` + 9 digits, or a landline `2`–`9` + 7–8.
    any: /^(1\d{9}|[2-9]\d{7,8})$/,
  },
  SA: {
    cc: "966",
    bareMax: 10,
    mobile: /^5\d{8}$/,
    // A mobile `5` + 8 digits, or a landline `1` + 8.
    any: /^(5\d{8}|1\d{8})$/,
  },
};

// Digits, one leading plus, and the separators people actually type, including
// the LRM/RLM marks an RTL keyboard leaves around a pasted number.
const TYPED = /^\+?[\d\s().\-\u200e\u200f]+$/;

/**
 * The `lenient` reading, the lead form's since it shipped: keep digits and plus
 * signs only, then take a `+`, a `00`, and the calling code or else a trunk `0`
 * off the front, once each and in that order. What is left is the national
 * number, handed on in international form so the shape check below is the
 * same one the strict reading ends in. A `+` anywhere but in front stays, and
 * is refused there.
 */
function forgive(folded: string, cc: string): string {
  let digits = folded.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith(cc)) digits = digits.slice(cc.length);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  return `+${cc}${digits}`;
}

/**
 * A phone typed for `country`, as E.164, or null when it is not one.
 *
 * International (`+20…`), `00`, national (`0…`) and bare forms are all read,
 * after Arabic-Indic digits are folded to ASCII.
 */
export function normalisePhone(
  raw: string,
  country: PhoneCountry,
  rule: PhoneRule = {},
): string | null {
  const { cc, bareMax, mobile, any } = COUNTRIES[country];
  let text = foldDigits(raw.trim());
  if (rule.lenient) text = forgive(text, cc);
  if (!TYPED.test(text)) return null;

  let digits = text.replace(/[^\d+]/g, "");
  const plus = digits.startsWith("+");
  digits = digits.replace(/\+/g, "");

  let national: string;
  if (plus) {
    if (!digits.startsWith(cc)) return null;
    national = digits.slice(cc.length);
  } else if (digits.startsWith(`00${cc}`)) {
    national = digits.slice(cc.length + 2);
  } else if (digits.startsWith("0")) {
    national = digits.slice(1);
  } else if (digits.startsWith(cc) && digits.length > bareMax) {
    national = digits.slice(cc.length);
  } else {
    national = digits;
  }

  return (rule.mobileOnly ? mobile : any).test(national) ? `+${cc}${national}` : null;
}
