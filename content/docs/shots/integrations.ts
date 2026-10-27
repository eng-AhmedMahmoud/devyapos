import { BOTH, type ShotSpec } from "../surfaces.ts";

/**
 * Screenshot slots used by the Moving POS "integrations" articles. Ids start with the product.
 * The back-office screens need their feature on the demo tenant (it is seeded with every feature);
 * none of them writes. accounting has no slot: it links the site's /accounting-trial page in text. online-payments has no slot: the ordering site's payment choice only shows
 * with a filled cart, and the payment gateway is set up per account, not on a screen.
 */
export const shots = {
  /* zatca-e-invoicing: admin-app /zatca (zatcaEInvoicing). The demo is an EGP tenant, so its
     readiness strip lists what a Saudi account would still need. */
  "pos-integrations-zatca": { surface: "pos-admin", path: "/zatca", devices: BOTH },
  /* delivery-apps: admin-app /delivery-apps (the list, with the margins panel). */
  "pos-integrations-delivery-apps": { surface: "pos-admin", path: "/delivery-apps", devices: BOTH },
  /* pos-api-and-webhooks: admin-app /integrations opens on its API keys tab (fingerprints only). */
  "pos-integrations-api-keys": { surface: "pos-admin", path: "/integrations", devices: BOTH },
} as const satisfies Record<string, ShotSpec>;
