import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { brandName } from "@/lib/brand";
import { Arrow } from "@/components/icons";
import { Container } from "@/components/Section";

/**
 * The 404 inside a locale: what a page under /ar or /en renders when it calls
 * notFound(). Unknown URLs never get here — they match no page and get
 * app/global-not-found.tsx.
 *
 * Its head would otherwise be the locale layout's, which is the home page's:
 * a 404 declaring itself the canonical home page and its hreflang twins.
 * Next adds `noindex` to any 404; it is stated here too so the intent
 * survives a refactor.
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = getContent(locale);
  return {
    title: `${c.notFound.title} | ${brandName(locale)}`,
    description: c.notFound.body,
    robots: { index: false, follow: true },
    alternates: { canonical: null, languages: {} },
    openGraph: null,
    twitter: null,
  };
}

export default async function NotFound() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section className="hero-wash flex min-h-[70vh] items-center py-24">
      <Container className="flex flex-col items-center text-center">
        <span className="font-display text-6xl text-band">404</span>
        <h1 className="font-display mt-4 text-2xl text-ink">
          {c.notFound.title}
        </h1>
        <p className="mt-3 max-w-md text-ink-dim">{c.notFound.body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary">
            {c.notFound.cta}
            <Arrow width={18} height={18} className="flip-rtl" />
          </Link>
          <Link href="/pricing" className="btn btn-ghost bg-surface">
            {c.nav.links[3].label}
          </Link>
        </div>
      </Container>
    </section>
  );
}
