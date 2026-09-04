import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { alternateLanguages, localeHref, routes } from "@/lib/meta";

/**
 * Every route, in every locale, with `xhtml:link` hreflang alternates.
 *
 * The path list used to live here as a hand-maintained array, which made every
 * new page two edits — and the forgotten second edit is silent. `routes` in
 * `lib/meta.ts` is now the single manifest; adding a page there adds it here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    routes.map((route) => ({
      url: localeHref(locale, route.path),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      // Includes x-default, pointing at the Arabic page — see lib/meta.ts.
      alternates: { languages: alternateLanguages(route.path) },
    })),
  );
}
