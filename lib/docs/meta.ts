import type { Metadata } from "next";
import { brandName } from "@/lib/brand";
import { buildMetadata } from "@/lib/meta";
import { articleHref, categoryHref, DOCS_BASE, findArticle, findCategory, getDocs } from "./index";
import { plainText } from "./inline";

/**
 * The help centre's page metadata, on the site's own builder (lib/meta.ts):
 * the same canonical, hreflang, Open Graph and X tags as every marketing
 * page. Its front page is a route like any other (`routes`, key "docs"); its
 * categories and articles title and describe themselves from content/docs,
 * and share the help centre's card.
 */

/** Where the search box submits. A real page, kept out of the index. */
export const SEARCH_PATH = `${DOCS_BASE}/search`;

/** The limits tests/seo.test.ts holds every page to. */
export const TITLE_MAX = 65;
export const DESCRIPTION_MIN = 70;
export const DESCRIPTION_MAX = 160;

const length = (s: string) => [...s].length;

/** Cuts at the last space before `max - 1` code points and ends in an ellipsis. */
function clipWords(s: string, max: number): string {
  const head = [...s].slice(0, max - 1).join("");
  const cut = head.lastIndexOf(" ");
  const kept = cut > 0 ? head.slice(0, cut) : head;
  return `${kept.replace(/[\s,،;؛:—–|-]+$/u, "")}…`;
}

/**
 * "Article | Help centre | Moving POS" when it fits in 65 characters, then
 * "Article | Moving POS", then the title alone — the site's own "Page |
 * Moving POS" pattern with the section between them when there is room.
 */
export function pageTitle(locale: string, title: string, section?: string): string {
  const name = brandName(locale);
  if (section) {
    const full = `${title} | ${section} | ${name}`;
    if (length(full) <= TITLE_MAX) return full;
  }
  const short = `${title} | ${name}`;
  if (length(short) <= TITLE_MAX) return short;
  return length(title) <= TITLE_MAX ? title : clipWords(title, TITLE_MAX);
}

/** A description of at most 160 code points, cut at a word, marks removed. */
export function metaDescription(text: string): string {
  const s = plainText(text).replace(/\s+/g, " ").trim();
  return length(s) <= DESCRIPTION_MAX ? s : clipWords(s, DESCRIPTION_MAX);
}

const GUIDES = { ar: { lead: "من أدلته", list: "؛ " }, en: { lead: "Guides", list: "; " } } as const;

/**
 * A category's description, and when that is too short for a result, the
 * titles of its first articles after it.
 */
export function categoryDescription(locale: string, categoryId: string): string | undefined {
  const category = findCategory(getDocs(locale), categoryId);
  if (!category) return undefined;
  const own = plainText(category.description);
  if (length(own) >= DESCRIPTION_MIN) return metaDescription(own);
  const words = GUIDES[locale === "en" ? "en" : "ar"];
  const titles: string[] = [];
  for (const { title } of category.articles) {
    const next = `${own} ${words.lead}: ${[...titles, title].join(words.list)}.`;
    if (titles.length > 0 && length(next) > DESCRIPTION_MAX) break;
    titles.push(title);
  }
  return metaDescription(`${own} ${words.lead}: ${titles.join(words.list)}.`);
}

/** The help centre's front page: a route like any other. */
export function docsMetadata(locale: string): Metadata {
  return buildMetadata(locale, "docs", DOCS_BASE);
}

export function categoryMetadata(locale: string, categoryId: string): Metadata {
  const docs = getDocs(locale);
  const category = findCategory(docs, categoryId);
  if (!category) return {};
  return buildMetadata(locale, "docs", categoryHref(categoryId), {
    title: pageTitle(locale, category.title, docs.ui.name),
    description: categoryDescription(locale, categoryId)!,
    card: DOCS_BASE,
  });
}

export function articleMetadata(locale: string, categoryId: string, slug: string): Metadata {
  const docs = getDocs(locale);
  const hit = findArticle(docs, categoryId, slug);
  if (!hit) return {};
  return buildMetadata(locale, "docs", articleHref(categoryId, slug), {
    title: pageTitle(locale, hit.article.title, docs.ui.name),
    description: metaDescription(hit.article.summary),
    type: "article",
    modified: hit.article.reviewed,
    card: DOCS_BASE,
  });
}

/** The search results page: a real page, noindex. */
export function searchMetadata(locale: string): Metadata {
  const docs = getDocs(locale);
  return buildMetadata(locale, "docs", SEARCH_PATH, {
    title: pageTitle(locale, docs.ui.searchPage.title, docs.ui.name),
    description: metaDescription(docs.ui.subtitle),
    noindex: true,
    card: DOCS_BASE,
  });
}
