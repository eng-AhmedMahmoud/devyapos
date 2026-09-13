"use client";

import { useEffect } from "react";
import { captureFirstTouch } from "@/lib/analytics";
import { CONSENT_EVENT } from "@/lib/consent";

/**
 * First-touch attribution, mounted once in the root layout.
 *
 * The capture used to live on /contact, which credited the wrong thing: the
 * common paid path is `/?utm_source=meta` → /pricing → /contact, and by the
 * time the form mounted the campaign parameters were three navigations gone.
 * Running it on the first page of the visit — whichever page that is — is the
 * only place the UTMs still exist.
 *
 * `captureFirstTouch` is idempotent (first touch wins, later mounts just read
 * the record back), returns null during SSR, and swallows its own storage
 * errors, so this stays a no-op in private mode and for bots. It also no-ops
 * until the visitor opts into marketing, so this re-runs when consent changes:
 * someone who grants marketing after landing still gets attributed for the page
 * they are on. Renders nothing.
 */
export default function Attribution() {
  useEffect(() => {
    captureFirstTouch();
    const onConsentChange = () => captureFirstTouch();
    window.addEventListener(CONSENT_EVENT, onConsentChange);
    return () => window.removeEventListener(CONSENT_EVENT, onConsentChange);
  }, []);

  return null;
}
