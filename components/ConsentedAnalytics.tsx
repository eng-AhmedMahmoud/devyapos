"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useConsent } from "./useConsent";

/**
 * Vercel Web Analytics and Speed Insights, gated behind analytics consent.
 *
 * Neither `<Analytics />` nor `<SpeedInsights />` is mounted until the visitor
 * has opted into the analytics category, so their scripts never load and no
 * request leaves the browser before consent. Withdrawing consent unmounts them
 * on the next render; already-loaded scripts stop receiving new events.
 */
export default function ConsentedAnalytics() {
  const { state } = useConsent();
  if (!state.analytics) return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
