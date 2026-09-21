"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useConsent } from "./useConsent";

/**
 * Vercel's two measurement scripts, mounted only once consent is granted.
 *
 * This is what makes the banner's promise true. Returning null does not merely
 * stop events being sent — the components never mount, so neither script is
 * injected into the page at all, and a visitor who refuses (or who never
 * answers) is not measured rather than being measured silently.
 *
 * Both were previously mounted unconditionally in the root layout. They ship
 * nothing in development either way.
 */
export default function ConsentedAnalytics() {
  if (useConsent() !== "granted") return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
