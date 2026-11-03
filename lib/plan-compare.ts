/**
 * The plan comparison on /pricing, as data: one row per price, cap or
 * feature, one cell per plan, every cell read from `lib/plans.ts`.
 *
 * The table (`components/PricingCompare.tsx`) only words and draws these
 * cells, so no figure can be typed into the grid by hand, and
 * `tests/plan-compare.test.ts` checks each cell against the plan it came from.
 * A plain module (no "use client"): the grid renders inside the plan grid,
 * which owns the billing and currency switches, and its tests run in node.
 */

import {
  PLAN_IDS,
  planIncludes,
  planNumbers,
  planPrice,
  type BillingInterval,
  type PlanCurrency,
  type PlanId,
} from "./plans";

/** The rows in the order the table shows them: the price and the caps, then the features. */
export const COMPARE_ROWS = {
  limits: [
    "price",
    "branches",
    "staffPerBranch",
    "products",
    "ordersPerMonth",
    "storage",
    "aiCreditsMonthly",
    "aiTrialCredits",
    "trial",
  ],
  features: [
    "tableService",
    "coursing",
    "splitBill",
    "zatcaEInvoicing",
    "offlinePos",
    "digitalReceipt",
    "apiKeys",
    "brands",
  ],
} as const;

export const COMPARE_GROUP_IDS = ["limits", "features"] as const;
export type CompareGroupId = (typeof COMPARE_GROUP_IDS)[number];
export type CompareRowId = (typeof COMPARE_ROWS)[CompareGroupId][number];

export type CompareCell =
  /** The per-branch price for the chosen currency and interval, in whole units. */
  | { kind: "price"; amount: number }
  /** Group's price, agreed per deal: the table prints the card's own word. */
  | { kind: "quoted" }
  | { kind: "count"; value: number }
  | { kind: "unlimited" }
  /** A per-branch plan's branch cap: as many branches as are paid for. */
  | { kind: "paidBranches" }
  | { kind: "storage"; value: number; unit: "mb" | "gb" }
  | { kind: "days"; value: number }
  | { kind: "included" }
  | { kind: "excluded" };

export interface CompareRow {
  id: CompareRowId;
  cells: Record<PlanId, CompareCell>;
}

export interface CompareGroup {
  id: CompareGroupId;
  rows: CompareRow[];
}

/** A cap as a cell: `null` is no cap, and 0 means the plan has none of it. */
function cap(value: number | null): CompareCell {
  if (value === null) return { kind: "unlimited" };
  if (value === 0) return { kind: "excluded" };
  return { kind: "count", value };
}

/** Storage as the cards print it: whole gigabytes from 1 GB up, megabytes below. */
function storage(mb: number | null): CompareCell {
  if (mb === null) return { kind: "unlimited" };
  if (mb >= 1024 && mb % 1024 === 0) return { kind: "storage", value: mb / 1024, unit: "gb" };
  return { kind: "storage", value: mb, unit: "mb" };
}

function cell(
  id: PlanId,
  row: CompareRowId,
  currency: PlanCurrency,
  interval: BillingInterval,
): CompareCell {
  const plan = planNumbers(id);
  switch (row) {
    case "price": {
      const amount = planPrice(id, currency, interval);
      return amount === null ? { kind: "quoted" } : { kind: "price", amount };
    }
    case "branches":
      // No branch cap means "the branches paid for" on a priced plan and no
      // cap at all on a quoted one: the product's `effectiveLimits`.
      if (plan.limits.branches === null && plan.prices !== null) return { kind: "paidBranches" };
      return cap(plan.limits.branches);
    case "staffPerBranch":
      return cap(plan.limits.staffPerBranch);
    case "products":
      return cap(plan.limits.products);
    case "ordersPerMonth":
      return cap(plan.limits.ordersPerMonth);
    case "storage":
      return storage(plan.limits.storageMb);
    case "aiCreditsMonthly":
      return cap(plan.aiCreditsMonthly);
    case "aiTrialCredits":
      return cap(plan.aiTrialCredits);
    case "trial":
      return plan.trialDays > 0 ? { kind: "days", value: plan.trialDays } : { kind: "excluded" };
    case "apiKeys":
      return cap(plan.limits.apiKeys);
    case "brands":
      return cap(plan.limits.brands);
    default:
      // The rest are feature flags, read as the package sells them.
      return planIncludes(id, row) ? { kind: "included" } : { kind: "excluded" };
  }
}

/** The whole table for one currency and billing interval, rows in `COMPARE_ROWS` order. */
export function planComparison(
  currency: PlanCurrency,
  interval: BillingInterval,
): CompareGroup[] {
  return COMPARE_GROUP_IDS.map((group) => ({
    id: group,
    rows: (COMPARE_ROWS[group] as readonly CompareRowId[]).map((row) => ({
      id: row,
      cells: Object.fromEntries(
        PLAN_IDS.map((id) => [id, cell(id, row, currency, interval)]),
      ) as Record<PlanId, CompareCell>,
    })),
  }));
}
