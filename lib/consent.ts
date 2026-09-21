/**
 * Cookie and storage consent.
 *
 * The banner promises "non-essential stays off until you accept", so this
 * module has to be the thing that makes that true rather than a decoration on
 * top of scripts that already ran. Nothing measurable loads until `granted`:
 *
 *   essential      the theme choice, and this consent record itself. Both are
 *                  a direct response to something the visitor did, so neither
 *                  waits for permission.
 *   non-essential  Vercel Web Analytics, Speed Insights, and the first-touch
 *                  UTM capture. All three stay unmounted until `granted`, and
 *                  `denied` keeps them unmounted for a year.
 *
 * The record lives in localStorage rather than a cookie: a consent banner that
 * sets a cookie to remember that you refused cookies is the joke everyone has
 * already made, and localStorage is never sent to the server.
 */

export type ConsentState = "granted" | "denied" | "unset";

/** Versioned: a change to what we gate must re-ask rather than inherit a yes. */
const KEY = "devyapos.consent.v1";

/**
 * Fired on `window` when the choice changes, so the banner, the analytics
 * mount and the attribution capture all react to the same click without a
 * context provider wrapping the whole tree.
 */
export const CONSENT_EVENT = "devyapos:consent";

export function readConsent(): ConsentState {
  if (typeof window === "undefined") return "unset";
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw === "granted" || raw === "denied" ? raw : "unset";
  } catch {
    /* Private mode or storage disabled. Treated as "not answered", which keeps
       the non-essential scripts off — the safe direction to fail in. */
    return "unset";
  }
}

export function writeConsent(next: "granted" | "denied"): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, next);
  } catch {
    /* Unpersisted, but the event below still applies it for this page view. */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: next }));
}

/** Clears the record so the banner asks again. Used by the policy page link. */
export function resetConsent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignored — see writeConsent */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: "unset" }));
}
