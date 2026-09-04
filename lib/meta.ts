import type { Metadata, MetadataRoute } from "next";
import { getContent } from "@/content";
import { routing } from "@/i18n/routing";
import { brand } from "./brand";

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
}

export const routes: readonly SiteRoute[] = [
  { path: "", key: "home", priority: 1, changeFrequency: "weekly" },
  { path: "/features", key: "features", priority: 0.8, changeFrequency: "monthly" },
  { path: "/how-it-works", key: "howItWorks", priority: 0.8, changeFrequency: "monthly" },
  { path: "/compare", key: "compare", priority: 0.8, changeFrequency: "monthly" },
  { path: "/pricing", key: "pricing", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", key: "about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", key: "contact", priority: 0.7, changeFrequency: "monthly" },
  /* Search-entry pages: each answers a query the home page cannot. */
  { path: "/eta-einvoicing", key: "etaInvoicing", priority: 0.7, changeFrequency: "monthly" },
  { path: "/foodics-alternative", key: "foodicsAlternative", priority: 0.7, changeFrequency: "monthly" },
  { path: "/hardware", key: "hardware", priority: 0.7, changeFrequency: "monthly" },
  /* Legal (/terms, /privacy, /refund) is deliberately absent. The pages are
     built and reachable, but they are unreviewed drafts that commit the company
     to refund windows, retention periods and a liability cap, so they are kept
     out of the sitemap and marked noindex until they have been reviewed. Add
     them back here, and restore the footer links in `content/*.ts`, in the same
     commit that publishes them. */
];

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
 * The generated OG card for a locale — `app/[locale]/opengraph-image.tsx`.
 *
 * Wired explicitly rather than left to Next's file convention because
 * `buildMetadata` sets `openGraph` on every page: once a level declares
 * `openGraph.images`, Next stops merging the file-based image into it.
 */
export function ogImage(locale: string, alt: string) {
  return [
    {
      url: `${brand.url}/${locale}/opengraph-image`,
      width: 1200,
      height: 630,
      alt,
      type: "image/png",
    },
  ];
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
    alternates: { canonical: url, languages: alternateLanguages(path) },
    openGraph: {
      type: "website",
      url,
      title: meta.title,
      description: meta.description,
      siteName: brand.wordmark,
      locale: locale === "ar" ? "ar_EG" : "en_US",
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
