/**
 * Analytics, kept to the smallest surface that answers "did this page sell
 * anything".
 *
 * A thin typed wrapper over Vercel Web Analytics' `track`, plus first-touch
 * UTM capture. Two rules the rest of the site can rely on:
 *
 *   1. `track()` is safe to call anywhere — during SSR it returns immediately,
 *      and a failure inside the analytics script never propagates to the page.
 *   2. It is a no-op outside production, so local work does not pollute the
 *      dashboard with test leads.
 *
 * `<Analytics />` and `<SpeedInsights />` are mounted in the root layout; this
 * module only emits custom events on top of the automatic page views.
 */

import { track as vercelTrack } from "@vercel/analytics";
import { UTM_KEYS, coarseTimestamp, type LeadAttribution } from "./leads";

/**
 * The event vocabulary. A closed union rather than free strings: Vercel groups
 * by exact name, so one typo silently becomes a second, half-populated funnel.
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
 * Emit a custom event.
 *
 * Props are flattened scalars — Vercel rejects nested objects, and a lead form
 * has nothing worth nesting. Never pass anything that identifies a person:
 * names, phone numbers and free-text messages stay out of analytics.
 */
export function track(
  event: AnalyticsEvent,
  props?: Record<string, PropValue>,
): void {
  if (typeof window === "undefined") return;

  if (process.env.NODE_ENV !== "production") {
    // Visible while developing, invisible to the dashboard.
    console.debug("[analytics]", event, props ?? {});
    return;
  }

  try {
    vercelTrack(event, props ?? {});
  } catch {
    // Analytics is never allowed to break a form submission.
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
