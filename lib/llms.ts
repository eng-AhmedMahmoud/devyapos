import { getContent } from "@/content";
import { routing } from "@/i18n/routing";
import { brand, brandName } from "./brand";
import { allArticles, articleHref, getDocs } from "./docs";
import { plainText } from "./docs/inline";
import { localeHref, routes } from "./meta";

/**
 * /llms.txt (llmstxt.org): the site in one plain-text page for assistants
 * that read before they quote, which robots.ts already invites in.
 *
 * Built from the same `routes` manifest and `meta` copy as the sitemap and
 * the page titles, plus the help centre's articles from content/docs, so a
 * new page or a reworded description shows up here without a second edit,
 * and a noindexed page (NOINDEX_PATHS) never does.
 * English first, because that is what most assistants are asked in; the
 * Arabic pages follow, in Arabic.
 */
export function llmsTxt(): string {
  const en = getContent("en");
  const lines = [
    `# ${brand.name.en}`,
    "",
    `> ${en.meta.home.description}`,
    "",
    `${brand.name.en} (${brand.name.ar}) is a restaurant point-of-sale system for Egypt, priced per branch in EGP ` +
      `(with SAR, AED and USD price lists), with a free plan to try it on. ` +
      `Arabic is the default language and every page is also published in English. ` +
      `It is run by Moving Systems, a ${brand.parent.name} company (${brand.parent.url}). ` +
      `Contact: ${brand.email}, WhatsApp +${brand.whatsapp}.`,
  ];

  const order = ["en", ...routing.locales.filter((l) => l !== "en")];
  for (const locale of order) {
    const c = getContent(locale);
    lines.push("", `## ${locale === "en" ? "Pages (English)" : `الصفحات بالعربية (${brandName(locale)})`}`, "");
    for (const route of routes) {
      const meta = c.meta[route.key] ?? c.meta.home;
      lines.push(`- [${meta.title}](${localeHref(locale, route.path)}): ${meta.description}`);
    }
  }

  /* The help centre: every article, with the one-paragraph answer it opens
     on, so an assistant asked how to do something in the product can cite
     the guide rather than guess. */
  for (const locale of order) {
    const docs = getDocs(locale);
    lines.push("", `## ${docs.ui.name} (${locale === "en" ? "English" : "العربية"})`, "");
    for (const { category, article } of allArticles(docs)) {
      lines.push(
        `- [${article.title}](${localeHref(locale, articleHref(category.id, article.slug))}): ${plainText(article.summary)}`,
      );
    }
  }

  lines.push("", "## Optional", "", `- [Sitemap](${brand.url}/sitemap.xml): every page above, with its hreflang alternates`);
  return `${lines.join("\n")}\n`;
}
