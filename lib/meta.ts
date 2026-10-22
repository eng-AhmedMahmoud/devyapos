import type { Metadata, MetadataRoute } from "next";
import { getContent } from "@/content";
import { routing } from "@/i18n/routing";
import { brand, brandName } from "./brand";

/**
 * One route manifest for the whole site.
 *
 * `app/sitemap.ts` used to keep its own hand-typed list of paths, which meant
 * every new page needed a second edit in a file nobody opens — and a forgotten
 * one is invisible until a page quietly never gets indexed. The sitemap now
 * reads this array, so adding a route is a single line here.
 */
export interface SiteRoute {
  /** Path below the locale prefix. `""` is the locale home page. */
  path: string;
  /** Key into the `meta` block of the content tree (see `content/types.ts`). */
  key: string;
  /** Sitemap priority, relative to the other routes on this site only. */
  priority: number;
  changeFrequency: NonNullable<
    MetadataRoute.Sitemap[number]["changeFrequency"]
  >;
  /**
   * The day the page's own copy last changed, as `YYYY-MM-DD`. The sitemap's
   * `lastmod`, typed by hand on purpose: the image is built from a git archive,
   * so a build-time date would move on every deploy and teach search engines
   * to ignore the field. Bump it in the commit that changes what the page says.
   */
  updated: string;
}

export const routes: readonly SiteRoute[] = [
  { path: "", key: "home", priority: 1, changeFrequency: "weekly", updated: "2026-10-19" },
  { path: "/features", key: "features", priority: 0.8, changeFrequency: "monthly", updated: "2026-10-19" },
  { path: "/how-it-works", key: "howItWorks", priority: 0.8, changeFrequency: "monthly", updated: "2026-10-19" },
  { path: "/compare", key: "compare", priority: 0.8, changeFrequency: "monthly", updated: "2026-10-19" },
  { path: "/pricing", key: "pricing", priority: 0.9, changeFrequency: "weekly", updated: "2026-10-22" },
  { path: "/about", key: "about", priority: 0.6, changeFrequency: "monthly", updated: "2026-10-22" },
  { path: "/contact", key: "contact", priority: 0.7, changeFrequency: "monthly", updated: "2026-10-19" },
  /* Search-entry pages: each answers a query the home page cannot. */
  { path: "/eta-einvoicing", key: "etaInvoicing", priority: 0.7, changeFrequency: "monthly", updated: "2026-10-19" },
  { path: "/foodics-alternative", key: "foodicsAlternative", priority: 0.7, changeFrequency: "monthly", updated: "2026-10-22" },
  { path: "/hardware", key: "hardware", priority: 0.7, changeFrequency: "monthly", updated: "2026-10-19" },
  /* The self-serve accounting trial — a sign-up, so it is indexed like one. */
  { path: "/accounting-trial", key: "accountingTrial", priority: 0.7, changeFrequency: "monthly", updated: "2026-10-19" },
  /* The privacy policy describes what the site already does, so it is indexed
     and linked; its date is the "Last updated" line the page prints. */
  { path: "/privacy", key: "privacy", priority: 0.3, changeFrequency: "yearly", updated: "2026-10-13" },
];

/**
 * Pages that are reachable but kept out of search: /terms and /refund are
 * unreviewed drafts that commit the company to refund windows and a liability
 * cap. `buildMetadata` marks them `noindex, follow`, and they stay out of
 * `routes` (so out of the sitemap and the breadcrumbs). /refund is still linked
 * from the footer — it only restates the trial and cancellation terms the
 * marketing pages already promise. When legal signs one off, move it into
 * `routes` and out of this list in the same commit.
 */
export const NOINDEX_PATHS: readonly string[] = ["/terms", "/refund"];

/** Absolute URL for a path in a given locale. `localePrefix` is "always". */
export function localeHref(locale: string, path = "") {
  return `${brand.url}/${locale}${path}`;
}

/**
 * hreflang map for one path.
 *
 * `x-default` is what a search engine falls back to when none of the declared
 * languages matches the visitor. Without it, Google picks one itself — and the
 * one it picks is rarely the Arabic page this site actually leads with. Arabic
 * is `routing.defaultLocale`, so the default and the fallback agree.
 */
export function alternateLanguages(path = "") {
  return {
    ...Object.fromEntries(
      routing.locales.map((l) => [l, localeHref(l, path)]),
    ),
    "x-default": localeHref(routing.defaultLocale, path),
  };
}

/**
 * The OG card for a locale: a static PNG in `public/og/`, rendered from HTML
 * by `scripts/render-brand-assets.mjs` with headless Chrome. Not `next/og` —
 * satori rejects the GSUB tables of the Arabic faces the site now sets (Reem
 * Kufi, IBM Plex Sans Arabic) and fails the build; Moving Stores and the
 * movingsystems.tech umbrella site render their cards the same way. Re-run the
 * script whenever the hero copy or the product name changes.
 */
export function ogImageUrl(locale: string) {
  return `${brand.url}/og/og-${locale === "en" ? "en" : "ar"}.png`;
}

/**
 * Wired explicitly on every page because `buildMetadata` sets `openGraph`
 * per page, and a level that declares `openGraph` replaces the parent's.
 */
export function ogImage(locale: string, alt: string) {
  return [
    {
      url: ogImageUrl(locale),
      width: 1200,
      height: 630,
      alt,
      type: "image/png",
    },
  ];
}

/** Open Graph locale for a site locale: Egyptian Arabic, US English. */
export function ogLocale(locale: string) {
  return locale === "ar" ? "ar_EG" : "en_US";
}

/**
 * Page metadata + hreflang alternates. Every page passes its own key from the
 * `meta` block of the content tree so titles stay next to the copy they belong
 * to.
 */
export function buildMetadata(
  locale: string,
  key: string,
  path = "",
): Metadata {
  const c = getContent(locale);
  const meta = c.meta[key] ?? c.meta.home;
  const url = localeHref(locale, path);
  const images = ogImage(locale, meta.title);

  return {
    metadataBase: new URL(brand.url),
    title: meta.title,
    description: meta.description,
    /* Out of the index, but the links on the page are still followed: the
       footer and nav on a noindexed page lead to pages that are indexed. */
    ...(NOINDEX_PATHS.includes(path)
      ? { robots: { index: false, follow: true } }
      : {}),
    alternates: { canonical: url, languages: alternateLanguages(path) },
    openGraph: {
      type: "website",
      url,
      title: meta.title,
      description: meta.description,
      siteName: brandName(locale),
      locale: ogLocale(locale),
      // The same page in the other language (og:locale:alternate).
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map(ogLocale),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images,
    },
  };
}
