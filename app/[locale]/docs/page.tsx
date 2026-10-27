import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import JsonLd from "@/components/JsonLd";
import Icon from "@/components/docs/DocIcon";
import DocsSearch from "@/components/docs/DocsSearch";
import HelpCta from "@/components/docs/HelpCta";
import { Link } from "@/i18n/navigation";
import { articleHref, categoriesByGroup, categoryHref, getDocs, resolveRef } from "@/lib/docs";
import { plainText } from "@/lib/docs/inline";
import { docsPageJsonLd } from "@/lib/docs/jsonld";
import { docsMetadata } from "@/lib/docs/meta";
import { plural } from "@/lib/docs/plural";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return docsMetadata(locale);
}

/**
 * The help centre's front page, laid out as the Moving family's umbrella help
 * centre is (movingsystems.tech/docs): search first, with the most-read
 * articles under it; then the numbered way in for a new restaurant; then
 * every category, grouped by who reads it — the owner setting up, the team
 * on a working day, the numbers and what connects to them.
 */
export default async function DocsHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const docs = getDocs(locale);
  const { ui } = docs;
  const resolve = (refs: string[]) =>
    refs.flatMap((ref) => {
      const hit = resolveRef(docs, ref);
      return hit ? [hit] : [];
    });
  const popular = resolve(docs.popular);
  const start = resolve(docs.startHere);
  const first = docs.categories[0];

  return (
    <>
      <JsonLd data={docsPageJsonLd(locale)} />

      <section aria-labelledby="docs-title" className="grid-paper border-b border-line [--cell:2.5rem]">
        <div className="doc-wrap flex flex-col gap-8 pt-12 pb-14 sm:pt-16 lg:pt-20 lg:pb-20">
          <p className="doc-label flex items-center gap-3 text-ink-dim">
            <span aria-hidden="true" className="size-2.5 shrink-0 bg-saffron" />
            <span className="t-index text-ink">00</span>
            <span>{ui.eyebrow}</span>
          </p>
          <div className="flex max-w-4xl flex-col gap-5">
            <h1 id="docs-title" className="doc-display doc-h2 text-ink">
              {ui.title}
            </h1>
            <p className="doc-lede max-w-2xl">{ui.subtitle}</p>
          </div>
          <div className="max-w-3xl">
            <DocsSearch locale={locale} ui={ui.search} size="hero" />
          </div>
          {popular.length ? (
            <div className="flex flex-col gap-3">
              <h2 className="doc-label text-ink-dim">{ui.popular}</h2>
              <ul className="flex flex-wrap gap-2">
                {popular.map(({ category, article }) => (
                  <li key={`${category.id}/${article.slug}`}>
                    <Link
                      href={articleHref(category.id, article.slug)}
                      className="inline-flex min-h-11 items-center border border-line-strong bg-bg px-3 text-sm text-ink hover:border-ink"
                    >
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="start-title" className="doc-section pb-0">
        <div className="doc-wrap flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="start-title" className="doc-display text-3xl text-ink sm:text-4xl">
              {ui.startHere}
            </h2>
            <Link href={categoryHref(first.id)} className="doc-more inline-flex items-center gap-2 font-semibold text-ink">
              {ui.startAll}
              <Icon name="arrow" size={16} className="doc-arrow" />
            </Link>
          </div>
          <ol className="grid border-s border-t border-line-strong sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {start.map(({ category, article }, i) => (
              <li key={`${category.id}/${article.slug}`} className="border-e border-b border-line-strong">
                <Link href={articleHref(category.id, article.slug)} className="doc-card flex h-full flex-col gap-4 p-6">
                  <span className="t-index text-sm text-ink-dim">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-xl leading-snug font-semibold text-ink">{article.title}</span>
                  <span className="text-[0.9375rem] leading-relaxed text-ink-dim">{plainText(article.summary)}</span>
                  <span className="mt-auto inline-flex text-ink">
                    <Icon name="arrow" size={18} className="doc-arrow" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {categoriesByGroup(docs).map(({ group, categories }, g) => (
        <section
          key={group}
          id={group}
          aria-labelledby={`${group}-title`}
          className={`doc-section ${g % 2 === 1 ? "band-cream" : ""}`}
        >
          <div className="doc-wrap flex flex-col gap-10">
            <header className="grid gap-4 border-t border-line-strong pt-6 lg:grid-cols-12 lg:gap-8">
              <p className="doc-label flex items-baseline gap-3 text-ink-dim lg:col-span-3">
                <span className="t-index text-ink">{String(g + 1).padStart(2, "0")}</span>
                <span>{ui.groups[group].title}</span>
              </p>
              <div className="flex flex-col gap-3 lg:col-span-9">
                <h2 id={`${group}-title`} className="doc-display text-3xl text-ink sm:text-4xl">
                  {ui.groups[group].title}
                </h2>
                <p className="doc-lede max-w-2xl">{ui.groups[group].body}</p>
              </div>
            </header>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => (
                <li key={c.id} className="flex flex-col border border-line-strong bg-bg">
                  <Link href={categoryHref(c.id)} className="doc-card flex flex-col gap-4 p-6 pb-4">
                    <span className="flex items-center justify-between gap-3">
                      <span className="doc-tile inline-flex size-11 items-center justify-center bg-saffron text-on-saffron">
                        <Icon name={c.icon} size={22} />
                      </span>
                      <span className="doc-label text-ink-dim">
                        {plural(locale, ui.articleCount, c.articles.length)}
                      </span>
                    </span>
                    <span className="font-display text-xl font-semibold text-ink">{c.title}</span>
                    <span className="text-[0.9375rem] leading-relaxed text-ink-dim">{c.description}</span>
                  </Link>
                  <ul className="mt-auto flex flex-col border-t border-line px-6 py-3">
                    {c.articles.slice(0, 3).map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={articleHref(c.id, a.slug)}
                          className="flex min-h-11 items-center gap-2 py-1 text-sm text-ink hover:underline hover:decoration-saffron hover:decoration-2 hover:underline-offset-[0.35em]"
                        >
                          <Icon name="chevron" size={12} className="doc-arrow text-ink-dim" />
                          {a.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="doc-wrap pb-16 sm:pb-24">
        <HelpCta ui={ui} />
      </section>
    </>
  );
}
