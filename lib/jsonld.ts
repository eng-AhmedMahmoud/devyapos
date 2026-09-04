import { getContent, type SiteContent } from "@/content";
import { brand } from "./brand";
import { localeHref, routes } from "./meta";

/**
 * Structured data, generated from the same content tree the page renders.
 *
 * Everything here reads `content/{ar,en}.ts` rather than repeating strings:
 * an FAQ answer or a plan price can then never drift from the visible copy,
 * which is the failure mode Google penalises hardest (markup that does not
 * match the page). Nothing is invented — there is no `aggregateRating`
 * because there are no reviews, and no `sameAs` because the brand has no
 * verified social profiles (see the note in `lib/brand.ts`).
 */
export interface JsonLdNode {
  "@type": string;
  [key: string]: unknown;
}

/** Stable node identities so the per-page graphs can point at them. */
export const ORG_ID = `${brand.url}/#organization`;
export const APP_ID = `${brand.url}/#software`;
const PARENT_ID = `${brand.parent.url}/#organization`;

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

/** DevyaPOS the vendor, with Devya Solutions as the parent company. */
export function organizationJsonLd(locale: string): JsonLdNode {
  const c = getContent(locale);

  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: brand.wordmark,
    url: brand.url,
    logo: `${brand.url}/icon.svg`,
    image: `${brand.url}/${locale}/opengraph-image`,
    description: c.meta.home.description,
    email: brand.email,
    telephone: tel,
    areaServed: { "@type": "Country", name: "EG" },
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
        areaServed: "EG",
        availableLanguage: ["ar", "en"],
      },
    ],
  };
}

/**
 * The product itself, priced from the real plans.
 *
 * `AggregateOffer` spans the three published plans; Enterprise carries no
 * `price` because it is quoted, so it contributes to `offerCount` but not to
 * the low/high band.
 */
export function softwareApplicationJsonLd(locale: string): JsonLdNode {
  const c = getContent(locale);
  const priced = c.pricing.plans.filter(
    (p): p is typeof p & { price: number } => typeof p.price === "number",
  );
  const unit = unitText(c);

  const offers = c.pricing.plans.map((plan) => {
    const offer: JsonLdNode = {
      "@type": "Offer",
      name: plan.name,
      description: plan.tagline,
      url: localeHref(locale, "/pricing"),
      priceCurrency: "EGP",
      availability: "https://schema.org/InStock",
      seller: { "@id": ORG_ID },
    };

    if (typeof plan.price === "number") {
      offer.price = plan.price;
      offer.priceSpecification = {
        "@type": "UnitPriceSpecification",
        price: plan.price,
        priceCurrency: "EGP",
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

  return {
    "@type": "SoftwareApplication",
    "@id": APP_ID,
    name: brand.wordmark,
    url: localeHref(locale),
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Point of Sale",
    operatingSystem: "Web",
    description: c.meta.home.description,
    inLanguage: ["ar", "en"],
    image: `${brand.url}/${locale}/opengraph-image`,
    publisher: { "@id": ORG_ID },
    featureList: c.features.items.map((f) => f.title),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EGP",
      lowPrice: Math.min(...priced.map((p) => p.price)),
      highPrice: Math.max(...priced.map((p) => p.price)),
      offerCount: c.pricing.plans.length,
      unitText: unit,
      offers,
    },
  };
}

/** The two site-wide nodes, mounted once from the locale layout. */
export function siteJsonLd(locale: string): JsonLdNode[] {
  return [organizationJsonLd(locale), softwareApplicationJsonLd(locale)];
}

/**
 * FAQ markup for the pages that actually render `components/Faq` — currently
 * /pricing and /contact. Generated from `c.faq.items`, so the answers in the
 * markup are the answers on the page, verbatim.
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

/** Routes whose page mounts `<Faq />`. Keep in step with those two pages. */
export const FAQ_PATHS = ["/pricing", "/contact"] as const;

/**
 * Human name for a route: the nav label when the route is in the nav,
 * otherwise the first half of its `<title>` (every page title is
 * "Something | DevyaPOS" or "DevyaPOS | something").
 */
function routeName(c: SiteContent, path: string, key: string) {
  const link = c.nav.links.find((l) => l.href === path);
  if (link) return link.label;

  const title = (c.meta[key] ?? c.meta.home).title;
  const [first, second] = title.split("|").map((part) => part.trim());
  return first === brand.wordmark && second ? second : first;
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
        name: brand.wordmark,
        item: localeHref(locale),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: routeName(c, path, route.key),
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
  const crumbs = breadcrumbJsonLd(locale, path);
  if (crumbs) nodes.push(crumbs);
  if ((FAQ_PATHS as readonly string[]).includes(path)) {
    nodes.push(faqPageJsonLd(locale, path));
  }
  return nodes;
}
