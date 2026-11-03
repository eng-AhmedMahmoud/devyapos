import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getContent } from "@/content";
import {
  COMPARE_GROUP_IDS,
  COMPARE_ROWS,
  planComparison,
  type CompareCell,
  type CompareRowId,
} from "@/lib/plan-compare";
import {
  BILLING_INTERVALS,
  PLAN_CURRENCIES,
  PLAN_IDS,
  planIncludes,
  planNumbers,
  planPrice,
  type BillingInterval,
  type PlanCurrency,
} from "@/lib/plans";

/*
 * The plan comparison on /pricing (components/PricingCompare.tsx). Every cell
 * is derived from lib/plans.ts, which tests/pricing.test.ts pins against
 * bohub-pos; here each cell is checked against the plan it came from, so the
 * table can never print a cap or a price the cards and the product do not.
 */

const locales = ["ar", "en"] as const;

/** One row's cells, for a currency and interval. */
function row(id: CompareRowId, currency: PlanCurrency = "EGP", interval: BillingInterval = "monthly") {
  const found = planComparison(currency, interval)
    .flatMap((group) => group.rows)
    .find((r) => r.id === id);
  if (!found) throw new Error(`No row ${id}`);
  return found.cells;
}

const unlimited: CompareCell = { kind: "unlimited" };
const included: CompareCell = { kind: "included" };
const excluded: CompareCell = { kind: "excluded" };

describe("plan comparison: the model", () => {
  it("has the two groups and every row once, in order, with a cell for each plan", () => {
    const groups = planComparison("EGP", "monthly");
    expect(groups.map((g) => g.id)).toEqual([...COMPARE_GROUP_IDS]);
    for (const group of groups) {
      expect(group.rows.map((r) => r.id)).toEqual([...COMPARE_ROWS[group.id]]);
      for (const r of group.rows) expect(Object.keys(r.cells)).toEqual([...PLAN_IDS]);
    }
    const ids = groups.flatMap((g) => g.rows.map((r) => r.id));
    expect(new Set(ids).size).toBe(ids.length);
    // The price and the caps first, then the features.
    expect(ids.slice(0, 2)).toEqual(["price", "branches"]);
    expect(COMPARE_ROWS.features.slice(0, 3)).toEqual(["tableService", "coursing", "splitBill"]);
  });

  it("prices every plan in every currency and interval at the catalogue's figure", () => {
    for (const currency of PLAN_CURRENCIES) {
      for (const interval of BILLING_INTERVALS) {
        const cells = row("price", currency, interval);
        for (const id of PLAN_IDS) {
          const price = planPrice(id, currency, interval);
          expect(cells[id], `${id} ${currency} ${interval}`).toEqual(
            price === null ? { kind: "quoted" } : { kind: "price", amount: price },
          );
        }
      }
    }
    // The cards' figures, as a reader sees them.
    expect(row("price", "EGP", "monthly").counter).toEqual({ kind: "price", amount: 799 });
    expect(row("price", "SAR", "yearly").dining).toEqual({ kind: "price", amount: 2_990 });
    expect(row("price", "USD", "monthly").free).toEqual({ kind: "price", amount: 0 });
    expect(row("price", "AED", "yearly").group).toEqual({ kind: "quoted" });
  });

  it("gives Free the product's caps", () => {
    const free = (id: CompareRowId) => row(id).free;
    expect(free("branches")).toEqual({ kind: "count", value: 1 });
    expect(free("staffPerBranch")).toEqual({ kind: "count", value: 2 });
    expect(free("products")).toEqual({ kind: "count", value: 30 });
    expect(free("ordersPerMonth")).toEqual({ kind: "count", value: 300 });
    expect(free("storage")).toEqual({ kind: "storage", value: 100, unit: "mb" });
    expect(free("aiCreditsMonthly")).toEqual(excluded);
    expect(free("aiTrialCredits")).toEqual({ kind: "count", value: 10 });
    expect(free("trial")).toEqual(excluded);
    expect(free("brands")).toEqual({ kind: "count", value: 1 });
    expect(free("apiKeys")).toEqual(excluded);
    // Nothing of the room; the receipt, ZATCA and the offline till, which no plan masks.
    for (const key of ["tableService", "coursing", "splitBill"] as const) expect(free(key)).toEqual(excluded);
    for (const key of ["zatcaEInvoicing", "offlinePos", "digitalReceipt"] as const) {
      expect(free(key)).toEqual(included);
    }
  });

  it("caps Counter and Dining room per paid branch, in the cards' units", () => {
    for (const id of ["counter", "dining"] as const) {
      const n = planNumbers(id);
      expect(row("branches")[id]).toEqual({ kind: "paidBranches" });
      expect(row("staffPerBranch")[id]).toEqual({ kind: "count", value: n.limits.staffPerBranch });
      expect(row("products")[id]).toEqual(unlimited);
      expect(row("ordersPerMonth")[id]).toEqual(unlimited);
      expect(row("storage")[id]).toEqual({ kind: "storage", value: n.limits.storageMb! / 1024, unit: "gb" });
      expect(row("aiCreditsMonthly")[id]).toEqual({ kind: "count", value: n.aiCreditsMonthly });
      expect(row("trial")[id]).toEqual({ kind: "days", value: 14 });
      expect(row("apiKeys")[id]).toEqual(excluded);
      expect(row("brands")[id]).toEqual({ kind: "count", value: 1 });
    }
    expect(row("storage").counter).toEqual({ kind: "storage", value: 2, unit: "gb" });
    expect(row("storage").dining).toEqual({ kind: "storage", value: 5, unit: "gb" });
    // The room is what Dining room adds to Counter.
    for (const key of ["tableService", "coursing", "splitBill"] as const) {
      expect(row(key).counter, key).toEqual(excluded);
      expect(row(key).dining, key).toEqual(included);
    }
  });

  it("reads Group as unlimited and quoted", () => {
    for (const id of ["branches", "staffPerBranch", "products", "ordersPerMonth", "storage", "apiKeys", "brands"] as const) {
      expect(row(id).group, id).toEqual(unlimited);
    }
    expect(row("price").group).toEqual({ kind: "quoted" });
    expect(row("aiCreditsMonthly").group).toEqual({ kind: "count", value: 300 });
    for (const key of COMPARE_ROWS.features) {
      if (key === "apiKeys" || key === "brands") continue;
      expect(row(key).group, key).toEqual(included);
    }
  });

  it("marks a feature included exactly where the plan's package includes it", () => {
    const flags = ["tableService", "coursing", "splitBill", "zatcaEInvoicing", "offlinePos", "digitalReceipt"] as const;
    // Every feature row but the two counted ones is a flag.
    expect(COMPARE_ROWS.features.filter((key) => key !== "apiKeys" && key !== "brands")).toEqual([...flags]);
    for (const key of flags) {
      for (const id of PLAN_IDS) {
        expect(row(key)[id], `${id} ${key}`).toEqual(planIncludes(id, key) ? included : excluded);
      }
    }
  });

  it("gives every plan its 10 AI credits to try, once", () => {
    for (const id of PLAN_IDS) {
      expect(row("aiTrialCredits")[id]).toEqual({ kind: "count", value: planNumbers(id).aiTrialCredits });
    }
  });
});

describe("plan comparison: the words", () => {
  const rowIds = COMPARE_GROUP_IDS.flatMap((group) => [...COMPARE_ROWS[group]]);

  it.each(locales)("%s: names every row, and nothing else", (locale) => {
    const words = getContent(locale).pricing.comparePlans;
    expect(Object.keys(words.rows).sort()).toEqual([...rowIds].sort());
    for (const id of rowIds) expect(words.rows[id].trim(), id).not.toBe("");
  });

  it.each(locales)("%s: has every word a cell is printed with", (locale) => {
    const words = getContent(locale).pricing.comparePlans;
    const { rows, ...rest } = words;
    expect(Object.keys(rows).length).toBe(rowIds.length);
    for (const [key, value] of Object.entries(rest)) expect(value.trim(), key).not.toBe("");
    expect(words.days).toContain("{days}");
    // Group's price is the card's own word.
    expect(getContent(locale).pricing.plans.find((p) => p.id === "group")!.priceLabel).toBeTruthy();
  });

  it("has the same keys in both languages", () => {
    const [ar, en] = locales.map((locale) => getContent(locale).pricing.comparePlans);
    expect(Object.keys(ar).sort()).toEqual(Object.keys(en).sort());
    expect(Object.keys(ar.rows).sort()).toEqual(Object.keys(en.rows).sort());
  });

  it("is on /pricing, under the plan cards and over the AI credits", () => {
    const page = readFileSync(join(process.cwd(), "app/[locale]/pricing/page.tsx"), "utf8");
    expect(page).toMatch(/<Pricing\b[^>]*\bwithCompare\b/);
    const grid = readFileSync(join(process.cwd(), "components/Pricing.tsx"), "utf8");
    const cards = grid.indexOf("copy.plans.map(");
    const table = grid.indexOf("<PricingCompare");
    const ai = grid.indexOf("<PricingAi");
    expect(cards).toBeGreaterThan(-1);
    expect(table).toBeGreaterThan(cards);
    expect(ai).toBeGreaterThan(table);
  });

  it("is a captioned table with row and column heads, in a focusable scroll region", () => {
    const source = readFileSync(join(process.cwd(), "components/PricingCompare.tsx"), "utf8");
    expect(source).toContain('id="compare-plans"');
    expect(source).toContain("<caption");
    expect(source).toContain('scope="col"');
    expect(source).toContain('scope="row"');
    expect(source).toContain('role="region"');
    expect(source).toContain("tabIndex={0}");
    expect(source).toContain("overflow-x-auto");
    // Logical properties only: the sticky row heads sit at the inline start in both directions.
    expect(source).toContain("sticky start-0");
    expect(source).not.toMatch(/\b(?:left|right)-\d|\b(?:ml|mr|pl|pr)-\d|\btext-(?:left|right)\b/);
    // A tick or a dash always carries its words for a screen reader.
    expect(source.match(/className="sr-only"/g)?.length).toBeGreaterThanOrEqual(3);
  });
});
