/**
 * Cookie / tracking consent — the model, the store, and the events.
 *
 * The privacy-preserving default is the whole point: until the visitor makes an
 * explicit choice, every non-essential category is DENIED, so nothing loads and
 * nothing is stored. "Reject all" is therefore identical to the default state,
 * which is what keeps rejecting as cheap as accepting.
 *
 * Categories:
 *   - strictly necessary — always on, not represented here (there is nothing to
 *     toggle: the site works without any of the below).
 *   - analytics — Vercel Web Analytics + Speed Insights.
 *   - marketing — first-touch campaign attribution (UTM capture) posted with a
 *     lead.
 *
 * Deliberately dependency-free and guarded on `window`, so it imports cleanly
 * into both client components and modules that also run during SSR
 * (`lib/analytics.ts`). Persisted in localStorage so the choice survives across
 * sessions; a version tag lets a future shape change re-ask rather than trust a
 * stale record.
 */

export type ConsentCategory = "analytics" | "marketing";

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
}

export interface StoredConsent extends ConsentState {
  version: number;
  /** ISO timestamp of the decision — evidence of when consent was given. */
  updatedAt: string;
}

export const CONSENT_VERSION = 1;
const STORAGE_KEY = "devyapos.consent.v1";

/** Dispatched on `window` whenever a choice is written, so live components re-read. */
export const CONSENT_EVENT = "devyapos:consent-change";
/** Dispatched on `window` to ask the consent UI to open its preferences panel. */
export const CONSENT_OPEN_EVENT = "devyapos:consent-open";

/** Privacy-preserving default: nothing non-essential until the visitor opts in. */
export const DEFAULT_CONSENT: ConsentState = Object.freeze({
  analytics: false,
  marketing: false,
});

/** The stored decision, or null when the visitor has not decided yet. */
export function readStoredConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent> | null;
    // A record from an older version is treated as "no decision" so the banner
    // re-asks against the current categories rather than trusting stale bits.
    if (!parsed || typeof parsed !== "object" || parsed.version !== CONSENT_VERSION) {
      return null;
    }
    return {
      version: CONSENT_VERSION,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return null;
  }
}

/** Effective consent — denied-by-default until a stored decision exists. */
export function readConsent(): ConsentState {
  const stored = readStoredConsent();
  return stored
    ? { analytics: stored.analytics, marketing: stored.marketing }
    : { ...DEFAULT_CONSENT };
}

/** Whether the visitor has made an explicit choice yet. */
export function hasDecided(): boolean {
  return readStoredConsent() !== null;
}

/** Persist a choice and notify the page. Safe to call before consent, too. */
export function writeConsent(state: ConsentState): void {
  if (typeof window === "undefined") return;
  const record: StoredConsent = {
    version: CONSENT_VERSION,
    analytics: state.analytics === true,
    marketing: state.marketing === true,
    updatedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Private mode / storage disabled: the choice still applies for this page
    // load through the event below; it just will not persist to the next one.
  }
  window.dispatchEvent(
    new CustomEvent<ConsentState>(CONSENT_EVENT, {
      detail: { analytics: record.analytics, marketing: record.marketing },
    }),
  );
}

/** Opt into every category. */
export function acceptAll(): void {
  writeConsent({ analytics: true, marketing: true });
}

/** Refuse every non-essential category — identical to the default state. */
export function rejectAll(): void {
  writeConsent({ analytics: false, marketing: false });
}

/** Ask the consent UI to reopen its preferences panel (used by the footer link). */
export function openConsentSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
