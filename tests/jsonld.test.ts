import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import JsonLd from "@/components/JsonLd";
import { getContent } from "@/content";
import { brand } from "@/lib/brand";
import {
  APP_ID,
  APP_PATHS,
  CURRENCY_COUNTRY,
  FAQ_PATHS,
  ORG_ID,
  PARENT_ID,
  PRODUCT_ID,
  PRODUCT_PATHS,
  WEBSITE_ID,
  type JsonLdNode,
  breadcrumbJsonLd,
  organizationJsonLd,
  pageJsonLd,
  productJsonLd,
  siteJsonLd,
  softwareApplicationJsonLd,
} from "@/lib/jsonld";
import { DOCS_BASE, docsPaths } from "@/lib/docs";
import { articlePageJsonLd, docsPageJsonLd } from "@/lib/docs/jsonld";
import { NOINDEX_PATHS, routes } from "@/lib/meta";
import { PLAN_CURRENCIES, planPrice, type PlanCurrency } from "@/lib/plans";

/**
 * The structured data, as search engines and assistants read it. The graph
 * is generated from the content tree, so these tests pin its shape: which
 * nodes exist where, the identities other sites link to, and the claims it
 * is allowed to make.
 */

const LOCALES = ["ar", "en"] as const;
const PATHS = [...routes.map((r) => r.path), ...NOINDEX_PATHS];

/** The movingsystems.tech umbrella site links to this exact @id. */
const STABLE_APP_ID = "https://pos.movingsystems.tech/#software";

/** Loyalty is points only: no tiers, levels or referrals in any markup. */
const UNSHIPPED = /\btiers?\b|\blevels?\b|referr|bring friends|مستويات|مستوى الولاء|إحالة|أصدقاء/i;

/** Every value in a tree, with the key it sits under. */
function entries(value: unknown, key = ""): [string, unknown][] {
  if (Array.isArray(value)) return value.flatMap((v) => entries(v, key));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => entries(v, k));
  }
  return [[key, value]];
}

function ofType(nodes: JsonLdNode[], type: string) {
  return nodes.filter((n) => n["@type"] === type);
}

/** Width and height from a PNG's IHDR chunk. */
function pngSize(file: string) {
  const buf = readFileSync(file);
  expect(buf.subarray(1, 4).toString("latin1"), file).toBe("PNG");
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

describe("site-wide graph (siteJsonLd)", () => {
  it.each(LOCALES)("%s: one Organization and one WebSite, nothing else", (locale) => {
    const nodes = siteJsonLd(locale);
    expect(nodes.map((n) => n["@type"]).sort()).toEqual(["Organization", "WebSite"]);
    expect(nodes.map((n) => n["@id"])).toEqual([ORG_ID, WEBSITE_ID]);
  });

  it.each(LOCALES)("%s: the Organization names Devya Solutions as its parent, by devya.dev's @id", (locale) => {
    expect(organizationJsonLd(locale).parentOrganization).toEqual({
      "@type": "Organization",
      "@id": "https://devya.dev/#organization",
      name: "Devya Solutions",
      url: "https://devya.dev",
    });
    expect(PARENT_ID).toBe("https://devya.dev/#organization");
  });

  it.each(LOCALES)("%s: the logo is a PNG of at least 112 px on this host, at its real size", (locale) => {
    const logo = organizationJsonLd(locale).logo as Record<string, unknown>;
    expect(logo["@type"]).toBe("ImageObject");
    expect(logo.url).toBe(logo.contentUrl);
    const url = String(logo.url);
    expect(url.startsWith(`${brand.url}/`)).toBe(true);
    expect(url).toMatch(/\.png$/);

    const file = join(process.cwd(), "public", new URL(url).pathname);
    const size = pngSize(file);
    expect(size).toEqual({ width: logo.width, height: logo.height });
    expect(size.width).toBeGreaterThanOrEqual(112);
  });

  it.each(LOCALES)("%s: serves the countries the site prices in, by name, and its sales line serves the same", (locale) => {
    const org = organizationJsonLd(locale);
    expect(org.areaServed).toEqual([
      { "@type": "Country", name: "Egypt" },
      { "@type": "Country", name: "Saudi Arabia" },
      { "@type": "Country", name: "United Arab Emirates" },
    ]);
    const [sales] = org.contactPoint as { areaServed: unknown }[];
    expect(sales.areaServed).toEqual(["EG", "SA", "AE"]);
  });

  it("places every currency the switch shows: a country, or none for USD (everywhere else)", () => {
    expect(Object.keys(CURRENCY_COUNTRY).sort()).toEqual([...PLAN_CURRENCIES].sort());
    expect(CURRENCY_COUNTRY.USD).toBeNull();
    // The mapping is the one the pricing note prints, in both languages.
    expect(getContent("en").pricing.note).toMatch(/EGP for Egypt, SAR for Saudi Arabia, AED for the UAE and USD everywhere else/);
    expect(getContent("ar").pricing.note).toMatch(/بالجنيه في مصر، وبالريال في السعودية، وبالدرهم في الإمارات، وبالدولار في باقي الدول/);
  });

  it.each(LOCALES)("%s: the WebSite is the origin, in both languages, published by the Organization", (locale) => {
    const [site] = ofType(siteJsonLd(locale), "WebSite");
    expect(site).toMatchObject({
      "@id": `${brand.url}/#website`,
      url: brand.url,
      inLanguage: ["ar", "en"],
      publisher: { "@id": ORG_ID },
    });
  });
});

describe("SoftwareApplication", () => {
  it("keeps the @id other Moving sites link to", () => {
    expect(APP_ID).toBe(STABLE_APP_ID);
    for (const locale of LOCALES) {
      expect(softwareApplicationJsonLd(locale)["@id"]).toBe(STABLE_APP_ID);
    }
  });

  it("is on the pages that show the product and its prices, and nowhere else", () => {
    expect([...APP_PATHS].sort()).toEqual(["", "/compare", "/features", "/pricing"]);
    for (const locale of LOCALES) {
      expect(ofType(siteJsonLd(locale), "SoftwareApplication")).toEqual([]);
      for (const path of PATHS) {
        const apps = ofType(pageJsonLd(locale, path), "SoftwareApplication");
        expect(apps.length, `${locale} ${path || "/"}`).toBe(
          (APP_PATHS as readonly string[]).includes(path) ? 1 : 0,
        );
      }
    }
  });

  it.each(LOCALES)("%s: one AggregateOffer per price list the switch shows, each matching the published plans", (locale) => {
    const c = getContent(locale);
    const aggs = softwareApplicationJsonLd(locale).offers as (Record<string, unknown> & {
      offers: Record<string, unknown>[];
    })[];
    expect(aggs.map((a) => a.priceCurrency)).toEqual([...PLAN_CURRENCIES]);

    for (const agg of aggs) {
      const currency = agg.priceCurrency as PlanCurrency;
      const prices = c.pricing.plans.map((plan) => planPrice(plan.id, currency, "monthly"));
      const priced = prices.filter((p): p is number => p !== null);
      expect(agg["@type"]).toBe("AggregateOffer");
      // `unitText` is not an Offer property; it lives on each UnitPriceSpecification.
      expect(agg).not.toHaveProperty("unitText");
      expect(agg.lowPrice, currency).toBe(Math.min(...priced));
      expect(agg.highPrice, currency).toBe(Math.max(...priced));
      expect(agg.offerCount).toBe(c.pricing.plans.length);
      expect(agg.offers).toHaveLength(c.pricing.plans.length);

      agg.offers.forEach((offer, i) => {
        const label = `${locale} ${currency} ${c.pricing.plans[i].id}`;
        expect(offer.name, label).toBe(c.pricing.plans[i].name);
        expect(offer.priceCurrency, label).toBe(currency);
        expect(offer.seller, label).toEqual({ "@id": ORG_ID });
        if (prices[i] === null) {
          // Group is quoted: no number is invented for it.
          expect(offer, label).not.toHaveProperty("price");
          expect(offer, label).not.toHaveProperty("priceSpecification");
          return;
        }
        expect(offer.price, label).toBe(prices[i]);
        const spec = offer.priceSpecification as Record<string, unknown>;
        expect(spec, label).toMatchObject({
          "@type": "UnitPriceSpecification",
          price: prices[i],
          priceCurrency: currency,
          valueAddedTaxIncluded: false,
        });
        expect(spec.unitText, label).toEqual(expect.any(String));
      });
    }
  });

  it.each(LOCALES)("%s: runs in a browser, and shows a real screenshot", (locale) => {
    const app = softwareApplicationJsonLd(locale);
    expect(app.operatingSystem).toMatch(/^Web browser/);
    const shot = String(app.screenshot);
    expect(shot.startsWith(`${brand.url}/screenshots/`)).toBe(true);
    expect(() => readFileSync(join(process.cwd(), "public", new URL(shot).pathname))).not.toThrow();
  });

  it.each(LOCALES)("%s: lists the features the page shows, without unshipped loyalty claims", (locale) => {
    const c = getContent(locale);
    const list = softwareApplicationJsonLd(locale).featureList as string[];
    expect(list).toEqual(c.features.items.map((f) => f.title));
    for (const name of list) expect(name).not.toMatch(UNSHIPPED);
  });
});

describe("Product (price snippets on /pricing)", () => {
  it("has one stable, site-level @id, the same in both languages", () => {
    expect(PRODUCT_ID).toBe(`${brand.url}/#product`);
    for (const locale of LOCALES) expect(productJsonLd(locale)["@id"]).toBe(PRODUCT_ID);
  });

  it("is on /pricing only, once", () => {
    expect([...PRODUCT_PATHS]).toEqual(["/pricing"]);
    for (const locale of LOCALES) {
      expect(ofType(siteJsonLd(locale), "Product")).toEqual([]);
      for (const path of PATHS) {
        expect(ofType(pageJsonLd(locale, path), "Product").length, `${locale} ${path || "/"}`).toBe(
          path === "/pricing" ? 1 : 0,
        );
      }
    }
  });

  it.each(LOCALES)("%s: names the product, its brand and maker by the Organization's @id, and real images on this host", (locale) => {
    const product = productJsonLd(locale);
    expect(product.name).toBe(locale === "ar" ? brand.name.ar : brand.name.en);
    expect(product.brand).toEqual({ "@id": ORG_ID });
    expect(product.manufacturer).toEqual({ "@id": ORG_ID });
    expect(product.url).toBe(`${brand.url}/${locale}/pricing`);
    expect(String(product.description).length).toBeGreaterThan(0);
    const images = product.image as string[];
    expect(images.length).toBeGreaterThan(0);
    for (const url of images) {
      expect(url.startsWith(`${brand.url}/`), url).toBe(true);
      expect(() => readFileSync(join(process.cwd(), "public", new URL(url).pathname)), url).not.toThrow();
    }
    // No rating or review exists, so none is marked up.
    expect(product).not.toHaveProperty("aggregateRating");
    expect(product).not.toHaveProperty("review");
  });

  it.each(LOCALES)("%s: offers one priced Offer per plan and currency, at the published monthly price", (locale) => {
    const c = getContent(locale);
    const offers = productJsonLd(locale).offers as Record<string, unknown>[];
    const expected = PLAN_CURRENCIES.flatMap((currency) =>
      c.pricing.plans.flatMap((plan) => {
        const price = planPrice(plan.id, currency, "monthly");
        return price === null ? [] : [{ name: plan.name, priceCurrency: currency, price }];
      }),
    );
    expect(offers.map((o) => ({ name: o.name, priceCurrency: o.priceCurrency, price: o.price }))).toEqual(expected);
    // Free, Counter and Dining room in four currencies; Group is quoted.
    expect(offers).toHaveLength(3 * PLAN_CURRENCIES.length);
    for (const offer of offers) {
      expect(offer["@type"]).toBe("Offer");
      expect(offer.availability).toBe("https://schema.org/InStock");
      expect(offer.seller).toEqual({ "@id": ORG_ID });
      expect(offer.url).toBe(`${brand.url}/${locale}/pricing`);
      expect(offer.priceSpecification).toMatchObject({ valueAddedTaxIncluded: false, priceCurrency: offer.priceCurrency });
    }
  });
});

describe("the whole graph, every page", () => {
  const graphs = LOCALES.flatMap((locale) =>
    PATHS.map((path) => ({
      label: `${locale} ${path || "/"}`,
      nodes: [...siteJsonLd(locale), ...pageJsonLd(locale, path)],
    })),
  );

  it("gives every node a unique @id on its page", () => {
    for (const { label, nodes } of graphs) {
      const ids = nodes.map((n) => n["@id"]);
      expect(new Set(ids).size, label).toBe(ids.length);
    }
  });

  it("points every @id and url at this site, the parent, or WhatsApp — never an old host", () => {
    for (const { label, nodes } of graphs) {
      for (const [key, value] of entries(nodes)) {
        if (typeof value !== "string") continue;
        if (key === "@id") {
          expect(
            value.startsWith(`${brand.url}/`) || value === PARENT_ID,
            `${label} @id ${value}`,
          ).toBe(true);
        }
        if (/^(url|item|contentUrl|image|screenshot)$/.test(key)) {
          expect(
            value.startsWith(brand.url) ||
              value === brand.parent.url ||
              value.startsWith("https://wa.me/"),
            `${label} ${key} ${value}`,
          ).toBe(true);
        }
        // devya.dev only as the parent itself; no other Devya host, and no
        // devya.solutions address (the gmail inbox is not a host).
        expect(value, `${label} ${key}`).not.toMatch(/[a-z0-9-]+\.devya\.dev|https?:\/\/[^\s"]*devya\.solutions/);
        expect(value, `${label} ${key}`).not.toMatch(UNSHIPPED);
      }
    }
  });

  it("marks up the shared FAQ once, on /pricing", () => {
    expect(FAQ_PATHS).toEqual(["/pricing"]);
    for (const locale of LOCALES) {
      const faqs = PATHS.flatMap((path) => ofType(pageJsonLd(locale, path), "FAQPage"));
      const bodies = faqs.map((f) => JSON.stringify(f.mainEntity));
      expect(new Set(bodies).size, locale).toBe(bodies.length);
      expect(faqs.map((f) => f["@id"])).toEqual([`${brand.url}/${locale}/pricing#faq`]);
    }
  });

  it("gives every indexed page but home a breadcrumb named by the site's own links", () => {
    for (const locale of LOCALES) {
      const c = getContent(locale);
      const links = [...c.nav.links, ...c.nav.extra, ...c.footer.cols.flatMap((col) => col.links)];
      expect(breadcrumbJsonLd(locale, "")).toBeNull();
      for (const { path } of routes.filter((r) => r.path)) {
        const crumbs = breadcrumbJsonLd(locale, path);
        const items = crumbs?.itemListElement as { name: string; item: string }[];
        expect(items, `${locale} ${path}`).toHaveLength(2);
        expect(items[1].item).toBe(`${brand.url}/${locale}${path}`);
        const label = links.find((l) => l.href === path)?.label;
        if (label) expect(items[1].name, `${locale} ${path}`).toBe(label);
        expect(items[1].name.length, `${locale} ${path}`).toBeLessThanOrEqual(40);
      }
      for (const path of NOINDEX_PATHS) expect(breadcrumbJsonLd(locale, path)).toBeNull();
    }
  });
});

/**
 * Every page's JSON-LD as the browser receives it: rendered by the same
 * component the layout and the pages mount, then parsed back. A block that
 * does not parse is dropped whole by search engines, and an Organization
 * under a private @id splits Devya or Moving into a second entity nobody
 * links to. The production HTML of every marketing page gets the same check
 * in e2e/seo.spec.ts.
 */
describe("every page's JSON-LD blocks", () => {
  /** The identities the family shares: Devya on devya.dev, Moving Systems on the umbrella, this site's own. */
  const SHARED_ORG_IDS = new Set([ORG_ID, PARENT_ID, "https://movingsystems.tech/#organization"]);

  /** The page's own nodes, from the builder its page.tsx mounts. */
  function pageGraph(locale: string, path: string): JsonLdNode[] {
    if (path === DOCS_BASE) return docsPageJsonLd(locale);
    if (path.startsWith(`${DOCS_BASE}/`)) {
      const [category, slug] = path.slice(DOCS_BASE.length + 1).split("/");
      return slug ? articlePageJsonLd(locale, category, slug) : docsPageJsonLd(locale, category);
    }
    return pageJsonLd(locale, path);
  }

  /** The `<script type="application/ld+json">` bodies in a fragment of HTML. */
  function blocks(html: string): string[] {
    return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  }

  /** Every object in a parsed tree. */
  function objects(value: unknown): Record<string, unknown>[] {
    if (Array.isArray(value)) return value.flatMap(objects);
    if (value && typeof value === "object") {
      return [value as Record<string, unknown>, ...Object.values(value).flatMap(objects)];
    }
    return [];
  }

  const pages = LOCALES.flatMap((locale) =>
    [...PATHS, ...docsPaths(locale).map((p) => p.path).filter((p) => p !== DOCS_BASE)].map((path) => {
      const html = [siteJsonLd(locale), pageGraph(locale, path)]
        .map((data) => renderToStaticMarkup(createElement(JsonLd, { data })))
        .join("");
      return { label: `${locale} ${path || "/"}`, html };
    }),
  );

  it("parses every block, each a schema.org graph with nothing unescaped in it", () => {
    expect(pages.length).toBeGreaterThan(PATHS.length * LOCALES.length);
    for (const { label, html } of pages) {
      const found = blocks(html);
      expect(found.length, label).toBeGreaterThanOrEqual(1);
      for (const body of found) {
        expect(body, label).not.toContain("<");
        const parsed = JSON.parse(body) as Record<string, unknown>;
        expect(parsed["@context"], label).toBe("https://schema.org");
      }
    }
  });

  it("names Devya and Moving only by their shared Organization @ids", () => {
    for (const { label, html } of pages) {
      for (const node of blocks(html).flatMap((b) => objects(JSON.parse(b)))) {
        const id = node["@id"];
        if (node["@type"] === "Organization") {
          expect(SHARED_ORG_IDS.has(String(id)), `${label} Organization ${String(id)}`).toBe(true);
          const name = String(node.name ?? "");
          if (/devya|ديفيا/i.test(name)) expect(id, label).toBe("https://devya.dev/#organization");
          if (/moving systems|موفينج سيستمز/i.test(name)) expect(id, label).toBe("https://movingsystems.tech/#organization");
        }
        // A reference to an organization elsewhere uses one of the same ids.
        if (typeof id === "string" && id.endsWith("#organization")) {
          expect(SHARED_ORG_IDS.has(id), `${label} ${id}`).toBe(true);
        }
      }
    }
  });

  it("would catch a block that does not parse, and a private Devya @id", () => {
    const broken = `<script type="application/ld+json">{"@context":"https://schema.org",</script>`;
    expect(() => blocks(broken).map((b) => JSON.parse(b))).toThrow();
    const stray = { "@type": "Organization", "@id": "https://www.devya.dev/#organization", name: "Devya Solutions" };
    expect(SHARED_ORG_IDS.has(stray["@id"])).toBe(false);
  });
});
