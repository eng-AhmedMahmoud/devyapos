import { BOTH, DESKTOP, type ShotSpec } from "../surfaces.ts";

/**
 * Screenshot slots used by the "branches" articles. Ids start with the product.
 * List and settings screens of the back office, plus the register's shift screen.
 * The order-numbering card sits beside the settings form only at desktop width
 * (it drops below the fold on a phone), so that slot is desktop only. Dialogs
 * (new branch, branch prices) need clicks on demo rows, so they have no slot.
 * The demo seed gives every branch two delivery zones (backend/prisma/seed.ts zonesFor)
 * and back-filled business days; it has no warehouse site. The register's /shift
 * is shot with the cashier's shift open, so it shows the shift card, not Start day.
 */
export const shots = {
  "pos-branches-list": { surface: "pos-admin", path: "/branches", devices: BOTH },
  "pos-zones-list": { surface: "pos-admin", path: "/zones", devices: BOTH },
  "pos-settings-order-numbering": { surface: "pos-admin", path: "/settings", devices: DESKTOP },
  "pos-shift-business-day": { surface: "pos-register", path: "/shift", devices: BOTH },
  "pos-business-days": { surface: "pos-admin", path: "/business-days", devices: BOTH },
  "pos-menu-products": { surface: "pos-admin", path: "/menu?tab=products", devices: BOTH },
} as const satisfies Record<string, ShotSpec>;
