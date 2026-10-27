import type { MetadataRoute } from "next";

/**
 * One route manifest for the whole site.
 *
 * `app/sitemap.ts` used to keep its own hand-typed list of paths, which meant
 * every new page needed a second edit in a file nobody opens — and a forgotten
 * one is invisible until a page quietly never gets indexed. The sitemap now
 * reads this array, so adding a route is a single line here.
 *
 * Plain data with no import of the copy, so the browser specs (e2e/), which
 * cannot load the server-only content module, read the same list. lib/meta.ts
 * re-exports it.
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
  { path: "", key: "home", priority: 1, changeFrequency: "weekly", updated: "2026-10-22" },
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
  /* The help centre's front page. Its categories and articles are listed by
     the sitemap from content/docs (lib/docs `docsPaths`), each dated by the
     day it was checked against the product. */
  { path: "/docs", key: "docs", priority: 0.7, changeFrequency: "weekly", updated: "2026-10-27" },
  /* The partner programmes: a channel page, indexed so a dealer or an accountant searching for one finds it. */
  { path: "/partners", key: "partners", priority: 0.6, changeFrequency: "monthly", updated: "2026-10-22" },
  /* The self-serve accounting trial — a sign-up, so it is indexed like one. */
  { path: "/accounting-trial", key: "accountingTrial", priority: 0.7, changeFrequency: "monthly", updated: "2026-10-19" },
  /* The privacy policy describes what the site already does, so it is indexed
     and linked; its date is the "Last updated" line the page prints. */
  { path: "/privacy", key: "privacy", priority: 0.3, changeFrequency: "yearly", updated: "2026-10-27" },
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

/**
 * Where a page's Open Graph card lives under public/: one 1200×630 PNG per
 * page and locale, so a shared /pricing link unfurls with the pricing headline
 * rather than the home page's. Home keeps its original name (og-ar.png), which
 * the Organization markup and older shares already point at. The cards are
 * baked by scripts/render-brand-assets.mjs, which reads this same function.
 */
export function ogImagePath(locale: string, path = ""): string {
  const lang = locale === "en" ? "en" : "ar";
  return path ? `/og/og-${path.slice(1)}-${lang}.png` : `/og/og-${lang}.png`;
}
