/**
 * The self-serve accounting trial: what the sign-up form may send, and what
 * the claim route can answer.
 *
 * The form posts straight from the browser to Devya's control plane
 * (`POST <NEXT_PUBLIC_TRIAL_CLAIM_URL>`, the store's `/api/trial/claim`), not
 * through this site's server: the claim route limits sign-ups per address, and
 * a proxy here would make every visitor the same address. The route allows
 * this site's origin by CORS and takes JSON only.
 *
 * Validation runs here for the inline hints and again in the store, which is
 * the one that decides. The phone and email rules below are a copy of the
 * store's (bohub-pos `ops-store/src/trial/validate.ts`) — keep them in step;
 * a mismatch only ever shows a hint the store disagrees with, never a sign-up
 * the store would refuse silently.
 */

export const TRIAL_COUNTRIES = ["EG", "SA"] as const;
export type TrialCountry = (typeof TRIAL_COUNTRIES)[number];

export type TrialField = "name" | "company" | "email" | "phone" | "country";
export type TrialFieldError = "required" | "too_short" | "too_long" | "invalid";
export type TrialErrors = Partial<Record<TrialField, TrialFieldError>>;

export interface TrialValues {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: TrialCountry;
}

export const TRIAL_LIMITS = {
  name: { min: 2, max: 80 },
  company: { min: 2, max: 120 },
  email: { max: 254 },
} as const;

/** The honeypot's field name on the store's side. Never filled by a person. */
export const TRIAL_HONEYPOT = "website";

/**
 * Where the form posts, baked at build time. Unset means sign-ups are not open
 * on this build (a preview, a laptop): the page says so and offers WhatsApp
 * instead of posting anywhere — a development build must never claim a real
 * stack by accident.
 */
export const TRIAL_CLAIM_URL: string | null =
  process.env.NEXT_PUBLIC_TRIAL_CLAIM_URL?.trim() || null;

// U+0660–U+0669 (Arabic-Indic) and U+06F0–U+06F9 (Extended).
const ARABIC_DIGITS = /[٠-٩۰-۹]/g;

export function foldDigits(value: string): string {
  return value.replace(ARABIC_DIGITS, (ch) => {
    const code = ch.charCodeAt(0);
    return String(code >= 0x06f0 ? code - 0x06f0 : code - 0x0660);
  });
}

const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;

/**
 * A phone typed for `country`, as E.164 — or null. Shape only, never the
 * block: EG a mobile `1` + 9 digits or a landline `2`–`9` + 7–8; SA a mobile
 * `5` + 8 or a landline `1` + 8. International, `00`, national `0` and bare
 * forms are all accepted, with spaces, dashes, dots and brackets.
 */
export function normalisePhone(raw: string, country: TrialCountry): string | null {
  const folded = foldDigits(raw.trim());
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

function text(value: string, limits: { min: number; max: number }): TrialFieldError | null {
  const v = value.replace(/\s+/g, " ").trim();
  if (!v) return "required";
  if (v.length < limits.min) return "too_short";
  if (v.length > limits.max) return "too_long";
  return null;
}

export function validateTrial(values: TrialValues): TrialErrors {
  const errors: TrialErrors = {};
  const name = text(values.name, TRIAL_LIMITS.name);
  if (name) errors.name = name;
  const company = text(values.company, TRIAL_LIMITS.company);
  if (company) errors.company = company;

  const email = values.email.trim().toLowerCase();
  if (!email) errors.email = "required";
  else if (email.length > TRIAL_LIMITS.email.max || !EMAIL.test(email)) errors.email = "invalid";

  if (!(TRIAL_COUNTRIES as readonly string[]).includes(values.country)) errors.country = "required";
  else if (!values.phone.trim()) errors.phone = "required";
  else if (!normalisePhone(values.phone, values.country)) errors.phone = "invalid";

  return errors;
}

/** What the claim route answered, reduced to what the page shows. */
export type ClaimResult =
  | { kind: "claimed"; url: string; setupUrl: string; setupToken: string; expiresAt: string }
  /** No free stack for that country. The lead is kept; sales calls. */
  | { kind: "pool_empty" }
  /** This email already has a running trial. */
  | { kind: "already_has_trial" }
  | { kind: "invalid"; fields: TrialErrors }
  | { kind: "rate_limited"; retryAfterSeconds: number | null }
  /** Sign-ups are closed (no claim URL on this build, or the store's key is unset). */
  | { kind: "closed" }
  | { kind: "error" };

const FIELDS: readonly TrialField[] = ["name", "company", "email", "phone", "country"];
const CODES: readonly TrialFieldError[] = ["required", "too_short", "too_long", "invalid"];

function isHttpsOrigin(value: unknown): value is string {
  return typeof value === "string" && /^https:\/\/[a-z0-9.-]+(:\d+)?$/i.test(value);
}

/**
 * Reads the claim route's answer. Anything that is not exactly the documented
 * success shape is not shown as a success — the token and the link are the
 * one thing on this page a person acts on, so they are checked, not trusted.
 */
export function readClaimAnswer(status: number, body: unknown): ClaimResult {
  const b = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  if (status === 201) {
    const { url, setupUrl, setupToken, expiresAt } = b;
    if (
      isHttpsOrigin(url) &&
      typeof setupUrl === "string" &&
      setupUrl.startsWith(`${url}/`) &&
      typeof setupToken === "string" &&
      /^[\x21-\x7e]{16,256}$/.test(setupToken) &&
      typeof expiresAt === "string" &&
      !Number.isNaN(Date.parse(expiresAt))
    ) {
      return { kind: "claimed", url, setupUrl, setupToken, expiresAt };
    }
    return { kind: "error" };
  }
  if (status === 409 && b.code === "POOL_EMPTY") return { kind: "pool_empty" };
  if (status === 409 && b.code === "ALREADY_HAS_TRIAL") return { kind: "already_has_trial" };
  if (status === 400 && b.code === "INVALID") {
    const fields: TrialErrors = {};
    const raw = (typeof b.fields === "object" && b.fields !== null ? b.fields : {}) as Record<string, unknown>;
    for (const field of FIELDS) {
      const code = raw[field];
      if (typeof code === "string" && (CODES as readonly string[]).includes(code)) {
        fields[field] = code as TrialFieldError;
      }
    }
    return Object.keys(fields).length > 0 ? { kind: "invalid", fields } : { kind: "error" };
  }
  if (status === 429) {
    const seconds = typeof b.retryAfterSeconds === "number" ? b.retryAfterSeconds : null;
    return { kind: "rate_limited", retryAfterSeconds: seconds };
  }
  if (status === 503) return { kind: "closed" };
  return { kind: "error" };
}

/** Post one sign-up. Never throws: a network failure is `{kind: "error"}`. */
export async function claimTrial(
  values: TrialValues,
  locale: string,
  honeypot: string,
): Promise<ClaimResult> {
  if (!TRIAL_CLAIM_URL) return { kind: "closed" };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(TRIAL_CLAIM_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      // No cookies, no credentials: the store has no session to give.
      credentials: "omit",
      signal: controller.signal,
      body: JSON.stringify({
        name: values.name,
        company: values.company,
        email: values.email,
        phone: values.phone,
        country: values.country,
        locale: locale === "en" ? "en" : "ar",
        [TRIAL_HONEYPOT]: honeypot,
      }),
    });
    const body: unknown = await res.json().catch(() => null);
    return readClaimAnswer(res.status, body);
  } catch {
    return { kind: "error" };
  } finally {
    clearTimeout(timer);
  }
}
