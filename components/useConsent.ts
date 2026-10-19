"use client";

import { useSyncExternalStore } from "react";
import { CONSENT_EVENT, readConsent, type ConsentState } from "@/lib/consent";

/**
 * The current consent choice, kept in sync across every component that asks.
 *
 * Read through `useSyncExternalStore`: the server snapshot is "unset", so the
 * prerendered HTML and the hydrating render agree, and React swaps in the
 * stored value straight after hydration. Before that we genuinely do not know,
 * and "unset" is the answer that keeps trackers off — the safe direction for
 * the few milliseconds it lasts. (It also means the banner is in the server
 * HTML and leaves at hydration for a visitor who has already answered.)
 *
 * `storage` is listened to as well as our own event, so accepting in one tab
 * stops the banner nagging in another.
 */
export function useConsent(): ConsentState {
  return useSyncExternalStore(subscribe, readConsent, () => "unset");
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
