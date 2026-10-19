"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import type { ConsentApi, ConsentCategory, ConsentSnapshot } from "./core";
import { consent } from "./config";

/**
 * The visitor's answer, the same in every component that asks.
 *
 * The server snapshot is `pending`, so the prerendered HTML and the hydrating
 * render agree and carry no tracker and no banner; React swaps in the stored
 * answer straight after hydration. `storage` keeps other tabs in step.
 */
export function useConsent(api: ConsentApi = consent): ConsentSnapshot {
  return useSyncExternalStore(api.subscribe, api.read, api.serverSnapshot);
}

export function useConsentAllows(category: ConsentCategory): boolean {
  return consent.allows(useConsent(), category);
}

/**
 * Renders its children only once the visitor has opted in to `category`.
 * Every optional script, pixel, embed or storage write goes through one of
 * these (or `useConsentAllows`) — never straight into a layout.
 */
export function ConsentGate({
  category,
  children,
}: {
  category: ConsentCategory;
  children: ReactNode;
}) {
  return useConsentAllows(category) ? children : null;
}
