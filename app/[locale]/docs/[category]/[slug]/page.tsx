import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import JsonLd from "@/components/JsonLd";
import ArticleBody from "@/components/docs/ArticleBody";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import DocsBar from "@/components/docs/DocsBar";
import HelpCta from "@/components/docs/HelpCta";
import Inline from "@/components/docs/Inline";
import Sidebar from "@/components/docs/Sidebar";
import Toc from "@/components/docs/Toc";
import Icon from "@/components/docs/DocIcon";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { formatDate } from "@/lib/format";
import {
  allArticles,
  articleHref,
  docsTrail,
  findArticle,
  getDocs,
  resolveRef,
  sections,
} from "@/lib/docs";
import { articlePageJsonLd } from "@/lib/docs/jsonld";
import { articleMetadata } from "@/lib/docs/meta";

type Params = { locale: string; category: string; slug: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    allArticles(getDocs(locale)).map(({ category, article }) => ({
      locale,
      category: category.id,
      slug: article.slug,
    })),
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, category, slug } = await params;
  return articleMetadata(locale, category, slug);
}

/**
 * An article: the sidebar, the trail, the title and its one-paragraph answer,
 * what has to be true first, the steps with their screenshots, then related
 * reading, the neighbours in reading order and the way to a person.
 */
export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { locale, category: categoryId, slug } = await params;
  setRequestLocale(locale);
  const docs = getDocs(locale);
  const hit = findArticle(docs, categoryId, slug);
  if (!hit) notFound();
  const { category, article, previous, next } = hit;
  const { ui } = docs;
  const crumbs = docsTrail(docs, category.id, article.slug);
  const toc = sections(article);
  const related = article.related.flatMap((ref) => {
    const r = resolveRef(docs, ref);
    return r ? [r] : [];
  });

  return (
    <>
      <JsonLd data={articlePageJsonLd(locale, category.id, article.slug)} />
      <DocsBar docs={docs} locale={locale} />
      <div className="doc-wrap grid gap-8 py-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12 lg:py-12">
        <aside className="no-print">
          <Sidebar docs={docs} current={{ category: category.id, slug: article.slug }} />
        </aside>

        <article className="flex min-w-0 flex-col gap-10">
          <header className="flex flex-col gap-5">
            <Breadcrumbs items={crumbs} label={ui.breadcrumb} />
            <p className="doc-label flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-dim">
              <span className="inline-flex items-center gap-2 text-ink">
                <span aria-hidden="true" className="size-2 bg-saffron" />
                {ui.groups[category.group].title}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {ui.reviewed}{" "}
                <time dateTime={article.reviewed}>{formatDate(locale, article.reviewed)}</time>
              </span>
            </p>
            <h1 className="doc-display text-[2.25rem] text-ink sm:text-5xl">{article.title}</h1>
            <p className="doc-lede max-w-[62ch]">
              <Inline text={article.summary} />
            </p>
            <Toc title={ui.onThisPage} items={toc} />
          </header>

          {article.before.length ? (
            <section aria-label={ui.before} className="flex flex-col gap-3 border-s-2 border-saffron bg-surface p-5 ps-6">
              <p className="doc-label text-ink">{ui.before}</p>
              <ul className="flex flex-col gap-2">
                {article.before.map((b) => (
                  <li key={b} className="flex gap-3 leading-relaxed text-ink-dim">
                    <Icon name="check" size={18} className="mt-1 text-ink" />
                    <span>
                      <Inline text={b} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <ArticleBody article={article} ui={ui} locale={locale} />

          {related.length ? (
            <section aria-labelledby="related-title" className="flex flex-col gap-4 border-t border-line-strong pt-8">
              <h2 id="related-title" className="doc-label text-ink-dim">
                {ui.related}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={`${r.category.id}/${r.article.slug}`}>
                    <Link
                      href={articleHref(r.category.id, r.article.slug)}
                      className="doc-card flex h-full flex-col gap-1.5 border border-line-strong p-4"
                    >
                      <span className="text-xs text-ink-dim">{r.category.title}</span>
                      <span className="font-medium text-ink">{r.article.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <nav aria-label={`${ui.previous} / ${ui.next}`} className="grid gap-3 sm:grid-cols-2">
            {previous ? (
              <Link
                href={articleHref(previous.category.id, previous.article.slug)}
                rel="prev"
                className="doc-card flex flex-col gap-1.5 border border-line-strong p-4"
              >
                <span className="flex items-center gap-2 text-xs text-ink-dim">
                  <Icon name="arrow" size={14} className="doc-arrow -scale-x-100 rtl:scale-x-100" />
                  {ui.previous}
                </span>
                <span className="font-medium text-ink">{previous.article.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={articleHref(next.category.id, next.article.slug)}
                rel="next"
                className="doc-card flex flex-col items-end gap-1.5 border border-line-strong p-4 text-end"
              >
                <span className="flex items-center gap-2 text-xs text-ink-dim">
                  {ui.next}
                  <Icon name="arrow" size={14} className="doc-arrow" />
                </span>
                <span className="font-medium text-ink">{next.article.title}</span>
              </Link>
            ) : null}
          </nav>

          <HelpCta ui={ui} topic={article.title} />
        </article>
      </div>
    </>
  );
}
