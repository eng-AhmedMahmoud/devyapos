import { gzipSync } from "node:zlib";
import { routing } from "@/i18n/routing";
import { buildSearchIndex } from "@/lib/docs";

/**
 * The help centre's search index for one locale, built from the article trees
 * at build time and served as a static file (`/ar/docs/search.json`). The
 * search box fetches it on first focus (components/docs/DocsSearch.tsx).
 *
 * It ships gzipped: `next start` compresses pages but not route handlers, and
 * the full-text index is ~0.5 MB raw against ~0.12 MB gzipped. It is
 * prerendered once, so it can't negotiate — every browser's fetch accepts
 * gzip, and `Vary` keeps caches honest. It is data for the search box, not
 * a page: `X-Robots-Tag: noindex` keeps it out of search results.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(_: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const body = gzipSync(JSON.stringify(buildSearchIndex(locale)), { level: 9 });
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Encoding": "gzip",
      Vary: "Accept-Encoding",
      "Cache-Control": "public, max-age=3600, must-revalidate",
      "X-Robots-Tag": "noindex",
    },
  });
}
