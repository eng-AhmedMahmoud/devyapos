import { ATTRIBUTION_KEY } from "@/lib/leads";
import { createConsent } from "./core";

/**
 * This site's consent settings — the only per-site file of the shared consent
 * design (docs/compliance/consent-design.md).
 *
 * One optional category: **marketing** — the first-touch campaign record
 * (UTM tags, external referrer, landing path) kept in this tab's
 * sessionStorage and sent only with a lead the visitor chooses to submit
 * (`lib/analytics.ts`). No analytics provider and no ad pixel is connected;
 * wiring one means adding its category here, gating it with `<ConsentGate>`,
 * listing what it stores under `cleanup`, bumping `policyVersion`, and
 * updating the cookie table — tests/privacy.test.ts fails a third-party
 * script that skips those steps.
 */
export const consent = createConsent({
  storageKey: "devyapos.consent.v2",
  policyVersion: "2026-10-19",
  maxAgeDays: 180,
  categories: ["marketing"],
  receiptUrl: "/api/consent",
  // The bare "granted"/"denied" string of the first banner: never inherited.
  legacyKeys: ["devyapos.consent.v1"],
  cleanup: { marketing: { storage: [ATTRIBUTION_KEY] } },
});
