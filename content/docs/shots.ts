/**
 * The help centre's screenshot slots: every figure in every article, keyed by
 * id, with the app and path it is shot from. Each category keeps its own
 * list in content/docs/shots/<category>.ts; the apps — the only places a
 * screenshot may come from — are in content/docs/surfaces.ts.
 *
 * Imported by the site and, directly, by Node (scripts/capture-docs.mjs), so
 * imports carry their ".ts" extension and the TypeScript stays erasable.
 */
import { shots as gettingStarted } from "./shots/getting-started.ts";
import { shots as journeys } from "./shots/journeys.ts";
import { shots as setup } from "./shots/setup.ts";
import { shots as payments } from "./shots/payments.ts";
import { shots as branches } from "./shots/branches.ts";
import { shots as selling } from "./shots/selling.ts";
import { shots as onlineOrdering } from "./shots/online-ordering.ts";
import { shots as inventory } from "./shots/inventory.ts";
import { shots as reports } from "./shots/reports.ts";
import { shots as assistant } from "./shots/assistant.ts";
import { shots as loyalty } from "./shots/loyalty.ts";
import { shots as integrations } from "./shots/integrations.ts";

export { BOTH, DESKTOP, DEVICES, PHONE, SURFACES } from "./surfaces.ts";
export type { ShotDevice, ShotSpec, ShotSurface, SurfaceName } from "./surfaces.ts";

export const SHOTS = {
  ...gettingStarted,
  ...journeys,
  ...setup,
  ...payments,
  ...branches,
  ...selling,
  ...onlineOrdering,
  ...inventory,
  ...reports,
  ...assistant,
  ...loyalty,
  ...integrations,
} as const;

export type ShotId = keyof typeof SHOTS;
