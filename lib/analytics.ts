/**
 * Analytics, and first-touch UTM capture.
 *
 * THERE IS NO ANALYTICS PROVIDER CONNECTED. Vercel Web Analytics and Speed
 * Insights were removed on 21 September 2026 at the owner's instruction — no
 * third-party measurement script is loaded on this site, by consent or
 * otherwise. `track()` below is deliberately kept as a no-op rather than
 * deleted along with its twenty-odd call sites: the call sites mark the
 * moments worth measuring, and re-deriving them later is harder than leaving
 * them in place. If a provider is ever wired up, `track()` is the only
 * function that changes.
 *
 * What still runs: `captureFirstTouch`, which records the campaign that
 * brought a visitor so it can travel with a lead they choose to send. That is
 * storage on the visitor's own device and nothing else — it is never sent
 * anywhere until they press send on the contact form — and it is gated behind
 * consent all the same (`components/Attribution.tsx`).
 */

import { UTM_KEYS, coarseTimestamp, type LeadAttribution } from "./leads";

/**
 * The event vocabulary, retained for the call sites described above. A closed
 * union rather than free strings, so a future provider inherits a clean set of
 * names instead of whatever each component happened to type.
 */
export type AnalyticsEvent =
  /** The lead form entered the viewport / mounted on /contact. */
  | "lead_form_view"
  /** Submit pressed and client validation passed. */
  | "lead_form_submit"
  /** /api/lead accepted the lead. */
  | "lead_form_success"
  /** /api/lead rejected it, or the network did. */
  | "lead_form_error"
  /** Any WhatsApp hand-off. */
  | "whatsapp_click"
  /** The mailto fallback. */
  | "email_click"
  /** A pricing-plan CTA. */
  | "pricing_cta_click";

type PropValue = string | number | boolean | null | undefined;

/**
 * Emit a custom event — currently to nowhere.
 *
 * No provider is connected, so this sends nothing in production and only logs
 * while developing. It is not a stub waiting to be filled in by accident: if
 * you wire a provider here, the consent gate has to move with it, because the
 * banner promises that nothing non-essential runs before the visitor accepts,
 * and a `track()` that phones home from a component would walk straight past
 * `components/Attribution.tsx` where the gate currently lives.
 *
 * Props are flattened scalars. Never pass anything that identifies a person:
 * names, phone numbers and free-text messages stay out of events.
 */
export function track(
  event: AnalyticsEvent,
  props?: Record<string, PropValue>,
): void {
  if (typeof window === "undefined") return;

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics:no-op]", event, props ?? {});
  }
}

/**
 * sessionStorage key for the first-touch attribution record.
 *
 * Session-scoped, not a cookie: it dies with the tab, is never sent
 * automatically, and needs no consent banner. Versioned so a shape change does
 * not have to read old records.
 */
const ATTRIBUTION_KEY = "devyapos.attribution.v1";

function readStore(): LeadAttribution | null {
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object"
      ? (parsed as LeadAttribution)
      : null;
  } catch {
    // Private mode, disabled storage, corrupt JSON — attribution is optional.
    return null;
  }
}

/**
 * Record the campaign the visitor arrived on, once per tab.
 *
 * First touch wins: someone who lands on `/?utm_source=meta`, reads the
 * pricing page and then opens `/contact` should still be credited to Meta, and
 * a later untagged navigation must not overwrite that. Safe to call on every
 * mount — after the first call it just reads the stored record back.
 */
export function captureFirstTouch(): LeadAttribution | null {
  if (typeof window === "undefined") return null;

  const existing = readStore();
  if (existing) return existing;

  const record: LeadAttribution = {
    landingPath: window.location.pathname + window.location.search,
    landingAt: coarseTimestamp(),
  };

  const params = new URLSearchParams(window.location.search);
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (!value) continue;
    // utm_source → source, utm_medium → medium, …
    const field = key.slice(4) as "source" | "medium" | "campaign" | "term" | "content";
    record[field] = value.slice(0, 200);
  }

  // Only an external referrer is worth storing; an internal one is just the
  // previous page of this same visit, which the page views already cover.
  const referrer = document.referrer;
  if (referrer && !referrer.startsWith(window.location.origin)) {
    record.referrer = referrer.slice(0, 500);
  }

  try {
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(record));
  } catch {
    // Not persisted, but still returned — this page load stays attributed.
  }
  return record;
}

/** The stored first-touch record, or null. Read at submit time. */
export function readAttribution(): LeadAttribution | null {
  if (typeof window === "undefined") return null;
  return readStore();
}

/**
 * Drop the stored record.
 *
 * Called when consent is refused or withdrawn. Withdrawing has to remove what
 * was written while it was granted, not merely stop writing more — otherwise
 * someone who accepts, changes their mind, and then sends the contact form
 * still has the campaign that found them travelling with it, which is exactly
 * the thing they just refused.
 */
export function clearAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(ATTRIBUTION_KEY);
  } catch {
    // Nothing to clear if storage was never available.
  }
}
