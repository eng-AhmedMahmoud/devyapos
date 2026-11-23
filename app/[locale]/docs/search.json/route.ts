import { routing } from "@/i18n/routing";
import { buildSearchIndex } from "@/lib/docs";

/**
 * The help centre's search index for one locale, built from the article trees
 * at build time and served as a static file (`/ar/docs/search.json`). The
 * search box fetches it on first focus (components/docs/DocsSearch.tsx).
 *
 * It is sent as plain JSON and the server compresses it (~0.5 MB raw against
 * ~0.12 MB gzipped). Since Next 16.4.6 `next start` compresses route handlers
 * too and drops a handler's own Content-Encoding, so a body gzipped here
 * reached the browser gzipped twice and the search box read bytes, not JSON.
 * `Vary` keeps caches honest. It is data for the search box, not a page:
 * `X-Robots-Tag: noindex` keeps it out of search results.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(_: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return new Response(JSON.stringify(buildSearchIndex(locale)), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Vary: "Accept-Encoding",
      "Cache-Control": "public, max-age=3600, must-revalidate",
      "X-Robots-Tag": "noindex",
    },
  });
}
