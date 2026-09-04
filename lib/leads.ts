/**
 * What a lead is, and what makes one valid.
 *
 * Shared by the browser form and the `/api/lead` route handler so the two can
 * never disagree: the client uses these functions for inline validation, the
 * server re-runs them because a client check is a courtesy, not a control.
 *
 * Deliberately dependency-free and free of Node built-ins — this module has to
 * import cleanly inside a client component and inside the nodejs runtime.
 */

/** Caps, not opinions: enough room for a real answer, not enough for a payload. */
export const LEAD_LIMITS = {
  name: 80,
  restaurant: 120,
  message: 1200,
  /** Nobody is onboarding 500 branches through a marketing form. */
  branches: 500,
} as const;

export type LeadField = "name" | "restaurant" | "phone" | "branches" | "message";

/**
 * Machine-readable failure reasons. The API returns these codes rather than
 * prose so the form can render them in the visitor's own language.
 */
export type LeadErrorCode =
  | "required"
  | "too_short"
  | "too_long"
  | "invalid_phone"
  | "invalid_branches";

export type LeadErrors = Partial<Record<LeadField, LeadErrorCode>>;

/** First-touch campaign data, captured in the browser and posted with the lead. */
export interface LeadAttribution {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  /** Document referrer at first load, cross-origin only. */
  referrer?: string;
  /** Path the visitor arrived on, before any client-side navigation. */
  landingPath?: string;
  /** ISO timestamp of first load, minute precision (see `coarseTimestamp`). */
  landingAt?: string;
}

/** The raw shape the browser posts. Every field arrives untrusted. */
export interface LeadSubmission {
  name?: string;
  restaurant?: string;
  phone?: string;
  branches?: string | number | null;
  message?: string | null;
  locale?: string;
  attribution?: LeadAttribution | null;
  /** Honeypot. Real people never see it, so it must arrive empty. */
  company?: string;
}

/** The cleaned lead, after normalisation. */
export interface NormalisedLead {
  name: string;
  restaurant: string;
  /** E.164, e.g. `+201055930032`. */
  phone: string;
  branches: number | null;
  message: string | null;
  locale: string;
}

/** UTM query keys, in the order they are read off the URL. */
export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/**
 * Arabic-Indic and Eastern Arabic-Indic digits → ASCII.
 *
 * An Arabic keyboard on an Egyptian phone types ٠١٠٥٥…, and a phone number
 * typed that way is a real number, not a typo. Normalise before validating.
 */
export function toAsciiDigits(input: string): string {
  return input.replace(/[٠-٩۰-۹]/g, (d) => {
    const code = d.charCodeAt(0);
    const base = code >= 0x06f0 ? 0x06f0 : 0x0660;
    return String(code - base);
  });
}

/**
 * Egyptian mobile → E.164.
 *
 * Accepts the four shapes people actually type: `01xxxxxxxxx`, `+201xxxxxxxxx`,
 * `0020 1xx…`, and the bare `1xxxxxxxxx`. Separators, Arabic digits and a
 * leading `tel:` paste are all forgiven. Returns null when the digits cannot be
 * an Egyptian mobile — landlines and foreign numbers included, because the
 * follow-up on every one of these leads happens over WhatsApp.
 */
export function normalizeEgyptMobile(raw: string): string | null {
  let digits = toAsciiDigits(raw).replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("20")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  // Whatever remains must be the national number: 1, an operator digit, 8 more.
  return /^1[0125]\d{8}$/.test(digits) ? `+20${digits}` : null;
}

/**
 * Phone with the middle blanked out, for logs and analytics.
 * `+201055930032` → `+2010•••••32`. Enough to correlate, useless to leak.
 */
export function maskPhone(phone: string): string {
  if (phone.length < 8) return "•".repeat(phone.length);
  return `${phone.slice(0, 6)}${"•".repeat(phone.length - 8)}${phone.slice(-2)}`;
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function checkText(
  value: string,
  max: number,
  min = 2,
): LeadErrorCode | undefined {
  if (!value) return "required";
  if (value.length < min) return "too_short";
  if (value.length > max) return "too_long";
  return undefined;
}

/**
 * Validate and normalise one submission.
 *
 * `branches` stays optional on purpose — it is a qualification signal, not a
 * gate. An empty value is fine; a nonsense value is not.
 */
export function validateLead(
  input: LeadSubmission,
): { ok: true; lead: NormalisedLead } | { ok: false; errors: LeadErrors } {
  const errors: LeadErrors = {};

  const name = asText(input.name);
  const nameError = checkText(name, LEAD_LIMITS.name);
  if (nameError) errors.name = nameError;

  const restaurant = asText(input.restaurant);
  const restaurantError = checkText(restaurant, LEAD_LIMITS.restaurant);
  if (restaurantError) errors.restaurant = restaurantError;

  const rawPhone = asText(input.phone);
  const phone = rawPhone ? normalizeEgyptMobile(rawPhone) : null;
  if (!rawPhone) errors.phone = "required";
  else if (!phone) errors.phone = "invalid_phone";

  let branches: number | null = null;
  const rawBranches =
    typeof input.branches === "number"
      ? String(input.branches)
      : asText(input.branches ?? "");
  if (rawBranches) {
    const parsed = Number(toAsciiDigits(rawBranches));
    if (
      !Number.isInteger(parsed) ||
      parsed < 1 ||
      parsed > LEAD_LIMITS.branches
    ) {
      errors.branches = "invalid_branches";
    } else {
      branches = parsed;
    }
  }

  const rawMessage = typeof input.message === "string" ? input.message.trim() : "";
  if (rawMessage.length > LEAD_LIMITS.message) errors.message = "too_long";
  const message = rawMessage || null;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    lead: {
      name,
      restaurant,
      phone: phone as string,
      branches,
      message,
      locale: input.locale === "en" ? "en" : "ar",
    },
  };
}

function trim(value: unknown, max = 200): string | undefined {
  if (typeof value !== "string") return undefined;
  const clean = value.trim().slice(0, max);
  return clean || undefined;
}

/**
 * Whitelist and cap whatever the client claims its attribution is.
 *
 * The browser owns this data, so it is advisory: a hostile client can post any
 * campaign it likes. It is kept for reporting, never for authorisation.
 */
export function sanitizeAttribution(input: unknown): LeadAttribution {
  const raw = (input ?? {}) as Record<string, unknown>;
  const out: LeadAttribution = {};
  const source = trim(raw.source);
  if (source) out.source = source;
  const medium = trim(raw.medium);
  if (medium) out.medium = medium;
  const campaign = trim(raw.campaign);
  if (campaign) out.campaign = campaign;
  const term = trim(raw.term);
  if (term) out.term = term;
  const content = trim(raw.content);
  if (content) out.content = content;
  const referrer = trim(raw.referrer, 500);
  if (referrer) out.referrer = referrer;
  const landingPath = trim(raw.landingPath, 300);
  if (landingPath) out.landingPath = landingPath;
  const landingAt = trim(raw.landingAt, 40);
  if (landingAt) out.landingAt = landingAt;
  return out;
}

/**
 * Timestamp rounded down to the minute.
 *
 * A marketing lead does not need millisecond precision, and a coarse stamp is
 * one less field that can be used to re-identify a visitor across systems.
 */
export function coarseTimestamp(date = new Date()): string {
  const rounded = new Date(Math.floor(date.getTime() / 60_000) * 60_000);
  return rounded.toISOString();
}
