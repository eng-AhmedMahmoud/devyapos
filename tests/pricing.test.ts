import { describe, expect, it } from "vitest";
import { getContent } from "@/content";
import { routes } from "@/lib/routes";

/*
 * The pricing page sells what the product sells. The packages and their
 * prices are decided in the product (`devya-pos:ops-app/lib/plans.ts`, priced
 * by the owner on 2026-09-19): Counter 199, Dining room 499, Group quoted.
 * Until 2026-10-22 this site still sold the retired Growth / Scale /
 * Enterprise ladder, with features the product does not ship (loyalty tiers,
 * campaigns). A change here that drifts from the product should fail.
 */

const locales = ["ar", "en"] as const;

describe("pricing", () => {
  it.each(locales)("%s: offers the product's three packages at its prices", (locale) => {
    const plans = getContent(locale).pricing.plans;
    expect(plans.map((p) => p.id)).toEqual(["counter", "dining", "group"]);
    expect(plans.map((p) => p.price)).toEqual([199, 499, null]);
  });

  it.each(locales)("%s: lists no feature the product does not ship", (locale) => {
    const features = getContent(locale)
      .pricing.plans.flatMap((p) => p.features)
      .join("\n");
    // Loyalty is points only; campaigns and referrals are not built.
    expect(features).not.toMatch(/tiers|campaign|referral|مستويات|حملات|إحالة/i);
  });

  it("names the same add-ons in both languages, each with a price label", () => {
    const [ar, en] = locales.map((l) => getContent(l).pricing.addOns.items);
    expect(ar.map((a) => a.id)).toEqual(en.map((a) => a.id));
    for (const item of [...ar, ...en]) expect(item.price.trim()).not.toBe("");
  });

  it("links an add-on only to a page that exists", () => {
    const paths = new Set(routes.map((r) => r.path));
    for (const locale of locales) {
      for (const item of getContent(locale).pricing.addOns.items) {
        if (item.href) expect(paths).toContain(item.href);
      }
    }
  });
});
