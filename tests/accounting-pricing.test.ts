import { describe, expect, it } from "vitest";
import { getContent } from "@/content";
import {
  ACCOUNTING_CARD_IDS,
  ACCOUNTING_EXTRAS,
  ACCOUNTING_FEATURES,
  ACCOUNTING_GRACE_DAYS,
  ACCOUNTING_PLANS,
  ACCOUNTING_PLAN_IDS,
  ACCOUNTING_TRIAL_DAYS,
  AI_TRIAL_CREDIT_DAYS,
  EINVOICING_SYSTEM,
  accountingFromPrice,
  accountingPlan,
  accountingPrice,
  bestAccountingOffer,
  type AccountingCardId,
} from "@/lib/accounting-plans";
import { foldDigits } from "@/lib/format";
import { llmsTxt } from "@/lib/llms";
import {
  AI_PACKS,
  MONTHS_CHARGED_PER_YEAR,
  PLAN_CURRENCIES,
  PLAN_OFFERS,
  bestOffer,
  discounted,
  type PlanCurrency,
} from "@/lib/plans";

/*
 * /accounting-trial sells what the accounting app enforces.
 *
 * THESE NUMBERS MUST MATCH bohub-pos `accounting-app/lib/plans.ts` (the five
 * plans, their per-company prices per currency, caps, AI allowances, extras
 * and the two offers; decision
 * docs/decisions/2026-10-27-accounting-plans-prices-and-limits.md, plan
 * docs/plans/2026-10-27-accounting-plans-and-prices.md §0). The product's
 * file is in minor units; these are whole units. Change a price there first,
 * then `lib/accounting-plans.ts` and the table below in the same pull request
 * — the product's own tests and the moving-accounting landing pin the same
 * figures, so a drift on any side fails a test.
 *
 * History: 2026-10-13 to 2026-10-27 the page sold Starter 499, Business 999
 * and Professional 1,999 EGP (SAR 119 / 229 / 349, unchanged), with an
 * "Accounting with Moving POS" add-on at EGP 299 / SAR 79 a POS branch. The
 * cost model showed the Egyptian prices missing five margin floors once the
 * included onboarding and monthly support are counted, and the add-on a
 * whole accounting system for 299; a POS restaurant now takes the plan that
 * fits, with the POS link included.
 */

const locales = ["ar", "en"] as const;

/** Per-company [monthly, yearly], whole units, VAT excluded — bohub-pos plans.ts ÷ 100. */
const PRICES: Record<"starter" | "business" | "professional", Record<PlanCurrency, [number, number]>> = {
  starter: { EGP: [699, 6_990], SAR: [119, 1_190], AED: [119, 1_190], USD: [29, 290] },
  business: { EGP: [1_199, 11_990], SAR: [229, 2_290], AED: [229, 2_290], USD: [59, 590] },
  professional: { EGP: [2_199, 21_990], SAR: [349, 3_490], AED: [349, 3_490], USD: [89, 890] },
};
const PAID = ["starter", "business", "professional"] as const;

/** Digits as ASCII and thousands separators gone, so "٢٬٠٠٠" reads as "2000". */
const plain = (s: string) => foldDigits(s).replace(/[,٬]/g, "");
/** True when `n` appears in `s` as a whole number. */
const mentions = (s: string, n: number) => new RegExp(`(^|\\D)${n}(\\D|$)`).test(plain(s));
/** `mentions`, but "one" may be a word: Arabic counts one as "واحد" / "واحدة", after the noun. */
const says = (s: string, n: number) => mentions(s, n) || (n === 1 && /واحدة?(\s|،|$)/.test(s));

const at = (iso: string) => Date.parse(iso);

describe("accounting pricing: the plans", () => {
  it("are the product's five, in order, with a card for each but Enterprise", () => {
    expect(ACCOUNTING_PLAN_IDS).toEqual(["free", "starter", "business", "professional", "enterprise"]);
    expect(ACCOUNTING_PLANS.map((p) => p.id)).toEqual([...ACCOUNTING_PLAN_IDS]);
    expect(ACCOUNTING_CARD_IDS).toEqual(["free", "starter", "business", "professional"]);
    for (const locale of locales) {
      const plans = getContent(locale).accountingTrial.pricing.plans;
      expect(plans.map((p) => p.id), locale).toEqual([...ACCOUNTING_CARD_IDS]);
    }
  });

  it("are priced per company in EGP, SAR, AED and USD at the product's prices", () => {
    for (const id of PAID) {
      for (const currency of PLAN_CURRENCIES) {
        expect(accountingPlan(id).prices?.[currency], `${id} ${currency}`).toEqual(PRICES[id][currency]);
      }
    }
    for (const currency of PLAN_CURRENCIES) {
      expect(accountingPrice("free", currency, "monthly")).toBe(0);
      expect(accountingPrice("free", currency, "yearly")).toBe(0);
      expect(accountingPrice("enterprise", currency, "monthly")).toBeNull();
    }
    expect(accountingFromPrice("EGP")).toBe(699);
    expect(accountingFromPrice("SAR")).toBe(119);
  });

  it("bills a year at ten months on every price", () => {
    for (const plan of ACCOUNTING_PLANS) {
      for (const [monthly, yearly] of Object.values(plan.prices ?? {})) {
        expect(yearly, plan.id).toBe(monthly * MONTHS_CHARGED_PER_YEAR);
      }
    }
  });

  it("carries the product's caps, features, trial and AI allowances", () => {
    expect(ACCOUNTING_TRIAL_DAYS).toBe(14);
    expect(ACCOUNTING_GRACE_DAYS).toBe(7);
    expect(AI_TRIAL_CREDIT_DAYS).toBe(30);
    const unlimited = { invoicesPerMonth: null, entriesPerMonth: null, contacts: null };
    expect(Object.fromEntries(ACCOUNTING_PLANS.map((p) => [p.id, p.limits]))).toEqual({
      free: {
        users: 1,
        branches: 1,
        einvoiceUnits: 0,
        billCapturesPerMonth: 0,
        storageMb: 100,
        invoicesPerMonth: 20,
        entriesPerMonth: 50,
        contacts: 25,
      },
      starter: { users: 3, branches: 1, einvoiceUnits: 1, billCapturesPerMonth: 50, storageMb: 1_024, ...unlimited },
      business: { users: 8, branches: 3, einvoiceUnits: 3, billCapturesPerMonth: 200, storageMb: 5_120, ...unlimited },
      professional: { users: 15, branches: 10, einvoiceUnits: 10, billCapturesPerMonth: 500, storageMb: 10_240, ...unlimited },
      enterprise: {
        users: null,
        branches: null,
        einvoiceUnits: null,
        billCapturesPerMonth: null,
        storageMb: null,
        ...unlimited,
      },
    });
    expect(ACCOUNTING_PLANS.map((p) => [p.id, p.trialDays, p.aiCreditsMonthly, p.aiTrialCredits])).toEqual([
      ["free", 0, 0, 10],
      ["starter", 14, 5, 10],
      ["business", 14, 10, 10],
      ["professional", 14, 25, 10],
      ["enterprise", 14, 25, 10],
    ]);
    // Free has no bank import, POS connector or API; every paid plan has all three.
    expect(ACCOUNTING_FEATURES).toEqual(["bankImport", "posConnector", "api"]);
    expect(accountingPlan("free").features).toEqual([]);
    for (const id of [...PAID, "enterprise"] as const) {
      expect(accountingPlan(id).features).toEqual([...ACCOUNTING_FEATURES]);
    }
  });

  it("sells the product's extras: a user, and a branch with its unit", () => {
    expect(ACCOUNTING_EXTRAS).toEqual({
      user: { EGP: 99, SAR: 25, AED: 25, USD: 7 },
      branch: { EGP: 249, SAR: 49, AED: 49, USD: 13 },
    });
  });

  it("names ETA on the EGP list, ZATCA on the SAR list and either on AED and USD", () => {
    expect(EINVOICING_SYSTEM).toEqual({ EGP: "eta", SAR: "zatca", AED: "either", USD: "either" });
  });
});

describe("accounting pricing: the offers", () => {
  it("are the POS offers, on the paid plans only", () => {
    const launchOnly = at("2026-11-01T12:00:00Z");
    const both = at("2026-11-25T12:00:00Z");
    for (const now of [launchOnly, both, at("2027-03-01T00:00:00Z")]) {
      for (const interval of ["monthly", "yearly"] as const) {
        for (const id of PAID) {
          expect(bestAccountingOffer(id, interval, now), `${id} ${interval}`).toBe(
            bestOffer("counter", interval, now),
          );
        }
        expect(bestAccountingOffer("free", interval, now)).toBeNull();
        expect(bestAccountingOffer("enterprise", interval, now)).toBeNull();
      }
    }
    expect(bestAccountingOffer("business", "yearly", both)?.code).toBe("WHITEFRIDAY26");
    expect(bestAccountingOffer("business", "monthly", both)?.code).toBe("LAUNCH26");
  });

  it("come to the plan's own examples (plan §0)", () => {
    const [launch, whiteFriday] = PLAN_OFFERS;
    const first = (id: (typeof PAID)[number]) => ({
      launchMonthly: discounted(PRICES[id].EGP[0], launch.monthlyPercentOff),
      launchYearly: discounted(PRICES[id].EGP[1], launch.yearlyPercentOff),
      whiteFridayYearly: discounted(PRICES[id].EGP[1], whiteFriday.yearlyPercentOff),
    });
    expect(first("starter")).toEqual({ launchMonthly: 419, launchYearly: 5_592, whiteFridayYearly: 4_893 });
    expect(first("business")).toEqual({ launchMonthly: 719, launchYearly: 9_592, whiteFridayYearly: 8_393 });
    expect(first("professional")).toEqual({ launchMonthly: 1_319, launchYearly: 17_592, whiteFridayYearly: 15_393 });
  });
});

describe("accounting pricing: the copy", () => {
  it.each(locales)("%s: prints each card's caps as the catalogue has them", (locale) => {
    const plans = getContent(locale).accountingTrial.pricing.plans;
    const card = (id: AccountingCardId) => plans.find((p) => p.id === id)!;
    const text = (id: AccountingCardId) => card(id).limits.join("\n");
    // Free: 1 user, 20 invoices, 50 entries, 25 contacts, 100 MB, 10 credits for 30 days.
    for (const n of [1, 20, 50, 25, 100, 10, AI_TRIAL_CREDIT_DAYS]) {
      expect(says(text("free"), n), `free ${n}`).toBe(true);
    }
    for (const id of PAID) {
      const { limits, aiCreditsMonthly } = accountingPlan(id);
      expect(says(text(id), limits.users!), `${id} users`).toBe(true);
      expect(says(text(id), limits.branches!), `${id} branches`).toBe(true);
      expect(says(text(id), limits.billCapturesPerMonth!), `${id} captures`).toBe(true);
      expect(says(text(id), limits.storageMb! / 1024), `${id} storage`).toBe(true);
      expect(says(text(id), aiCreditsMonthly), `${id} AI`).toBe(true);
      // The e-invoicing line, in each system, says how many units.
      const units = limits.einvoiceUnits!;
      for (const line of Object.values(card(id).einvoicing!)) {
        expect(says(line, units), `${id}: ${line}`).toBe(true);
      }
      expect(card(id).excludes, id).toBeUndefined();
    }
    expect(card("free").einvoicing).toBeUndefined();
    expect(card("free").excludes).toBeTruthy();
    // The trial runs on Business (bohub-pos TRIAL_PLAN_ID), so it is the one recommended.
    expect(plans.filter((p) => p.featured).map((p) => p.id)).toEqual(["business"]);
  });

  it.each(locales)("%s: words VAT for every price list, and the rates of Egypt and Saudi Arabia", (locale) => {
    const { vat } = getContent(locale).accountingTrial.pricing;
    expect(Object.keys(vat)).toEqual([...PLAN_CURRENCIES]);
    expect(mentions(vat.EGP, 14)).toBe(true);
    expect(mentions(vat.SAR, 15)).toBe(true);
  });

  it.each(locales)("%s: says what a trial drops to, and for how long the books stay", (locale) => {
    const { faq, pricing } = getContent(locale).accountingTrial;
    const answers = faq.items.map((i) => i.a).join("\n");
    expect(mentions(answers, ACCOUNTING_GRACE_DAYS)).toBe(true);
    // The first card is Free; its name is in the answer.
    expect(answers).toContain(pricing.plans[0].name);
  });

  it.each(locales)("%s: Free's one-time credits say they last 30 days", (locale) => {
    const { ai } = getContent(locale).accountingTrial.pricing;
    expect(mentions(ai.included.once, AI_TRIAL_CREDIT_DAYS)).toBe(true);
  });
});

describe("accounting pricing: AI credit packs", () => {
  it("are the shared packs, at the shared prices", () => {
    expect(AI_PACKS.map((p) => [p.credits, p.price.EGP, p.price.SAR, p.price.AED, p.price.USD])).toEqual([
      [100, 1_499, 99, 99, 27],
      [500, 6_699, 449, 449, 120],
      [2_000, 23_899, 1_599, 1_599, 427],
    ]);
  });
});

describe("accounting pricing: every claim elsewhere on the site", () => {
  it.each(locales)("%s: keeps no retired price, and no add-on per POS branch", (locale) => {
    const { legal, ...site } = getContent(locale);
    void legal;
    const trial = plain(JSON.stringify(site.accountingTrial));
    for (const retired of [499, 999, 1999, 299, 79]) {
      expect(trial, `accountingTrial ${retired}`).not.toMatch(new RegExp(`(^|\\D)${retired}(\\D|$)`));
    }
    expect(site.accountingTrial.pricing.withPos).not.toHaveProperty("price");
    expect(JSON.stringify(site)).not.toMatch(/accounting add-on|Add accounting for|إضافة المحاسبة|أضف المحاسبة/i);
  });

  it("tells assistants reading llms.txt the accounting plan is per company, from its cheapest price", () => {
    const text = llmsTxt();
    expect(text).toContain(`from EGP ${accountingFromPrice("EGP")} or SAR ${accountingFromPrice("SAR")} a month`);
    expect(text).toMatch(/priced per company, not per branch/);
  });

  it.each(locales)("%s: the /pricing add-on quotes the cheapest paid plan in EGP and SAR", (locale) => {
    const accounting = getContent(locale).pricing.addOns.items.find((a) => a.id === "accounting")!;
    expect(mentions(accounting.price, accountingFromPrice("EGP"))).toBe(true);
    expect(mentions(accounting.price, accountingFromPrice("SAR"))).toBe(true);
    expect(accounting.href).toBe("/accounting-trial");
  });
});
