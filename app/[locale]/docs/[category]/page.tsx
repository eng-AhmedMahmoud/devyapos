import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/docs/Breadcrumbs";
import DocsBar from "@/components/docs/DocsBar";
import HelpCta from "@/components/docs/HelpCta";
import Sidebar from "@/components/docs/Sidebar";
import Icon from "@/components/docs/DocIcon";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { articleHref, docsTrail, findCategory, getDocs } from "@/lib/docs";
import { docsPageJsonLd } from "@/lib/docs/jsonld";
import { plainText } from "@/lib/docs/inline";
import { categoryMetadata } from "@/lib/docs/meta";
import { plural } from "@/lib/docs/plural";

type Params = { locale: string; category: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getDocs(locale).categories.map((c) => ({ locale, category: c.id })),
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, category: id } = await params;
  return categoryMetadata(locale, id);
}

/** One category: its articles in reading order, each with its summary. */
export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { locale, category: id } = await params;
  setRequestLocale(locale);
  const docs = getDocs(locale);
  const category = findCategory(docs, id);
  if (!category) notFound();
  const { ui } = docs;
  const crumbs = docsTrail(docs, category.id);

  return (
    <>
      <JsonLd data={docsPageJsonLd(locale, category.id)} />
      <DocsBar docs={docs} locale={locale} />
      <div className="doc-wrap grid gap-8 py-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12 lg:py-12">
        <aside className="no-print">
          <Sidebar docs={docs} current={{ category: category.id }} />
        </aside>
        <div className="flex min-w-0 flex-col gap-10">
          <header className="flex flex-col gap-5">
            <Breadcrumbs items={crumbs} label={ui.breadcrumb} />
            <div className="flex items-start gap-5">
              <span className="inline-flex size-14 shrink-0 items-center justify-center bg-saffron text-on-saffron">
                <Icon name={category.icon} size={28} />
              </span>
              <div className="flex flex-col gap-3">
                <p className="doc-label text-ink-dim">
                  {ui.groups[category.group].title} ·{" "}
                  {plural(locale, ui.articleCount, category.articles.length)}
                </p>
                <h1 className="doc-display text-4xl text-ink sm:text-5xl">{category.title}</h1>
                <p className="doc-lede max-w-2xl">{category.description}</p>
              </div>
            </div>
          </header>

          <ol className="flex flex-col border-t border-line-strong">
            {category.articles.map((a, i) => (
              <li key={a.slug} className="border-b border-line-strong">
                <Link
                  href={articleHref(category.id, a.slug)}
                  className="doc-card group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-start gap-4 px-1 py-6 sm:gap-6"
                >
                  <span className="t-index pt-1 text-sm text-ink-dim">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex flex-col gap-2">
                    <span className="font-display text-xl leading-snug font-semibold text-ink sm:text-2xl">
                      {a.title}
                    </span>
                    <span className="max-w-3xl leading-relaxed text-ink-dim">{plainText(a.summary)}</span>
                  </span>
                  <Icon name="arrow" size={18} className="doc-arrow mt-2 text-ink" />
                </Link>
              </li>
            ))}
          </ol>

          <HelpCta ui={ui} topic={category.title} />
        </div>
      </div>
    </>
  );
}
