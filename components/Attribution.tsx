"use client";

import { useEffect } from "react";
import { captureFirstTouch, clearAttribution } from "@/lib/analytics";
import { useConsent } from "./useConsent";

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
 * errors, so this stays a no-op in private mode and for bots. Renders nothing.
 *
 * Gated on consent, because knowing which advert brought someone is marketing
 * measurement and not something the site needs in order to work. The cost of
 * that is real and worth stating: a visitor who accepts on the second page has
 * already lost the UTMs from the first, so paid traffic that consents late is
 * attributed to nothing rather than to the wrong campaign. Under-counting is
 * the honest failure here — the banner says non-essential storage stays off
 * until you accept, and writing the record before the click would make that
 * sentence false.
 */
export default function Attribution() {
  const consent = useConsent();

  useEffect(() => {
    if (consent === "granted") {
      captureFirstTouch();
      return;
    }
    /* Refused, or accepted and then withdrawn. Clearing on every non-granted
       state — rather than only on the transition to "denied" — also covers the
       visitor who accepted in another tab, refused here, and would otherwise
       keep a record this tab never noticed being written. */
    clearAttribution();
  }, [consent]);

  return null;
}
