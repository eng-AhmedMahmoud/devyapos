import { BOTH, type ShotSpec } from "../surfaces.ts";

/**
 * Screenshot slots used by the "reports" articles. Ids start with the product.
 * Back-office list screens, all read-only GETs. /reports opens on the Daily tab; it honours
 * ?tab= only for the range tabs (app/reports/page.tsx RANGE_TABS), which include profitLoss.
 */
export const shots = {
  /* back-office-dashboard */
  "pos-reports-dashboard": { surface: "pos-admin", path: "/dashboard", devices: BOTH },
  /* sales-reports */
  "pos-reports-daily": { surface: "pos-admin", path: "/reports", devices: BOTH },
  "pos-reports-profit-loss": { surface: "pos-admin", path: "/reports?tab=profitLoss", devices: BOTH },
  /* shifts-and-z-reports */
  "pos-reports-shifts": { surface: "pos-admin", path: "/shifts", devices: BOTH },
  /* orders-and-activity-log */
  "pos-reports-orders": { surface: "pos-admin", path: "/orders", devices: BOTH },
  "pos-reports-activity": { surface: "pos-admin", path: "/activity", devices: BOTH },
} as const satisfies Record<string, ShotSpec>;
