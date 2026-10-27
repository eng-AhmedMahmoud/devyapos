import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getContent } from "@/content";
import { foldDigits, formatNumber } from "@/lib/format";
import { softwareApplicationJsonLd } from "@/lib/jsonld";
import {
  AI_PACKS,
  AI_PACK_MONTHS,
  AI_TIERS,
  AI_TIER_IDS,
  DEFAULT_CURRENCY,
  GRACE_DAYS,
  MONTHS_CHARGED_PER_YEAR,
  OFFER_CODES,
  PLANS,
  PLAN_CURRENCIES,
  PLAN_IDS,
  PLAN_OFFERS,
  TRIAL_DAYS,
  bestOffer,
  discounted,
  offerOpen,
  openOffers,
  planNumbers,
  planPrice,
  type PlanCurrency,
  type PlanId,
} from "@/lib/plans";
import { routes } from "@/lib/routes";

/*
 * The pricing page sells what the product sells.
 *
 * THESE NUMBERS MUST MATCH bohub-pos `packages/shared/src/plans.ts` (the four
 * plans, their prices per currency, caps, AI allowances and the two offers;
 * decision docs/decisions/2026-10-27-pos-plans-prices-and-limits.md) and
 * `packages/shared/src/ai-credits.ts` (the AI tiers and packs; decision
 * 2026-10-26-ai-credits-and-usage-limits.md). The product's file is in minor
 * units; these are whole units. Change a price there first, then
 * `lib/plans.ts` and the table below in the same pull request — the product's
 * own tests pin the same figures, so a drift on either side fails a test.
 *
 * History: 2026-09-19 to 2026-10-27 the site sold Counter 199 and Dining room
 * 499 EGP, 30 % off yearly, with a "first 50 restaurants" founding price. The
 * cost model showed a one-branch tenant losing money on that yearly price.
 */

const locales = ["ar", "en"] as const;

/** Per-branch [monthly, yearly], whole units, VAT excluded — bohub-pos plans.ts ÷ 100. */
const PRICES: Record<"counter" | "dining", Record<PlanCurrency, [number, number]>> = {
  counter: { EGP: [799, 7_990], SAR: [149, 1_490], AED: [149, 1_490], USD: [29, 290] },
  dining: { EGP: [1_499, 14_990], SAR: [299, 2_990], AED: [299, 2_990], USD: [59, 590] },
};

/** Digits as ASCII and thousands separators gone, so "٢٬٠٠٠" reads as "2000". */
const plain = (s: string) => foldDigits(s).replace(/[,٬]/g, "");
/** True when `n` appears in `s` as a whole number. */
const mentions = (s: string, n: number) => new RegExp(`(^|\\D)${n}(\\D|$)`).test(plain(s));

const at = (iso: string) => Date.parse(iso);

describe("pricing: the plans", () => {
  it("are the product's four, in order, with the same ids in both languages", () => {
    expect(PLAN_IDS).toEqual(["free", "counter", "dining", "group"]);
    expect(PLANS.map((p) => p.id)).toEqual([...PLAN_IDS]);
    for (const locale of locales) {
      expect(getContent(locale).pricing.plans.map((p) => p.id), locale).toEqual([...PLAN_IDS]);
    }
  });

  it("are priced per branch in EGP, SAR, AED and USD at the product's prices", () => {
    expect(PLAN_CURRENCIES).toEqual(["EGP", "SAR", "AED", "USD"]);
    for (const id of ["counter", "dining"] as const) {
      for (const currency of PLAN_CURRENCIES) {
        expect(planNumbers(id).prices?.[currency], `${id} ${currency}`).toEqual(PRICES[id][currency]);
      }
    }
    for (const currency of PLAN_CURRENCIES) {
      expect(planPrice("free", currency, "monthly")).toBe(0);
      expect(planPrice("free", currency, "yearly")).toBe(0);
      expect(planPrice("group", currency, "monthly")).toBeNull();
    }
  });

  it("bills a year at ten months on every price", () => {
    expect(MONTHS_CHARGED_PER_YEAR).toBe(10);
    for (const plan of PLANS) {
      for (const [monthly, yearly] of Object.values(plan.prices ?? {})) {
        expect(yearly, plan.id).toBe(monthly * MONTHS_CHARGED_PER_YEAR);
      }
    }
  });

  it("carries the product's caps, trial, grace and AI allowances", () => {
    expect(TRIAL_DAYS).toBe(14);
    expect(GRACE_DAYS).toBe(7);
    const caps = Object.fromEntries(PLANS.map((p) => [p.id, p.limits]));
    expect(caps).toEqual({
      free: { branches: 1, staffPerBranch: 2, products: 30, ordersPerMonth: 300, storageMb: 100 },
      counter: { branches: null, staffPerBranch: 10, products: null, ordersPerMonth: null, storageMb: 2_048 },
      dining: { branches: null, staffPerBranch: 25, products: null, ordersPerMonth: null, storageMb: 5_120 },
      group: { branches: null, staffPerBranch: null, products: null, ordersPerMonth: null, storageMb: null },
    });
    expect(PLANS.map((p) => [p.id, p.trialDays, p.aiCreditsMonthly, p.aiTrialCredits])).toEqual([
      ["free", 0, 0, 10],
      ["counter", 14, 10, 10],
      ["dining", 14, 30, 10],
      ["group", 14, 300, 10],
    ]);
  });

  it("starts the currency switch on EGP in both languages", () => {
    expect(DEFAULT_CURRENCY).toEqual({ ar: "EGP", en: "EGP" });
  });

  it.each(locales)("%s: prints each plan's caps as the catalogue has them", (locale) => {
    const plans = getContent(locale).pricing.plans;
    const text = (id: PlanId) => plans.find((p) => p.id === id)!.limits.join("\n");
    // Free: 30 items, 300 sales, 100 MB, 10 credits once.
    for (const n of [30, 300, 100, 10]) expect(mentions(text("free"), n), `free ${n}`).toBe(true);
    // Paid: staff per branch, storage in GB, credits a month.
    for (const id of ["counter", "dining"] as const) {
      const n = planNumbers(id);
      expect(mentions(text(id), n.limits.staffPerBranch!), `${id} staff`).toBe(true);
      expect(mentions(text(id), n.limits.storageMb! / 1024), `${id} storage`).toBe(true);
      expect(mentions(text(id), n.aiCreditsMonthly), `${id} AI`).toBe(true);
    }
    expect(mentions(text("group"), planNumbers("group").aiCreditsMonthly)).toBe(true);
    // Free says it has caps; the paid plans keep "unlimited".
    expect(plans.find((p) => p.id === "free")!.excludes).toBeTruthy();
    expect(plans.filter((p) => p.featured).map((p) => p.id)).toEqual(["counter"]);
    expect(plans.find((p) => p.id === "group")!.priceLabel).toBeTruthy();
  });

  it.each(locales)("%s: lists no feature the product does not ship", (locale) => {
    const features = getContent(locale)
      .pricing.plans.flatMap((p) => p.features)
      .join("\n");
    // Loyalty is points only; campaigns and referrals are not built.
    expect(features).not.toMatch(/tiers|campaign|referral|مستويات|حملات|إحالة/i);
  });
});

describe("pricing: the offers", () => {
  const [launch, whiteFriday] = PLAN_OFFERS;

  it("are LAUNCH26 and White Friday on the product's terms", () => {
    expect(PLAN_OFFERS.map((o) => o.code)).toEqual([...OFFER_CODES]);
    expect(launch).toMatchObject({
      code: "LAUNCH26",
      monthlyPercentOff: 40,
      monthlyCycles: 3,
      yearlyPercentOff: 20,
      maxRedemptions: 500,
    });
    expect(whiteFriday).toMatchObject({
      code: "WHITEFRIDAY26",
      monthlyPercentOff: 0,
      yearlyPercentOff: 30,
      maxRedemptions: null,
    });
  });

  it("open and close on Cairo days", () => {
    // LAUNCH26: from today to 31 January 2027, 23:59:59 Cairo (UTC+2).
    expect(offerOpen(launch, at("2026-10-27T00:00:00Z"))).toBe(true);
    expect(offerOpen(launch, at("2026-10-26T23:59:59Z"))).toBe(false);
    expect(offerOpen(launch, at("2027-01-31T21:59:59Z"))).toBe(true);
    expect(offerOpen(launch, at("2027-01-31T22:00:00Z"))).toBe(false);
    // White Friday: 20–30 November 2026, Cairo.
    expect(offerOpen(whiteFriday, at("2026-11-19T21:59:59Z"))).toBe(false);
    expect(offerOpen(whiteFriday, at("2026-11-19T22:00:00Z"))).toBe(true);
    expect(offerOpen(whiteFriday, at("2026-11-30T21:59:59Z"))).toBe(true);
    expect(offerOpen(whiteFriday, at("2026-11-30T22:00:00Z"))).toBe(false);
    expect(openOffers(at("2027-02-15T12:00:00Z"))).toEqual([]);
  });

  it("put the one worth more on each card, never on Free or Group", () => {
    const launchOnly = at("2026-11-01T12:00:00Z");
    const both = at("2026-11-25T12:00:00Z");
    expect(openOffers(both).map((o) => o.code)).toEqual(["LAUNCH26", "WHITEFRIDAY26"]);
    expect(bestOffer("counter", "monthly", launchOnly)?.code).toBe("LAUNCH26");
    expect(bestOffer("counter", "yearly", launchOnly)?.code).toBe("LAUNCH26");
    // During White Friday its 30 % beats the launch 20 % on a year; a month keeps the launch 40 %.
    expect(bestOffer("dining", "yearly", both)?.code).toBe("WHITEFRIDAY26");
    expect(bestOffer("dining", "monthly", both)?.code).toBe("LAUNCH26");
    for (const id of ["free", "group"] as const) {
      expect(bestOffer(id, "monthly", both)).toBeNull();
      expect(bestOffer(id, "yearly", both)).toBeNull();
    }
    expect(bestOffer("counter", "yearly", at("2027-03-01T00:00:00Z"))).toBeNull();
  });

  it("discount to whole units, as the product rounds", () => {
    expect(discounted(799, 40)).toBe(479);
    expect(discounted(7_990, 20)).toBe(6_392);
    expect(discounted(7_990, 30)).toBe(5_593);
    expect(discounted(1_499, 40)).toBe(899);
    expect(discounted(149, 40)).toBe(89);
    expect(discounted(29, 40)).toBe(17);
    expect(discounted(590, 30)).toBe(413);
    expect(discounted(799, 0)).toBe(799);
  });

  it.each(locales)("%s: words every offer, with its own percents", (locale) => {
    const items = getContent(locale).pricing.offers.items;
    expect(items.map((i) => i.code)).toEqual([...OFFER_CODES]);
    const body = (code: string) => items.find((i) => i.code === code)!.body;
    for (const n of [launch.monthlyPercentOff, launch.monthlyCycles, launch.yearlyPercentOff, launch.maxRedemptions!]) {
      expect(mentions(body("LAUNCH26"), n), `LAUNCH26 ${n}`).toBe(true);
    }
    expect(mentions(body("WHITEFRIDAY26"), whiteFriday.yearlyPercentOff)).toBe(true);
  });
});

describe("pricing: AI credits", () => {
  /** SAR at 3.75 to the dollar, rounded up: the product's USD rule. */
  const usd = (sar: number) => Math.ceil(sar / 3.75);

  it("sells the product's tiers and packs", () => {
    expect(AI_TIERS.map((t) => [t.id, t.credits, t.price.SAR, t.price.EGP])).toEqual([
      ["lite", 25, 25, 369],
      ["basic", 100, 79, 1_179],
      ["plus", 300, 229, 3_399],
      ["pro", 800, 599, 8_929],
    ]);
    expect(AI_PACKS.map((p) => [p.credits, p.price.SAR, p.price.EGP])).toEqual([
      [100, 99, 1_499],
      [500, 449, 6_699],
      [2_000, 1_599, 23_899],
    ]);
    expect(AI_PACK_MONTHS).toBe(12);
    // Group's 300 a month is AI Plus.
    expect(planNumbers("group").aiCreditsMonthly).toBe(AI_TIERS.find((t) => t.id === "plus")!.credits);
  });

  it("prices AED as SAR and USD as SAR at 3.75, rounded up", () => {
    for (const { price } of [...AI_TIERS, ...AI_PACKS]) {
      expect(price.AED).toBe(price.SAR);
      expect(price.USD).toBe(usd(price.SAR));
    }
  });

  it.each(locales)("%s: names every tier, and the add-on quotes the cheapest", (locale) => {
    const c = getContent(locale).pricing;
    expect(c.ai.tiers.names.map((t) => t.id)).toEqual([...AI_TIER_IDS]);
    const assistant = c.addOns.items.find((a) => a.id === "assistant")!;
    const lite = AI_TIERS[0].price;
    expect(mentions(assistant.price, lite.EGP)).toBe(true);
    expect(mentions(assistant.price, lite.SAR)).toBe(true);
    expect(assistant.href).toBe("/pricing#ai-credits");
  });

  it("has the section the add-on links to", () => {
    const source = readFileSync(join(process.cwd(), "components/PricingAi.tsx"), "utf8");
    expect(source).toContain('id="ai-credits"');
  });
});

describe("pricing: every claim elsewhere on the site", () => {
  const counter = planPrice("counter", "EGP", "monthly")!;

  it.each(locales)("%s: quotes Counter at the catalogue's price", (locale) => {
    const c = getContent(locale);
    const claims: [string, string][] = [
      ["meta.pricing.title", c.meta.pricing.title],
      ["meta.pricing.description", c.meta.pricing.description],
      ["meta.foodicsAlternative.description", c.meta.foodicsAlternative.description],
      ["compare price row", String(c.compare.rows.find((r) => /per branch per month|للفرع شهرياً/.test(r.label))?.us ?? "")],
      ["roi.tips.cost", c.roi.tips.cost],
      ["pricing.marketAnchor ours", c.pricing.marketAnchor.rows.find((r) => r.ours)!.price],
      ["foodicsAlternative ours", c.foodicsAlternative.facts.rows.find((r) => r.ours)!.value],
    ];
    for (const [label, text] of claims) {
      expect(text, label).not.toBe("");
      expect(text.includes(formatNumber(locale, counter)) || mentions(text, counter), label).toBe(true);
    }
  });

  it.each(locales)("%s: a day's price on the hero is true of a yearly Counter branch", (locale) => {
    const sub = getContent(locale).hero.sub;
    const yearly = planPrice("counter", "EGP", "yearly")!;
    expect(mentions(sub, 22)).toBe(true);
    expect(yearly / 365).toBeLessThan(22);
  });

  it.each(locales)("%s: keeps no retired price or offer", (locale) => {
    const { legal, ...site } = getContent(locale);
    const text = JSON.stringify(site);
    expect(plain(text)).not.toMatch(/(^|\D)199(\D|$)/);
    expect(text).not.toMatch(/Save 30%|وفّر ٣٠٪|founding|التأسيس|first 50 restaurants|أول ٥٠ مطعم/i);
    // The terms keep one sentence for restaurants already on the founding price.
    expect(plain(JSON.stringify(legal))).not.toMatch(/(^|\D)199(\D|$)/);
  });

  it("marks up the four plans in EGP, from 0 to Dining room's price", () => {
    for (const locale of locales) {
      const offers = softwareApplicationJsonLd(locale).offers as Record<string, unknown>;
      expect(offers).toMatchObject({
        "@type": "AggregateOffer",
        priceCurrency: "EGP",
        lowPrice: 0,
        highPrice: 1_499,
        offerCount: 4,
      });
    }
  });
});

describe("pricing: add-ons", () => {
  it("names the same add-ons in both languages, each with a price label", () => {
    const [ar, en] = locales.map((l) => getContent(l).pricing.addOns.items);
    expect(ar.map((a) => a.id)).toEqual(en.map((a) => a.id));
    for (const item of [...ar, ...en]) expect(item.price.trim()).not.toBe("");
  });

  it("links an add-on only to a page that exists", () => {
    const paths = new Set(routes.map((r) => r.path));
    for (const locale of locales) {
      for (const item of getContent(locale).pricing.addOns.items) {
        if (item.href) expect(paths).toContain(item.href.split("#")[0]);
      }
    }
  });
});
