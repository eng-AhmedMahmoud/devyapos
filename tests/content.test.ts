import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ar } from "@/content/ar";
import { en } from "@/content/en";
import { brand, brandName } from "@/lib/brand";

/**
 * The two content trees and the product's name. `content/types.ts` already
 * makes the trees the same shape at compile time; it cannot see list lengths,
 * and it cannot see a product name that was renamed in one language only.
 */

/** Every leaf path with its list lengths, e.g. `faq.items[3].q`. */
function shape(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) {
    return [`${path}[]=${value.length}`, ...value.flatMap((v, i) => shape(v, `${path}[${i}]`))];
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => shape(v, path ? `${path}.${k}` : k));
  }
  return [path];
}

/** Every leaf with its path, e.g. `["faq.items[3].q", "…"]`. */
function leaves(value: unknown, path = ""): [string, unknown][] {
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  }
  return [[path, value]];
}

/** Every string in a tree, flattened. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

/* Names the product carried before: DevyaPOS until 18 October 2026, Drinki POS
   until 19 October 2026. Identifiers keep `devyapos`, so only the spaced and
   cased forms people read are banned. */
const RETIRED = [/drinki/i, /دري?نكي/, /DevyaPOS/, /Devya POS/];

describe("content", () => {
  it("has the same keys and list lengths in Arabic and English", () => {
    expect(shape(ar)).toEqual(shape(en));
  });

  it("names the product in each page's own language", () => {
    expect(brandName("ar")).toBe("موفينج POS");
    expect(brandName("en")).toBe("Moving POS");
    expect(strings(ar).join("\n")).toContain(brand.name.ar);
    expect(strings(en).join("\n")).toContain(brand.name.en);
    // Arabic copy sets the Arabic family name; the Latin one stays on English pages.
    expect(strings(ar).some((s) => s.includes(brand.name.en))).toBe(false);
  });

  it("puts the product's name in every page title", () => {
    for (const [locale, c] of [["ar", ar], ["en", en]] as const) {
      for (const [key, meta] of Object.entries(c.meta)) {
        expect(meta.title, `${locale} meta.${key}`).toContain(brandName(locale));
      }
    }
  });

  it("never prints a retired product name", () => {
    for (const s of [...strings(ar), ...strings(en)]) {
      for (const name of RETIRED) expect(s).not.toMatch(name);
    }
  });
});

/*
 * The Foodics figures on /pricing and /foodics-alternative are our own dated
 * record. Foodics publishes no prices (docs/social-launch-plan.md §1.5), so
 * calling them published is a claim nobody can back, and an undated or stale
 * competitor price is the kind of thing that earns a lawyer's letter (§2.4).
 */
describe("competitor figures", () => {
  const MAX_AGE_DAYS = 90;
  const DAY_MS = 24 * 60 * 60 * 1000;
  const trees = [["ar", ar], ["en", en]] as const;

  /** The blocks that state or lean on the Foodics figures. */
  const claims = (c: typeof en) => ({
    "meta.foodicsAlternative": c.meta.foodicsAlternative,
    "pricing.marketAnchor": c.pricing.marketAnchor,
    foodicsAlternative: c.foodicsAlternative,
  });

  it("dates every comparison with a real retrievedAt under 90 days old", () => {
    const today = Date.parse(new Date().toISOString().slice(0, 10));
    for (const [locale, c] of trees) {
      const dates = leaves(c).filter(([path]) => /(^|\.)retrievedAt$/.test(path));
      // Both comparisons carry one, so the check below cannot pass on nothing.
      expect(dates.map(([path]) => path), locale).toEqual(
        expect.arrayContaining([
          "pricing.marketAnchor.retrievedAt",
          "foodicsAlternative.facts.retrievedAt",
        ]),
      );
      for (const [path, value] of dates) {
        const label = `${locale} ${path} = ${String(value)}`;
        expect(value, label).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        const at = Date.parse(value as string);
        // A real calendar day: 2026-02-30 parses to NaN or round-trips to another day.
        expect(new Date(at).toISOString().slice(0, 10), label).toBe(value);
        const age = (today - at) / DAY_MS;
        expect(age, `${label} is in the future`).toBeGreaterThanOrEqual(0);
        expect(
          age,
          `${label} is ${age} days old: re-check the competitor's price, update the figures and the date`,
        ).toBeLessThanOrEqual(MAX_AGE_DAYS);
      }
    }
    expect(ar.pricing.marketAnchor.retrievedAt).toBe(en.pricing.marketAnchor.retrievedAt);
    expect(ar.foodicsAlternative.facts.retrievedAt).toBe(en.foodicsAlternative.facts.retrievedAt);
  });

  it("renders the date from retrievedAt instead of typing it into the copy", () => {
    const MONTH =
      /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b|يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر/;
    const placeholders = (c: typeof en) =>
      leaves(claims(c))
        .filter(([, v]) => typeof v === "string" && v.includes("{date}"))
        .map(([path]) => path);

    for (const [locale, c] of trees) {
      expect(placeholders(c), locale).toEqual([
        "pricing.marketAnchor.sub",
        "foodicsAlternative.disclaimer",
        "foodicsAlternative.facts.sub",
        "foodicsAlternative.facts.source",
      ]);
      for (const [path, v] of leaves(claims(c))) {
        if (typeof v === "string") expect(v, `${locale} ${path}`).not.toMatch(MONTH);
      }
    }
  });

  it("never calls the Foodics figures published", () => {
    const PUBLISHED = /publish|منشور|معلن|تنشر/i;
    const THEM = /foodics|فودكس|competitor|المنافس/i;
    for (const [locale, c] of trees) {
      for (const [path, v] of leaves(claims(c))) {
        if (typeof v !== "string") continue;
        for (const sentence of v.split(/(?<=[.!?؟])\s+/)) {
          if (!PUBLISHED.test(sentence)) continue;
          // Only a sentence about our own prices may say "published".
          const ours = sentence.includes(brandName(locale)) && !THEM.test(sentence);
          expect(ours, `${locale} ${path}: "${sentence}"`).toBe(true);
        }
      }
    }
  });
});

describe("brand assets", () => {
  const files = [
    "app/icon.svg",
    ...readdirSync(join(process.cwd(), "public/brand"))
      .filter((f) => f.endsWith(".svg"))
      .map((f) => `public/brand/${f}`),
  ];

  it.each(files)("%s is the Moving mark, titled Moving POS", (file) => {
    const svg = readFileSync(join(process.cwd(), file), "utf8");
    expect(svg).toMatch(/<title>Moving POS[^<]*<\/title>/);
    expect(svg).toContain('d="M24 8H56V40H16V56H8V32H24Z M32 16V32H48V16Z"');
    for (const name of RETIRED) expect(svg).not.toMatch(name);
  });
});
