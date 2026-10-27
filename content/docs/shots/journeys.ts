import type { ShotSpec } from "../surfaces.ts";

/**
 * Screenshot slots the "journeys" articles add. Ids start with "pos-".
 * None: every role journey reuses the task articles' slots for the register,
 * the back office and the ordering site, each with its own alt and caption.
 * Pages of this marketing site (contact, hardware, the accounting trial) are
 * linked in the text, never shot.
 */
export const shots = {} as const satisfies Record<string, ShotSpec>;
