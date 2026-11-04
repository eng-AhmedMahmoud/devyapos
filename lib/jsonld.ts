import { getContent, type SiteContent } from "@/content";
import { brand, brandName, socialLinks } from "./brand";
import { localeHref, ogImageUrl, routes } from "./meta";
import { PLAN_CURRENCIES, planPrice, type PlanCurrency } from "./plans";
import { SHOTS } from "./screenshots";

/**
 * Structured data, generated from the same content tree the page renders.
 *
 * Everything here reads `content/{ar,en}.ts` rather than repeating strings:
 * an FAQ answer or a plan price can then never drift from the visible copy,
 * which is the failure mode Google penalises hardest (markup that does not
 * match the page). Nothing is invented — there is no `aggregateRating`
 * because there are no reviews. `sameAs` now carries the two live social
 * profiles from `lib/brand.ts`; it stayed empty while those were placeholders,
 * because pointing `sameAs` at a profile that is not the brand's is worse than
 * omitting the property.
 */
export interface JsonLdNode {
  "@type": string;
  [key: string]: unknown;
}

/**
 * Stable node identities so the per-page graphs can point at them. APP_ID is
 * also what the movingsystems.tech umbrella site links to: never rename it.
 * PARENT_ID is Devya Solutions' own Organization node on devya.dev.
 */
export const ORG_ID = `${brand.url}/#organization`;
export const WEBSITE_ID = `${brand.url}/#website`;
export const APP_ID = `${brand.url}/#software`;
/**
 * The product as something sold (the Product node on /pricing). Site-level,
 * like the two above, rather than `/{locale}/pricing#product`: it is one
 * product in two languages, so the Arabic and English pages describe the same
 * node instead of two products that compete with each other, and the @id
 * survives if the node is ever emitted on a second page.
 */
export const PRODUCT_ID = `${brand.url}/#product`;
export const PARENT_ID = `${brand.parent.url}/#organization`;

/**
 * The countries the site prices in, from the currency switch: the pricing
 * note says EGP is for Egypt, SAR for Saudi Arabia and AED for the UAE, and
 * USD for everywhere else — which is not a country, so it adds none. A
 * currency added to `PLAN_CURRENCIES` must be placed here (tests/jsonld.test.ts).
 */
export const CURRENCY_COUNTRY: Record<PlanCurrency, { name: string; code: string } | null> = {
  EGP: { name: "Egypt", code: "EG" },
  SAR: { name: "Saudi Arabia", code: "SA" },
  AED: { name: "United Arab Emirates", code: "AE" },
  USD: null,
};

/** The priced countries, in the switch's order (Egypt, the home market, first). */
export const PRICED_COUNTRIES = PLAN_CURRENCIES.flatMap((currency) => {
  const country = CURRENCY_COUNTRY[currency];
  return country ? [country] : [];
});

/**
 * The logo as a raster on this host. Google reads `logo` for the knowledge
 * panel and wants a bitmap of at least 112 px; the SVG mark it pointed at
 * before is not one. The PNG is rendered from the mark by
 * scripts/render-brand-assets.mjs.
 */
const LOGO = {
  url: `${brand.url}/brand/devyapos-icon-512.png`,
  width: 512,
  height: 512,
} as const;

/** E.164 with the plus back on — `brand.whatsapp` stores it bare for wa.me. */
const tel = `+${brand.whatsapp}`;

/**
 * `unitText` for the plan prices: "per branch / mo", "لكل فرع / شهر".
 *
 * Composed from the same two strings the pricing card prints, so a change to
 * the billing unit in the copy carries into the markup.
 */
function unitText(c: SiteContent) {
  return `${c.pricing.perBranch} / ${c.pricing.per.replace(/^\//, "")}`;
}

/** Moving POS the vendor, with Devya Solutions as the parent company. */
export function organizationJsonLd(locale: string): JsonLdNode {
  const c = getContent(locale);

  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: brandName(locale),
    alternateName: brandName(locale === "ar" ? "en" : "ar"),
    url: brand.url,
    logo: {
      "@type": "ImageObject",
      "@id": `${brand.url}/#logo`,
      url: LOGO.url,
      contentUrl: LOGO.url,
      width: LOGO.width,
      height: LOGO.height,
      caption: brandName(locale),
    },
    image: ogImageUrl(locale),
    description: c.meta.home.description,
    email: brand.email,
    telephone: tel,
    sameAs: socialLinks.map((s) => s.href),
    // Where the site sells, not where it markets: one Country per priced
    // currency's country (the pricing note's own mapping).
    areaServed: PRICED_COUNTRIES.map(({ name }) => ({ "@type": "Country", name })),
    parentOrganization: {
      "@type": "Organization",
      "@id": PARENT_ID,
      name: brand.parent.name,
      url: brand.parent.url,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: tel,
        email: brand.email,
        url: `https://wa.me/${brand.whatsapp}`,
        areaServed: PRICED_COUNTRIES.map(({ code }) => code),
        availableLanguage: ["ar", "en"],
      },
    ],
  };
}

/**
 * One Offer per plan in one currency, at its monthly list price
 * (`lib/plans.ts`), Free's 0 included. Group is quoted, so its Offer carries
 * no `price` and says so in its description rather than inventing a number.
 * VAT is excluded from every list price, as the pricing note says, so the
 * price specification says it too.
 */
function planOffers(locale: string, currency: PlanCurrency): JsonLdNode[] {
  const c = getContent(locale);
  const unit = unitText(c);

  return c.pricing.plans.map((plan) => {
    const price = planPrice(plan.id, currency, "monthly");
    const offer: JsonLdNode = {
      "@type": "Offer",
      name: plan.name,
      description: plan.tagline,
      url: localeHref(locale, "/pricing"),
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      seller: { "@id": ORG_ID },
    };

    if (price !== null) {
      offer.price = price;
      offer.priceSpecification = {
        "@type": "UnitPriceSpecification",
        price,
        priceCurrency: currency,
        valueAddedTaxIncluded: false,
        unitText: unit,
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: 1,
          unitCode: "MON",
        },
      };
    } else if (plan.priceLabel) {
      /* Quoted plan: say so rather than inventing a number. */
      offer.description = `${plan.tagline} — ${plan.priceLabel}`;
    }

    return offer;
  });
}

/**
 * The product itself, priced from the real plans.
 *
 * One `AggregateOffer` per price list the currency switch shows (EGP, SAR,
 * AED, USD — `PLAN_CURRENCIES`), each spanning the four plans at their monthly
 * list prices in that currency. Group carries no `price`, so it counts in
 * `offerCount` but not in the low/high band. Until 2026-11-04 only EGP was
 * marked up, which told search engines the product is sold in Egypt alone
 * while the page sells it in four currencies.
 */
export function softwareApplicationJsonLd(locale: string): JsonLdNode {
  const c = getContent(locale);

  const offers = PLAN_CURRENCIES.map((currency) => {
    const plans = planOffers(locale, currency);
    const priced = plans.flatMap((o) => (typeof o.price === "number" ? [o.price] : []));
    return {
      "@type": "AggregateOffer",
      priceCurrency: currency,
      lowPrice: Math.min(...priced),
      highPrice: Math.max(...priced),
      offerCount: plans.length,
      // No `unitText` here: it is not an Offer property. The billing unit is
      // on each plan's UnitPriceSpecification.
      offers: plans,
    };
  });

  return {
    "@type": "SoftwareApplication",
    "@id": APP_ID,
    name: brandName(locale),
    alternateName: brandName(locale === "ar" ? "en" : "ar"),
    url: localeHref(locale),
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Point of Sale",
    // It runs in a browser on whatever the branch owns (/hardware).
    operatingSystem: "Web browser (Android, iPadOS, Windows, macOS)",
    description: c.meta.home.description,
    inLanguage: ["ar", "en"],
    image: ogImageUrl(locale),
    screenshot: `${brand.url}${SHOTS.posOrder.src}`,
    publisher: { "@id": ORG_ID },
    featureList: c.features.items.map((f) => f.title),
    offers,
  };
}

/**
 * The product as Google's product snippets read it, on /pricing only.
 *
 * SoftwareApplication's rich result needs a rating or a review, and there are
 * none to mark up (none are invented). A `Product` with `offers` is eligible
 * for price snippets without either. Its offers are the plans that have a
 * price — Free, Counter and Dining room in every currency the switch shows —
 * as plain Offers, one per plan and currency: Google asks for `Offer`, not
 * `AggregateOffer`, when the offers are variants of one product. Group is
 * quoted, and an Offer without a price is not one, so it is left out here and
 * stays in the SoftwareApplication's list.
 */
export function productJsonLd(locale: string): JsonLdNode {
  const c = getContent(locale);

  return {
    "@type": "Product",
    "@id": PRODUCT_ID,
    name: brandName(locale),
    alternateName: brandName(locale === "ar" ? "en" : "ar"),
    description: c.meta.home.description,
    url: localeHref(locale, "/pricing"),
    image: [`${brand.url}${SHOTS.posOrder.src}`, ogImageUrl(locale, "/pricing")],
    brand: { "@id": ORG_ID },
    manufacturer: { "@id": ORG_ID },
    category: "Point of Sale software",
    offers: PLAN_CURRENCIES.flatMap((currency) =>
      planOffers(locale, currency).filter((offer) => typeof offer.price === "number"),
    ),
  };
}

/** Routes whose page is the price list, so carry the Product node. */
export const PRODUCT_PATHS = ["/pricing"] as const;

/** The site itself: one WebSite in both languages, published by Moving POS. */
export function webSiteJsonLd(locale: string): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: brand.url,
    name: brandName(locale),
    alternateName: brandName(locale === "ar" ? "en" : "ar"),
    inLanguage: ["ar", "en"],
    publisher: { "@id": ORG_ID },
  };
}

/**
 * The site-wide nodes, mounted once from the locale layout: who runs the site,
 * and the site. The product and its prices are not here — they are emitted
 * by `pageJsonLd` on the pages that show them (APP_PATHS), so a privacy policy
 * does not carry price markup it does not display.
 */
export function siteJsonLd(locale: string): JsonLdNode[] {
  return [organizationJsonLd(locale), webSiteJsonLd(locale)];
}

/** Routes that present the product and its prices, so carry SoftwareApplication. */
export const APP_PATHS = ["", "/features", "/compare", "/pricing"] as const;

/**
 * FAQ markup for the shared `components/Faq` block. Generated from
 * `c.faq.items`, so the answers in the markup are the answers on the page,
 * verbatim.
 */
export function faqPageJsonLd(locale: string, path: string): JsonLdNode {
  const c = getContent(locale);

  return {
    "@type": "FAQPage",
    "@id": `${localeHref(locale, path)}#faq`,
    inLanguage: locale,
    mainEntity: c.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/**
 * Routes whose shared `<Faq />` is marked up. /contact renders the same block,
 * but the same FAQPage on two URLs competes with itself, so only /pricing —
 * where the questions are about the plans — carries it.
 */
export const FAQ_PATHS = ["/pricing"] as const;

/**
 * Human name for a route: the label the site's own links give it (the header,
 * then the footer), otherwise the first half of its `<title>` ("Something |
 * Moving POS" or "Moving POS | something"). Links first, because titles carry
 * search keywords and are too long to read as a breadcrumb.
 */
function routeName(c: SiteContent, locale: string, path: string, key: string) {
  const link = [
    ...c.nav.links,
    ...c.nav.extra,
    ...c.footer.cols.flatMap((col) => col.links),
  ].find((l) => l.href === path);
  if (link) return link.label;

  const title = (c.meta[key] ?? c.meta.home).title;
  const [first, second] = title.split("|").map((part) => part.trim());
  return first === brandName(locale) && second ? second : first;
}

/** Home > Page. Home is the breadcrumb root, so it gets no list of its own. */
export function breadcrumbJsonLd(
  locale: string,
  path: string,
): JsonLdNode | null {
  if (!path) return null;
  const c = getContent(locale);
  const route = routes.find((r) => r.path === path);
  if (!route) return null;

  return {
    "@type": "BreadcrumbList",
    "@id": `${localeHref(locale, path)}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: brandName(locale),
        item: localeHref(locale),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: routeName(c, locale, path, route.key),
        item: localeHref(locale, path),
      },
    ],
  };
}

/**
 * Everything a page should emit on top of the site-wide graph.
 *
 * Composable on purpose — a page mounts it with one line:
 *   <JsonLd data={pageJsonLd(locale, "/pricing")} />
 */
export function pageJsonLd(locale: string, path: string): JsonLdNode[] {
  const nodes: JsonLdNode[] = [];
  if ((APP_PATHS as readonly string[]).includes(path)) {
    nodes.push(softwareApplicationJsonLd(locale));
  }
  if ((PRODUCT_PATHS as readonly string[]).includes(path)) {
    nodes.push(productJsonLd(locale));
  }
  const crumbs = breadcrumbJsonLd(locale, path);
  if (crumbs) nodes.push(crumbs);
  if ((FAQ_PATHS as readonly string[]).includes(path)) {
    nodes.push(faqPageJsonLd(locale, path));
  }
  return nodes;
}
