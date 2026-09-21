"use client";

import { useEffect, useState } from "react";
import { CONSENT_EVENT, readConsent, type ConsentState } from "@/lib/consent";

/**
 * The current consent choice, kept in sync across every component that asks.
 *
 * Starts at "unset" rather than reading storage during render: the pages are
 * prerendered, so a first render that depended on localStorage would not match
 * the server HTML. The real value arrives in the effect, one tick later, which
 * is also the moment the banner is allowed to appear.
 *
 * `storage` is listened to as well as our own event, so accepting in one tab
 * stops the banner nagging in another.
 */
export function useConsent(): ConsentState {
  const [consent, setConsent] = useState<ConsentState>("unset");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);

    const sync = () => setConsent(readConsent());
    window.addEventListener(CONSENT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  /* Before the effect runs we genuinely do not know, and "unset" is the answer
     that keeps trackers off and the banner hidden — neither of which is wrong
     for the few milliseconds it lasts. */
  return ready ? consent : "unset";
}
