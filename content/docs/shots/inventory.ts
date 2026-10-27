import { BOTH, type ShotSpec } from "../surfaces.ts";

/**
 * Screenshot slots used by the "pos-inventory" articles. Ids start with the product.
 * All four are back-office list screens that render on a GET alone. The transfers board needs
 * the transfers module on the demo tenant (it is); the analytics page needs the demo account to
 * hold the "Manage purchases" permission (admins do by default).
 */
export const shots = {
  /* ingredients-and-recipes: admin-app /menu reads ?tab= (app/menu/page.tsx). */
  "pos-inventory-ingredients": { surface: "pos-admin", path: "/menu?tab=ingredients", devices: BOTH },
  /* stock-per-branch */
  "pos-inventory-stock": { surface: "pos-admin", path: "/inventory", devices: BOTH },
  /* inventory-transfers: the board (app/inventory/transfers/page.tsx). */
  "pos-inventory-transfers": { surface: "pos-admin", path: "/inventory/transfers", devices: BOTH },
  /* inventory-analytics */
  "pos-inventory-analytics": { surface: "pos-admin", path: "/inventory/analytics", devices: BOTH },
} as const satisfies Record<string, ShotSpec>;
