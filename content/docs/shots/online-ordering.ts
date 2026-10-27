import { BOTH, type ShotSpec } from "../surfaces.ts";

/**
 * Screenshot slots used by the "online-ordering" articles. Ids start with the product.
 * Read-only screens only: the ordering site's home (its menu waits for a branch pick,
 * so it has no slot), the kitchen display and today's orders on the register, and the
 * table cards sheet (on the demo tenant, which holds every capability). The guest's
 * table page needs a live table code, so it has no slot.
 */
export const shots = {
  "pos-ordering-home": { surface: "pos-ordering", path: "", devices: BOTH },
  "pos-online-kds": { surface: "pos-register", path: "/kds", devices: BOTH },
  "pos-online-today-orders": { surface: "pos-register", path: "/orders", devices: BOTH },
  /* pos-app/app/floor/codes/page.tsx is gated on `tableService` + `dineInQr` (on with the demo's
     "all"), and its GET needs `tables.qr`, which by default only Admin and Branch manager hold: the
     capture account must hold it (a demo cashier does not), or the screen shows an error. */
  "pos-table-cards": { surface: "pos-register", path: "/floor/codes", devices: BOTH, asManager: true },
} as const satisfies Record<string, ShotSpec>;
