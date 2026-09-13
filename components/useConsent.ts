"use client";

import { useSyncExternalStore } from "react";
import {
  CONSENT_EVENT,
  DEFAULT_CONSENT,
  hasDecided,
  readConsent,
  type ConsentState,
} from "@/lib/consent";

/**
 * Live view of the visitor's consent choice.
 *
 * Backed by `useSyncExternalStore` so every gated component (the analytics
 * wrapper, the banner) re-renders the instant a choice is written — in this tab
 * via {@link CONSENT_EVENT}, and in other tabs via the `storage` event.
 */

export interface ConsentSnapshot {
  state: ConsentState;
  /** False until the visitor has made an explicit choice. */
  decided: boolean;
}

/* The server (and first client) snapshot is the privacy-preserving default:
   denied, undecided. It must be a stable reference or the store loops. */
const SERVER_SNAPSHOT: ConsentSnapshot = {
  state: { ...DEFAULT_CONSENT },
  decided: false,
};

/* getSnapshot must return a referentially-stable value between changes, so the
   result is cached and only rebuilt when the serialised state actually moves. */
let cache: ConsentSnapshot = SERVER_SNAPSHOT;
let cacheKey = "";

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): ConsentSnapshot {
  const state = readConsent();
  const decided = hasDecided();
  const key = `${decided ? 1 : 0}|${state.analytics ? 1 : 0}|${state.marketing ? 1 : 0}`;
  if (key !== cacheKey) {
    cacheKey = key;
    cache = { state, decided };
  }
  return cache;
}

function getServerSnapshot(): ConsentSnapshot {
  return SERVER_SNAPSHOT;
}

export function useConsent(): ConsentSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
