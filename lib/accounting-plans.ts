/**
 * Moving POS Accounting plans: the numbers /accounting-trial sells, in one place.
 *
 * These are decided in the product, not here. The source of truth is
 * bohub-pos `accounting-app/lib/plans.ts` (prices, caps, AI allowances, the
 * extras and the two offers; decision
 * `docs/decisions/2026-10-27-accounting-plans-prices-and-limits.md`, plan
 * `docs/plans/2026-10-27-accounting-plans-and-prices.md`). Change them there
 * first, then here; `tests/accounting-pricing.test.ts` pins every figure so a
 * drift on either side fails a test. The moving-accounting landing carries the
 * same numbers and pins them too.
 *
 * The same family as the POS plans in `lib/plans.ts`, on purpose: the same
 * four currencies, a year at ten months, a 14-day trial on every paid plan,
 * the same two offers (`PLAN_OFFERS`, the 500 accounts counted per product)
 * and the same AI credit packs (`AI_PACKS`). What differs:
 *
 *   - **A plan is priced per company**, not per branch: one accounting
 *     system is one company, and branches are one of the caps.
 *   - **Paid plans differ by size only**: every feature, e-invoicing and the
 *     onboarding in every paid plan; invoices, entries and contacts unlimited.
 *   - **Free is a taster**: small enough to try the books, not to run a
 *     growing business — no e-invoicing, no bank import, no POS connector or
 *     API. A trial that ends drops to Free's limits.
 *   - **There is no POS add-on.** Until 2026-10-27 a Moving POS restaurant
 *     could add accounting at EGP 299 a branch; it now takes the plan that fits
 *     the company, and the POS link is included.
 *
 * Two differences from the product's file, as in `lib/plans.ts`: prices are
 * whole currency units (every list price is whole), and Free carries explicit
 * zero prices so its card prints "0" in the currency the visitor picked.
 */
import {
  bestOpenOffer,
  type BillingInterval,
  type PlanCurrency,
  type PlanOffer,
} from "./plans";

export const ACCOUNTING_PLAN_IDS = ["free", "starter", "business", "professional", "enterprise"] as const;
export type AccountingPlanId = (typeof ACCOUNTING_PLAN_IDS)[number];

/** The plans that get a card on the page; Enterprise is the quoted line under the grid. */
export const ACCOUNTING_CARD_IDS = ["free", "starter", "business", "professional"] as const;
export type AccountingCardId = (typeof ACCOUNTING_CARD_IDS)[number];

/** Features a plan may lack. Every paid plan has all of them; Free has none. */
export const ACCOUNTING_FEATURES = ["bankImport", "posConnector", "api"] as const;
export type AccountingFeature = (typeof ACCOUNTING_FEATURES)[number];

/** Every paid plan starts with this trial, no card. */
export const ACCOUNTING_TRIAL_DAYS = 14;

/** Days a trial that ended keeps its books readable on Free's limits before its system is wiped. */
export const ACCOUNTING_GRACE_DAYS = 7;

/** How long Free's one-time AI credits last. */
export const AI_TRIAL_CREDIT_DAYS = 30;

export interface AccountingPlanNumbers {
  id: AccountingPlanId;
  /**
   * Per-company list prices, [monthly, yearly], VAT excluded, in whole
   * units. `null` for Enterprise, which is quoted per deal.
   */
  prices: Record<PlanCurrency, readonly [number, number]> | null;
  trialDays: number;
  /** `null` = no cap. */
  limits: {
    users: number | null;
    branches: number | null;
    /** A ZATCA unit or an ETA point of sale. */
    einvoiceUnits: number | null;
    /** Bill captures included a month; past them a capture draws AI credits. */
    billCapturesPerMonth: number | null;
    storageMb: number | null;
    /** Sales documents issued plus supplier bills entered, a month. */
    invoicesPerMonth: number | null;
    /** Manual journal entries a month; postings that follow from a document never count. */
    entriesPerMonth: number | null;
    /** Customers and suppliers. */
    contacts: number | null;
  };
  /** AI credits granted each month while the plan is active. */
  aiCreditsMonthly: number;
  /** AI credits granted once, valid `AI_TRIAL_CREDIT_DAYS`. */
  aiTrialCredits: number;
  features: readonly AccountingFeature[];
}

const FREE_PRICES = { EGP: [0, 0], SAR: [0, 0], AED: [0, 0], USD: [0, 0] } as const;
const UNLIMITED_VOLUME = { invoicesPerMonth: null, entriesPerMonth: null, contacts: null } as const;

export const ACCOUNTING_PLANS: readonly AccountingPlanNumbers[] = [
  {
    id: "free",
    prices: FREE_PRICES,
    trialDays: 0,
    limits: {
      users: 1,
      branches: 1,
      einvoiceUnits: 0,
      billCapturesPerMonth: 0,
      storageMb: 100,
      invoicesPerMonth: 20,
      entriesPerMonth: 50,
      contacts: 25,
    },
    aiCreditsMonthly: 0,
    aiTrialCredits: 10,
    features: [],
  },
  {
    id: "starter",
    prices: {
      EGP: [699, 6_990],
      SAR: [119, 1_190],
      AED: [119, 1_190],
      USD: [29, 290],
    },
    trialDays: ACCOUNTING_TRIAL_DAYS,
    limits: {
      users: 3,
      branches: 1,
      einvoiceUnits: 1,
      billCapturesPerMonth: 50,
      storageMb: 1_024,
      ...UNLIMITED_VOLUME,
    },
    aiCreditsMonthly: 5,
    aiTrialCredits: 10,
    features: ACCOUNTING_FEATURES,
  },
  {
    id: "business",
    prices: {
      EGP: [1_199, 11_990],
      SAR: [229, 2_290],
      AED: [229, 2_290],
      USD: [59, 590],
    },
    trialDays: ACCOUNTING_TRIAL_DAYS,
    limits: {
      users: 8,
      branches: 3,
      einvoiceUnits: 3,
      billCapturesPerMonth: 200,
      storageMb: 5_120,
      ...UNLIMITED_VOLUME,
    },
    aiCreditsMonthly: 10,
    aiTrialCredits: 10,
    features: ACCOUNTING_FEATURES,
  },
  {
    id: "professional",
    prices: {
      EGP: [2_199, 21_990],
      SAR: [349, 3_490],
      AED: [349, 3_490],
      USD: [89, 890],
    },
    trialDays: ACCOUNTING_TRIAL_DAYS,
    limits: {
      users: 15,
      branches: 10,
      einvoiceUnits: 10,
      billCapturesPerMonth: 500,
      storageMb: 10_240,
      ...UNLIMITED_VOLUME,
    },
    aiCreditsMonthly: 25,
    aiTrialCredits: 10,
    features: ACCOUNTING_FEATURES,
  },
  {
    id: "enterprise",
    prices: null,
    trialDays: ACCOUNTING_TRIAL_DAYS,
    limits: {
      users: null,
      branches: null,
      einvoiceUnits: null,
      billCapturesPerMonth: null,
      storageMb: null,
      ...UNLIMITED_VOLUME,
    },
    aiCreditsMonthly: 25,
    aiTrialCredits: 10,
    features: ACCOUNTING_FEATURES,
  },
];

/**
 * Extras on top of a paid plan, a month, in whole units (the product's
 * `PLAN_EXTRAS`): an extra user, and an extra branch with its e-invoicing unit.
 */
export const ACCOUNTING_EXTRAS: Record<"user" | "branch", Record<PlanCurrency, number>> = {
  user: { EGP: 99, SAR: 25, AED: 25, USD: 7 },
  branch: { EGP: 249, SAR: 49, AED: 49, USD: 13 },
};

/**
 * Which e-invoicing system a price list's card names. The product files to
 * the ETA in Egypt and to ZATCA in Saudi Arabia; a company billed in AED or
 * USD still uses its units with one of the two, so its card names both.
 */
export const EINVOICING_SYSTEM: Record<PlanCurrency, "eta" | "zatca" | "either"> = {
  EGP: "eta",
  SAR: "zatca",
  AED: "either",
  USD: "either",
};

export function accountingPlan(id: AccountingPlanId): AccountingPlanNumbers {
  const plan = ACCOUNTING_PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown accounting plan ${id}`);
  return plan;
}

/** The per-company price for one interval, or null when the plan is quoted. */
export function accountingPrice(
  id: AccountingPlanId,
  currency: PlanCurrency,
  interval: BillingInterval,
): number | null {
  const pair = accountingPlan(id).prices?.[currency];
  if (!pair) return null;
  return interval === "yearly" ? pair[1] : pair[0];
}

/** The cheapest paid monthly price in a currency — the "from" figure other pages quote. */
export function accountingFromPrice(currency: PlanCurrency): number {
  const paid = ACCOUNTING_PLANS.flatMap((p) => (p.prices && p.prices[currency][0] > 0 ? [p.prices[currency][0]] : []));
  return Math.min(...paid);
}

/**
 * The open offer worth more on `interval` for a plan — the product's
 * `bestOffer`. Free costs nothing and Enterprise is quoted, so neither takes
 * one.
 */
export function bestAccountingOffer(
  id: AccountingPlanId,
  interval: BillingInterval,
  now: number,
): PlanOffer | null {
  if (id === "free" || id === "enterprise") return null;
  return bestOpenOffer(interval, now);
}

