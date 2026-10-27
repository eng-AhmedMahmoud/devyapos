import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { DOCS_BASE, docsPaths } from "@/lib/docs";
import { alternateLanguages, localeHref, routes } from "@/lib/meta";

/**
 * Every route, in every locale, with `xhtml:link` hreflang alternates.
 *
 * The path list used to live here as a hand-maintained array, which made every
 * new page two edits — and the forgotten second edit is silent. `routes` in
 * `lib/meta.ts` is now the single manifest; adding a page there adds it here.
 * Pages in NOINDEX_PATHS are not in `routes`, so a noindexed page is never
 * listed here.
 *
 * The help centre's categories and articles come from its own tree
 * (content/docs, read by `docsPaths`): adding an article adds its page here,
 * dated by the day it was last checked against the product. Its front page is
 * in `routes`; its search results page is noindexed and absent.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) => [
    ...routes.map((route) => ({
      url: localeHref(locale, route.path),
      // The day the copy last changed (see SiteRoute.updated), never build time.
      lastModified: route.updated,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      // Includes x-default, pointing at the Arabic page — see lib/meta.ts.
      alternates: { languages: alternateLanguages(route.path) },
    })),
    ...docsPaths(locale)
      .filter((p) => p.path !== DOCS_BASE)
      .map((p) => ({
        url: localeHref(locale, p.path),
        lastModified: p.updated,
        changeFrequency: "monthly" as const,
        priority: 0.5,
        alternates: { languages: alternateLanguages(p.path) },
      })),
  ]);
}
