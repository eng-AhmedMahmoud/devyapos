import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MarketsNote from "@/components/MarketsNote";
import { getContent } from "@/content";
import { ACCOUNTING_EXTRAS, ACCOUNTING_PLANS, EINVOICING_SYSTEM } from "@/lib/accounting-plans";
import { SERVED_COUNTRIES } from "@/lib/jsonld";
import { llmsTxt } from "@/lib/llms";
import { AI_PACKS, AI_TIERS, PLANS, PLAN_CURRENCIES } from "@/lib/plans";

/*
 * Only Saudi Arabia and Egypt are live. The UAE, Qatar, Kuwait, Bahrain and
 * Oman are planned, and so is the Global (USD) list: the site may name them as
 * "coming soon", never price them or let a visitor pick one. Their lists are
 * commented out as PLANNED in lib/plans.ts and lib/accounting-plans.ts; the
 * platform's catalogue is bohub-pos `packages/shared/src/markets.ts`.
 */

const locales = ["ar", "en"] as const;
const LIVE = ["EGP", "SAR"];

/** The planned markets by name, in each language, as `pricing.markets.planned` says them. */
const PLANNED_NAMES = {
  en: ["UAE", "Qatar", "Kuwait", "Bahrain", "Oman"],
  ar: ["الإمارات", "قطر", "الكويت", "البحرين", "عُمان"],
} as const;

/** A planned market or its currency, anywhere in a text: words, codes and units. */
const PLANNED_ANYWHERE =
  /\b(AED|USD|QAR|KWD|BHD|OMR|UAE|Emirates|Qatar|Kuwait|Bahrain|Oman|dirhams?|dollars?)\b|الإمارات|الكويت|البحرين|عُمان|درهم|دولار|د\.إ/i;

describe("markets: Egypt and Saudi Arabia are live", () => {
  it("has a price list for the live markets only", () => {
    expect(PLAN_CURRENCIES).toEqual(LIVE);
    const lists = [
      ...PLANS.flatMap((p) => (p.prices ? [p.prices] : [])),
      ...ACCOUNTING_PLANS.flatMap((p) => (p.prices ? [p.prices] : [])),
      ...[...AI_TIERS, ...AI_PACKS].map((t) => t.price),
      ACCOUNTING_EXTRAS.user,
      ACCOUNTING_EXTRAS.branch,
      EINVOICING_SYSTEM,
    ];
    for (const list of lists) expect(Object.keys(list)).toEqual(LIVE);
  });

  it.each(locales)("%s: names and prints a unit for the live lists only", (locale) => {
    const { pricing, accountingTrial } = getContent(locale);
    expect(Object.keys(pricing.currencyNames)).toEqual(LIVE);
    expect(Object.keys(pricing.currencies)).toEqual(LIVE);
    expect(Object.keys(accountingTrial.pricing.vat)).toEqual(LIVE);
    for (const plan of accountingTrial.pricing.plans) {
      if (plan.einvoicing) expect(Object.keys(plan.einvoicing), plan.id).toEqual(["eta", "zatca"]);
    }
    expect(Object.keys(accountingTrial.pricing.einvoicingIncluded)).toEqual(["eta", "zatca"]);
  });

  it.each(locales)("%s: says which markets are live", (locale) => {
    const { live } = getContent(locale).pricing.markets;
    const [egypt, saudi] = locale === "ar" ? ["مصر", "السعودية"] : ["Egypt", "Saudi Arabia"];
    expect(live).toContain(egypt);
    expect(live).toContain(saudi);
  });

  it("serves only the live markets in the structured data", () => {
    expect(SERVED_COUNTRIES.map((c) => c.code)).toEqual(["EG", "SA"]);
  });
});

describe("markets: the rest are planned, shown only as coming soon", () => {
  it.each(locales)("%s: names every planned market behind the coming-soon badge", (locale) => {
    const { soon, planned } = getContent(locale).pricing.markets;
    expect(soon).toBe(locale === "ar" ? "قريبًا" : "Coming soon");
    for (const name of PLANNED_NAMES[locale]) expect(planned, name).toContain(name);
  });

  it.each(locales)("%s: prices no planned market anywhere else in the copy", (locale) => {
    const c = getContent(locale);
    // Everything but the coming-soon line itself. (The Foodics page's "Riyadh
    // or Dubai" is about the competitor's reach, and names no market here.)
    const rest = {
      ...c,
      pricing: { ...c.pricing, markets: { ...c.pricing.markets, planned: "" } },
    };
    expect(JSON.stringify(rest)).not.toMatch(PLANNED_ANYWHERE);
  });

  it.each(locales)("%s: renders the planned markets as plain text, nothing to pick", (locale) => {
    const copy = getContent(locale).pricing.markets;
    const html = renderToStaticMarkup(createElement(MarketsNote, { copy }));
    expect(html).toContain(copy.live);
    expect(html).toContain(copy.soon);
    expect(html).toContain(copy.planned);
    expect(html).not.toMatch(/<(button|input|select|option|a)\b/);
  });

  it("sits under the currency switch of both price lists", () => {
    for (const file of ["components/Pricing.tsx", "components/AccountingPricing.tsx"]) {
      expect(readFileSync(join(process.cwd(), file), "utf8"), file).toContain("<MarketsNote");
    }
  });

  it("tells assistants reading llms.txt the live markets, and the planned ones as coming", () => {
    const text = llmsTxt();
    expect(text).toContain("for Egypt and Saudi Arabia, priced per branch in EGP and SAR");
    expect(text).toContain(`Coming soon: ${getContent("en").pricing.markets.planned}.`);
    const withoutComingSoon = text.replace(`Coming soon: ${getContent("en").pricing.markets.planned}.`, "");
    expect(withoutComingSoon).not.toMatch(/\b(AED|USD|QAR|KWD|BHD|OMR)\b/);
  });
});
