import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getContent } from "@/content";
import { brand } from "@/lib/brand";
import {
  APP_ID,
  APP_PATHS,
  FAQ_PATHS,
  ORG_ID,
  PARENT_ID,
  WEBSITE_ID,
  type JsonLdNode,
  breadcrumbJsonLd,
  organizationJsonLd,
  pageJsonLd,
  siteJsonLd,
  softwareApplicationJsonLd,
} from "@/lib/jsonld";
import { NOINDEX_PATHS, routes } from "@/lib/meta";

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

  it.each(LOCALES)("%s: serves Egypt, by name", (locale) => {
    expect(organizationJsonLd(locale).areaServed).toEqual({ "@type": "Country", name: "Egypt" });
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

  it.each(LOCALES)("%s: offers are valid and match the published plans", (locale) => {
    const c = getContent(locale);
    const app = softwareApplicationJsonLd(locale);
    const agg = app.offers as Record<string, unknown> & { offers: Record<string, unknown>[] };
    expect(agg["@type"]).toBe("AggregateOffer");
    // `unitText` is not an Offer property; it lives on each UnitPriceSpecification.
    expect(agg).not.toHaveProperty("unitText");
    expect(Number(agg.lowPrice)).toBeLessThanOrEqual(Number(agg.highPrice));
    expect(agg.offerCount).toBe(c.pricing.plans.length);
    expect(agg.offers).toHaveLength(c.pricing.plans.length);

    for (const offer of agg.offers) {
      expect(offer.seller).toEqual({ "@id": ORG_ID });
      if (offer.price === undefined) continue;
      const spec = offer.priceSpecification as Record<string, unknown>;
      expect(spec).toMatchObject({ "@type": "UnitPriceSpecification", price: offer.price, priceCurrency: "EGP" });
      expect(spec.unitText).toEqual(expect.any(String));
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
    expect(list).toEqual(c.features.items.map((f) => f.listName ?? f.title));
    for (const name of list) expect(name).not.toMatch(UNSHIPPED);
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
