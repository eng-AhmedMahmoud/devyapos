import type { Metadata } from "next";
import { getContent } from "@/content";
import { routing } from "@/i18n/routing";
import { brand, brandName } from "./brand";
import { NOINDEX_PATHS, ogImagePath } from "./routes";

/* The route manifest lives in ./routes, apart from the copy; re-exported here
   for the modules that already read it from lib/meta. */
export { NOINDEX_PATHS, ogImagePath, routes, type SiteRoute } from "./routes";

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
 * The OG card for a page in a locale (home when `path` is ""): a static PNG in
 * `public/og/`, rendered from HTML by `scripts/render-brand-assets.mjs` with
 * headless Chrome. Not `next/og` — satori rejects the GSUB tables of the
 * Arabic faces the site now sets (Reem Kufi, IBM Plex Sans Arabic) and fails
 * the build; Moving Stores and the movingsystems.tech umbrella site render
 * their cards the same way. Re-run the script whenever a page's title, the
 * hero copy or the product name changes.
 */
export function ogImageUrl(locale: string, path = "") {
  return `${brand.url}${ogImagePath(locale, path)}`;
}

/**
 * Wired explicitly on every page because `buildMetadata` sets `openGraph`
 * per page, and a level that declares `openGraph` replaces the parent's.
 */
export function ogImage(locale: string, alt: string, path = "") {
  return [
    {
      url: ogImageUrl(locale, path),
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
 * What a help-centre page says about itself (lib/docs/meta.ts): its categories
 * and articles title themselves from content/docs rather than from `meta`.
 */
export interface PageMeta {
  title: string;
  description: string;
  /** "article" for help-centre articles; everything else is a website page. */
  type?: "website" | "article";
  /** ISO date, for articles: the day the article was checked against the product. */
  modified?: string;
  /** Out of the index, links still followed (the search results page). */
  noindex?: boolean;
  /** The path whose share card the page uses (a help page uses the help centre's). */
  card?: string;
}

/**
 * Page metadata + hreflang alternates. Every page passes its own key from the
 * `meta` block of the content tree so titles stay next to the copy they belong
 * to; a help-centre page passes its own `page` instead.
 */
export function buildMetadata(
  locale: string,
  key: string,
  path = "",
  page?: PageMeta,
): Metadata {
  const c = getContent(locale);
  const meta = page ?? c.meta[key] ?? c.meta.home;
  const url = localeHref(locale, path);
  const images = ogImage(locale, meta.title, page?.card ?? path);

  return {
    metadataBase: new URL(brand.url),
    title: meta.title,
    description: meta.description,
    /* Out of the index, but the links on the page are still followed: the
       footer and nav on a noindexed page lead to pages that are indexed. */
    ...(NOINDEX_PATHS.includes(path) || page?.noindex
      ? { robots: { index: false, follow: true } }
      : {}),
    alternates: { canonical: url, languages: alternateLanguages(path) },
    openGraph: {
      type: page?.type ?? "website",
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
      ...(page?.modified ? { modifiedTime: page.modified } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images,
    },
  };
}
