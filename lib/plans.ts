/**
 * Moving POS plans: the numbers the pricing page sells, in one place.
 *
 * These are decided in the product, not here. The source of truth is
 * bohub-pos `packages/shared/src/plans.ts` (prices, caps, AI allowances and
 * the two offers; decision `docs/decisions/2026-10-27-pos-plans-prices-and-limits.md`)
 * and `packages/shared/src/ai-credits.ts` (the AI add-on tiers and packs;
 * decision `2026-10-26-ai-credits-and-usage-limits.md`). Change them there
 * first, then here; `tests/pricing.test.ts` pins every figure so a drift on
 * either side fails a test.
 *
 * Two differences from the product's file, both because this is a page and
 * not a bill:
 *
 *   - Prices are whole currency units, not minor units. Every list price is a
 *     whole number, so nothing is lost.
 *   - Free carries explicit zero prices, so its card can print "0" in the
 *     currency the visitor picked; the product leaves Free unpriced.
 *
 * The words — plan names, the lines on each card — live in `content/{ar,en}.ts`,
 * keyed by these ids. This module is plain (no "use client"), so the server
 * page, the JSON-LD and the client switch all read the same values.
 */

export const PLAN_IDS = ["free", "counter", "dining", "group"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

/** The price lists, in the order the currency switch shows them. EGP is the home price. */
export const PLAN_CURRENCIES = ["EGP", "SAR", "AED", "USD"] as const;
export type PlanCurrency = (typeof PLAN_CURRENCIES)[number];

export const BILLING_INTERVALS = ["monthly", "yearly"] as const;
export type BillingInterval = (typeof BILLING_INTERVALS)[number];

/**
 * The currency the switch starts on, per page language. Both are EGP: the site
 * sells to Egypt first, and the visitor's location is never looked up.
 */
export const DEFAULT_CURRENCY: Record<"ar" | "en", PlanCurrency> = {
  ar: "EGP",
  en: "EGP",
};

/** A year is billed at ten months: the switch's "2 months free". */
export const MONTHS_CHARGED_PER_YEAR = 10;

/** Every paid plan starts with this trial, no card. */
export const TRIAL_DAYS = 14;

/** Days an unpaid period or an expired trial keeps its plan before the account falls to Free. */
export const GRACE_DAYS = 7;

export interface PlanNumbers {
  id: PlanId;
  /**
   * Per-branch list prices, [monthly, yearly], VAT excluded, in whole units.
   * `null` for Group, which is quoted per deal.
   */
  prices: Record<PlanCurrency, readonly [number, number]> | null;
  trialDays: number;
  /** `null` = no cap. `branches: null` on a paid plan means "the branches paid for". */
  limits: {
    branches: number | null;
    staffPerBranch: number | null;
    products: number | null;
    ordersPerMonth: number | null;
    storageMb: number | null;
  };
  /** AI credits granted each month. */
  aiCreditsMonthly: number;
  /** AI credits granted once, on the account's first plan. */
  aiTrialCredits: number;
}

const FREE_PRICES = { EGP: [0, 0], SAR: [0, 0], AED: [0, 0], USD: [0, 0] } as const;

export const PLANS: readonly PlanNumbers[] = [
  {
    id: "free",
    prices: FREE_PRICES,
    trialDays: 0,
    limits: {
      branches: 1,
      staffPerBranch: 2,
      products: 30,
      ordersPerMonth: 300,
      storageMb: 100,
    },
    aiCreditsMonthly: 0,
    aiTrialCredits: 10,
  },
  {
    id: "counter",
    prices: {
      EGP: [799, 7_990],
      SAR: [149, 1_490],
      AED: [149, 1_490],
      USD: [29, 290],
    },
    trialDays: TRIAL_DAYS,
    limits: {
      branches: null,
      staffPerBranch: 10,
      products: null,
      ordersPerMonth: null,
      storageMb: 2_048,
    },
    aiCreditsMonthly: 10,
    aiTrialCredits: 10,
  },
  {
    id: "dining",
    prices: {
      EGP: [1_499, 14_990],
      SAR: [299, 2_990],
      AED: [299, 2_990],
      USD: [59, 590],
    },
    trialDays: TRIAL_DAYS,
    limits: {
      branches: null,
      staffPerBranch: 25,
      products: null,
      ordersPerMonth: null,
      storageMb: 5_120,
    },
    aiCreditsMonthly: 30,
    aiTrialCredits: 10,
  },
  {
    id: "group",
    prices: null,
    trialDays: TRIAL_DAYS,
    limits: {
      branches: null,
      staffPerBranch: null,
      products: null,
      ordersPerMonth: null,
      storageMb: null,
    },
    // AI Plus is part of the Group package.
    aiCreditsMonthly: 300,
    aiTrialCredits: 10,
  },
];

export function planNumbers(id: PlanId): PlanNumbers {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan ${id}`);
  return plan;
}

/** The per-branch price for one interval, or null when the plan is quoted. */
export function planPrice(
  id: PlanId,
  currency: PlanCurrency,
  interval: BillingInterval,
): number | null {
  const pair = planNumbers(id).prices?.[currency];
  if (!pair) return null;
  return interval === "yearly" ? pair[1] : pair[0];
}

// ── Offers ───────────────────────────────────────────────────────────────

export const OFFER_CODES = ["LAUNCH26", "WHITEFRIDAY26"] as const;
export type OfferCode = (typeof OFFER_CODES)[number];

export interface PlanOffer {
  code: OfferCode;
  monthlyPercentOff: number;
  /** How many monthly periods the monthly percent covers. */
  monthlyCycles: number;
  /** Off the first year, on a yearly plan. */
  yearlyPercentOff: number;
  /** Instants, inclusive at both ends. Both offers run on Cairo days. */
  startsAt: string;
  endsAt: string;
  /** How many accounts may hold it; the page says so, the team counts. */
  maxRedemptions: number | null;
}

/**
 * The two plan-fee offers, as the product runs them. An account holds one
 * offer for life, applied by the team when its first paid period starts —
 * the page only says which offers are open and what they come to.
 */
export const PLAN_OFFERS: readonly PlanOffer[] = [
  {
    code: "LAUNCH26",
    monthlyPercentOff: 40,
    monthlyCycles: 3,
    yearlyPercentOff: 20,
    startsAt: "2026-10-27T00:00:00.000Z",
    // 31 January 2027, 23:59:59 in Cairo.
    endsAt: "2027-01-31T21:59:59.000Z",
    maxRedemptions: 500,
  },
  {
    code: "WHITEFRIDAY26",
    monthlyPercentOff: 0,
    monthlyCycles: 0,
    yearlyPercentOff: 30,
    // 20 November 2026, 00:00 in Cairo, to 30 November, 23:59:59.
    startsAt: "2026-11-19T22:00:00.000Z",
    endsAt: "2026-11-30T21:59:59.000Z",
    maxRedemptions: null,
  },
];

export function offerOpen(offer: PlanOffer, now: number): boolean {
  return now >= Date.parse(offer.startsAt) && now <= Date.parse(offer.endsAt);
}

/** The offers open at `now`, in catalogue order. */
export function openOffers(now: number): PlanOffer[] {
  return PLAN_OFFERS.filter((offer) => offerOpen(offer, now));
}

/** The percent an offer takes off the first period of `interval`. */
export function offerPercent(offer: PlanOffer, interval: BillingInterval): number {
  return interval === "yearly" ? offer.yearlyPercentOff : offer.monthlyPercentOff;
}

/**
 * Of the offers open at `now`, the one worth more on `interval` — the
 * product's `bestOffer`: percent times the periods it covers, against a year.
 * Free costs nothing and Group is quoted, so neither takes an offer.
 */
export function bestOffer(
  id: PlanId,
  interval: BillingInterval,
  now: number,
): PlanOffer | null {
  if (id === "free" || id === "group") return null;
  let best: PlanOffer | null = null;
  let bestWorth = 0;
  for (const offer of openOffers(now)) {
    const worth =
      interval === "yearly"
        ? offer.yearlyPercentOff * 12
        : offer.monthlyPercentOff * offer.monthlyCycles;
    if (worth > bestWorth) {
      best = offer;
      bestWorth = worth;
    }
  }
  return best;
}

/**
 * A whole-unit price after `percent` off, rounded half up to a whole unit —
 * what the product's `discountedMinor` gives for a whole-unit list price.
 * Integer arithmetic, so 799 at 40 % is 479 and never 479.40000000000003.
 */
export function discounted(price: number, percent: number): number {
  if (percent <= 0 || price <= 0) return price;
  if (percent >= 100) return 0;
  return Math.min(price, Math.floor((price * (100 - percent) + 50) / 100));
}

// ── AI credits ───────────────────────────────────────────────────────────

/**
 * Every currency's price for one AI tier or pack. AED carries the SAR figure
 * and USD the SAR figure at 3.75 rounded up to a whole dollar, as the product
 * prices them.
 */
export type CurrencyPrices = Record<PlanCurrency, number>;

export const AI_TIER_IDS = ["lite", "basic", "plus", "pro"] as const;
export type AiTierId = (typeof AI_TIER_IDS)[number];

/**
 * The Moving AI add-on: a monthly allowance, monthly only, on any plan. The
 * product's ids are `ai-lite` … `ai-pro` (`AI_ADDON_TIERS`); the page needs
 * only the suffix.
 */
export const AI_TIERS: readonly { id: AiTierId; credits: number; price: CurrencyPrices }[] = [
  { id: "lite", credits: 25, price: { EGP: 369, SAR: 25, AED: 25, USD: 7 } },
  { id: "basic", credits: 100, price: { EGP: 1_179, SAR: 79, AED: 79, USD: 22 } },
  { id: "plus", credits: 300, price: { EGP: 3_399, SAR: 229, AED: 229, USD: 62 } },
  { id: "pro", credits: 800, price: { EGP: 8_929, SAR: 599, AED: 599, USD: 160 } },
];

/** One-off credit packs (`AI_PACKS`, `pack-100` …), valid for twelve months. */
export const AI_PACKS: readonly { credits: number; price: CurrencyPrices }[] = [
  { credits: 100, price: { EGP: 1_499, SAR: 99, AED: 99, USD: 27 } },
  { credits: 500, price: { EGP: 6_699, SAR: 449, AED: 449, USD: 120 } },
  { credits: 2_000, price: { EGP: 23_899, SAR: 1_599, AED: 1_599, USD: 427 } },
];

/** How long a pack's credits last. */
export const AI_PACK_MONTHS = 12;
