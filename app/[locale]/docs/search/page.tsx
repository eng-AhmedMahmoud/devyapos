import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import DocsBar from "@/components/docs/DocsBar";
import HelpCta from "@/components/docs/HelpCta";
import SearchResults from "@/components/docs/SearchResults";
import Icon from "@/components/docs/DocIcon";
import { Link } from "@/i18n/navigation";
import { articleHref, DOCS_BASE, getDocs, resolveRef } from "@/lib/docs";
import { searchMetadata } from "@/lib/docs/meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return searchMetadata(locale);
}

/**
 * Where the search box submits (`?q=`). The page is static; the results are
 * ranked in the browser from the same index the box uses. Under them, the
 * popular articles, so an empty result still leads somewhere.
 */
export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const docs = getDocs(locale);
  const { ui } = docs;
  const popular = docs.popular.flatMap((ref) => {
    const hit = resolveRef(docs, ref);
    return hit ? [hit] : [];
  });

  return (
    <>
      <DocsBar docs={docs} locale={locale} />
      <div className="doc-wrap flex flex-col gap-10 py-10 lg:py-14">
        <header className="flex flex-col gap-5">
          <Breadcrumbs
            items={[{ label: ui.name, href: DOCS_BASE }, { label: ui.searchPage.title }]}
            label={ui.breadcrumb}
          />
          <h1 className="doc-display text-4xl text-ink sm:text-5xl">{ui.searchPage.title}</h1>
        </header>
        <Suspense fallback={<p className="doc-lede">{ui.search.loading}</p>}>
          <SearchResults locale={locale} ui={ui.search} />
        </Suspense>
        <section aria-labelledby="popular-title" className="flex flex-col gap-4">
          <h2 id="popular-title" className="doc-label text-ink-dim">
            {ui.popular}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map(({ category, article }) => (
              <li key={`${category.id}/${article.slug}`}>
                <Link
                  href={articleHref(category.id, article.slug)}
                  className="doc-card flex h-full items-center justify-between gap-3 border border-line-strong p-4"
                >
                  <span className="flex flex-col gap-1">
                    <span className="text-xs text-ink-dim">{category.title}</span>
                    <span className="font-medium text-ink">{article.title}</span>
                  </span>
                  <Icon name="arrow" size={16} className="doc-arrow text-ink" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <HelpCta ui={ui} />
      </div>
    </>
  );
}
