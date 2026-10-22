import type { Metadata } from "next";
import { getContent } from "@/content";
import { routing } from "@/i18n/routing";
import { brand, brandName } from "./brand";
import { NOINDEX_PATHS } from "./routes";

/* The route manifest lives in ./routes, apart from the copy; re-exported here
   for the modules that already read it from lib/meta. */
export { NOINDEX_PATHS, routes, type SiteRoute } from "./routes";

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
