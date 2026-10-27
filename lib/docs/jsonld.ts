import { brand, brandName } from "@/lib/brand";
import { ORG_ID, WEBSITE_ID, type JsonLdNode } from "@/lib/jsonld";
import { localeHref, ogImageUrl } from "@/lib/meta";
import {
  articleHref,
  articleShots,
  categoryHref,
  DOCS_BASE,
  docsTrail,
  findArticle,
  getDocs,
  type Crumb,
} from "./index";
import { plainText } from "./inline";
import { capturedShot } from "./shots";

/**
 * The help centre's structured data, on the site's graph (lib/jsonld.ts):
 * the same Organization and WebSite ids, a BreadcrumbList that is the trail
 * the page prints, and for an article a TechArticle plus an FAQPage for its
 * question-and-answer blocks.
 */

/** Home, then the trail the page prints (components/docs/Breadcrumbs). */
function breadcrumbs(locale: string, trail: Crumb[], path: string): JsonLdNode {
  const items = [{ label: brandName(locale), href: "" as string | undefined }, ...trail];
  return {
    "@type": "BreadcrumbList",
    "@id": `${localeHref(locale, path)}#breadcrumb`,
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      // The current page is the last crumb and has no href of its own.
      item: localeHref(locale, c.href ?? path),
    })),
  };
}

/** The help centre's front page and its categories: the trail. */
export function docsPageJsonLd(locale: string, categoryId?: string): JsonLdNode[] {
  const docs = getDocs(locale);
  const path = categoryId ? categoryHref(categoryId) : DOCS_BASE;
  return [breadcrumbs(locale, docsTrail(docs, categoryId), path)];
}

/** Absolute URLs of an article's captured screenshots, in order. */
function articleImages(locale: string, shots: ReturnType<typeof articleShots>): string[] {
  return [
    ...new Set(
      shots.flatMap((s) => {
        const img = capturedShot(s.id, locale);
        const main = img?.desktop ?? img?.phone;
        return main ? [`${brand.url}${main.src}`] : [];
      }),
    ),
  ];
}

/** Question-and-answer blocks as an FAQPage, built from the text the page renders, marks removed. */
export function faqJsonLd(items: { q: string; a: string }[]): JsonLdNode {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: plainText(i.q),
      acceptedAnswer: { "@type": "Answer", text: plainText(i.a) },
    })),
  };
}

/**
 * An article page. `dateModified` is the day the article was last checked
 * against the product code; no author is invented — the publisher is the
 * organization — and no `datePublished`, because none is tracked. An article
 * without captures carries the help centre's card.
 */
export function articlePageJsonLd(locale: string, categoryId: string, slug: string): JsonLdNode[] {
  const docs = getDocs(locale);
  const hit = findArticle(docs, categoryId, slug);
  if (!hit) return [];
  const { category, article } = hit;
  const path = articleHref(category.id, article.slug);
  const url = localeHref(locale, path);
  const images = articleImages(locale, articleShots(article));
  const qa = article.body.flatMap((b) => (b.t === "qa" ? b.items : []));
  return [
    breadcrumbs(locale, docsTrail(docs, category.id, article.slug), path),
    {
      "@type": "TechArticle",
      "@id": `${url}#article`,
      headline: article.title,
      description: plainText(article.summary),
      inLanguage: locale,
      url,
      mainEntityOfPage: url,
      dateModified: article.reviewed,
      articleSection: category.title,
      image: images.length ? images : [ogImageUrl(locale, DOCS_BASE)],
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      isPartOf: { "@id": WEBSITE_ID },
    },
    ...(qa.length ? [faqJsonLd(qa)] : []),
  ];
}
