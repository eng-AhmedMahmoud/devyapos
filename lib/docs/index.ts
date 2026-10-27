import { docsMap } from "@/content/docs";
import type {
  DocArticle,
  DocBlock,
  DocCategory,
  DocGroup,
  DocsContent,
  DocShot,
} from "@/content/docs/types";
import type { Locale } from "@/i18n/routing";
import { plainText } from "./inline";
import type { SearchEntry } from "./search";

/** The help centre lives under this path in every locale. */
export const DOCS_BASE = "/docs";

/** The help centre tree for a locale. Unknown locales fall back to Arabic, like the page copy. */
export function getDocs(locale: string): DocsContent {
  return docsMap[locale as Locale] ?? docsMap.ar;
}

export function categoryHref(category: string) {
  return `${DOCS_BASE}/${category}`;
}

export function articleHref(category: string, slug: string) {
  return `${DOCS_BASE}/${category}/${slug}`;
}

/** Reader groups in the order the help centre presents them. */
export const GROUP_ORDER: readonly DocGroup[] = ["setup", "daily", "grow"];

export function categoriesByGroup(docs: DocsContent) {
  return GROUP_ORDER.map((group) => ({
    group,
    categories: docs.categories.filter((c) => c.group === group),
  })).filter((g) => g.categories.length > 0);
}

export function findCategory(docs: DocsContent, id: string): DocCategory | undefined {
  return docs.categories.find((c) => c.id === id);
}

export interface ArticleLocation {
  category: DocCategory;
  article: DocArticle;
  /** Neighbours in reading order across the whole help centre. */
  previous?: { category: DocCategory; article: DocArticle };
  next?: { category: DocCategory; article: DocArticle };
}

/** Every article in reading order, each with its category. */
export function allArticles(docs: DocsContent) {
  return docs.categories.flatMap((category) =>
    category.articles.map((article) => ({ category, article })),
  );
}

export function findArticle(
  docs: DocsContent,
  categoryId: string,
  slug: string,
): ArticleLocation | undefined {
  const all = allArticles(docs);
  const i = all.findIndex((a) => a.category.id === categoryId && a.article.slug === slug);
  if (i === -1) return undefined;
  return { ...all[i], previous: all[i - 1], next: all[i + 1] };
}

/** One step of a help-centre trail (components/docs/Breadcrumbs, and the BreadcrumbList). */
export interface Crumb {
  label: string;
  /** Locale-less path; the last crumb (the current page) has none. */
  href?: string;
}

/**
 * The trail a help-centre page shows: the help centre, then the category,
 * then the article — the current page last, without a link. Unknown ids
 * stop the trail where they are.
 */
export function docsTrail(docs: DocsContent, categoryId?: string, slug?: string): Crumb[] {
  const category = categoryId ? findCategory(docs, categoryId) : undefined;
  const article = slug ? category?.articles.find((a) => a.slug === slug) : undefined;
  if (!category) return [{ label: docs.ui.name }];
  if (!article) return [{ label: docs.ui.name, href: DOCS_BASE }, { label: category.title }];
  return [
    { label: docs.ui.name, href: DOCS_BASE },
    { label: category.title, href: categoryHref(category.id) },
    { label: article.title },
  ];
}

/** Resolves a "category/slug" reference, as `related` lists them. */
export function resolveRef(docs: DocsContent, ref: string) {
  const [categoryId, slug] = ref.split("/");
  const category = findCategory(docs, categoryId);
  const article = category?.articles.find((a) => a.slug === slug);
  return category && article ? { category, article } : undefined;
}

/** The article's sections, for the "on this page" list. */
export function sections(article: DocArticle) {
  return article.body.flatMap((b) => (b.t === "h2" ? [{ id: b.id, text: plainText(b.text) }] : []));
}

/** Every screenshot slot in an article, in order. */
export function articleShots(article: DocArticle): DocShot[] {
  return article.body.flatMap((b): DocShot[] => {
    if (b.t === "shot") return [b.shot];
    if (b.t === "steps") return b.items.flatMap((s) => (s.shot ? [s.shot] : []));
    return [];
  });
}

/** Every string of prose in a block, marks included. */
export function blockText(b: DocBlock): string[] {
  switch (b.t) {
    case "p":
    case "h2":
    case "h3":
    case "callout":
      return [b.text];
    case "list":
      return b.items;
    case "steps":
      return b.items.flatMap((s) => [s.title, s.body ?? "", s.shot?.caption ?? ""]);
    case "shot":
      return [b.shot.caption];
    case "table":
      return [...b.head, ...b.rows.flat()];
    case "qa":
      return b.items.flatMap((i) => [i.q, i.a]);
  }
}

/** Every page of the help centre below the locale, for the sitemap: home, categories, articles. */
export function docsPaths(locale: string): { path: string; updated: string }[] {
  const docs = getDocs(locale);
  const newest = (dates: string[]) => dates.reduce((a, b) => (b > a ? b : a));
  return [
    { path: DOCS_BASE, updated: newest(allArticles(docs).map((a) => a.article.reviewed)) },
    ...docs.categories.flatMap((c) => [
      { path: categoryHref(c.id), updated: newest(c.articles.map((a) => a.reviewed)) },
      ...c.articles.map((a) => ({ path: articleHref(c.id, a.slug), updated: a.reviewed })),
    ]),
  ];
}

/** The search index for a locale: one entry per article, marks stripped. */
export function buildSearchIndex(locale: string): SearchEntry[] {
  const docs = getDocs(locale);
  return allArticles(docs).map(({ category, article }) => {
    const heads = article.body.flatMap((b) => {
      if (b.t === "h2" || b.t === "h3") return [b.text];
      if (b.t === "steps") return b.items.map((s) => s.title);
      if (b.t === "qa") return b.items.map((i) => i.q);
      return [];
    });
    const body = article.body
      .filter((b) => b.t !== "h2" && b.t !== "h3")
      .flatMap(blockText)
      .concat(article.before);
    return {
      href: articleHref(category.id, article.slug),
      title: article.title,
      category: category.title,
      summary: plainText(article.summary),
      heads: heads.map(plainText).join(" · "),
      keywords: article.keywords.join(" · "),
      body: body.map(plainText).join(" "),
    };
  });
}
