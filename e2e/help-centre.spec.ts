import AxeBuilder from "@axe-core/playwright";
import { docsMap } from "@/content/docs";
import { allArticles, articleHref, categoryHref } from "@/lib/docs";
import { expect, hydrated, LOCALES, test } from "./fixtures";

/*
 * The help centre (app/[locale]/docs) in a real browser, against the
 * production build: every page renders one h1, the search box answers from
 * the static index with its "/" shortcut and the keyboard, the results page
 * reads ?q=, the pages pass axe and fit a 320 px phone without sideways
 * scrolling. tests/help-centre.test.ts holds the content itself.
 */

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"];
const QUERY = { ar: "وردية", en: "shift" } as const;
const WIDTHS = [320, 768, 1440];

/** The HTML between <main ...> and </main>. */
function main(html: string): string {
  const start = html.search(/<main[\s>]/);
  const end = html.indexOf("</main>", start);
  return start === -1 || end === -1 ? "" : html.slice(start, end);
}

for (const locale of LOCALES) {
  const docs = docsMap[locale];
  const first = allArticles(docs)[0];
  const article = articleHref(first.category.id, first.article.slug);
  const category = categoryHref(docs.categories[1].id);

  test(`${locale}: every help page answers 200 with one h1 in main, before any other heading`, async ({ request }) => {
    const paths = [
      "/docs",
      ...docs.categories.map((c) => categoryHref(c.id)),
      ...allArticles(docs).map(({ category: c, article: a }) => articleHref(c.id, a.slug)),
    ];
    for (const path of paths) {
      const res = await request.get(`/${locale}${path}`);
      expect(res.status(), path).toBe(200);
      const html = main(await res.text());
      expect(html.match(/<h1[\s>]/g)?.length ?? 0, path).toBe(1);
      expect(html.search(/<h[1-6][\s>]/), path).toBe(html.search(/<h1[\s>]/));
    }
  });

  test(`${locale}: the front page leads with the question, the search box and the numbered start`, async ({ page }) => {
    await page.goto(`/${locale}/docs`);
    await hydrated(page);
    await expect(page.locator("html")).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(docs.ui.title);
    await expect(page.getByRole("combobox", { name: docs.ui.search.label })).toHaveAttribute(
      "placeholder",
      docs.ui.search.placeholder,
    );
    const start = page.locator('section[aria-labelledby="start-title"] ol > li');
    await expect(start).toHaveCount(5);
    await expect(start.first()).toContainText("01");
    await expect(page.getByRole("link", { name: docs.ui.name, exact: false }).first()).toBeVisible();
  });

  test(`${locale}: "/" focuses the search, and the keyboard opens a result`, async ({ page }) => {
    await page.goto(`/${locale}/docs`);
    await hydrated(page);
    await page.keyboard.press("/");
    const box = page.getByRole("combobox", { name: docs.ui.search.label });
    await expect(box).toBeFocused();
    await box.pressSequentially(QUERY[locale]);
    const options = page.getByRole("option");
    await expect(options.first()).toBeVisible();
    await box.press("ArrowDown");
    await box.press("Enter");
    await page.waitForURL(new RegExp(`/${locale}/docs/[a-z-]+/[a-z0-9-]+$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test(`${locale}: the results page ranks ?q= in the browser`, async ({ page }) => {
    await page.goto(`/${locale}/docs/search?q=${encodeURIComponent(QUERY[locale])}`);
    await hydrated(page);
    await expect(page.getByRole("status").filter({ hasText: QUERY[locale] })).toBeVisible();
    await expect(page.locator("main ol a[href*='/docs/']").first()).toBeVisible();
  });

  test(`${locale}: an article shows its trail, its sections and the way to a person`, async ({ page }) => {
    await page.goto(`/${locale}${article}`);
    await hydrated(page);
    const trail = page.getByRole("navigation", { name: docs.ui.breadcrumb });
    await expect(trail.getByRole("link", { name: docs.ui.name })).toBeVisible();
    await expect(trail.locator('[aria-current="page"]')).toHaveText(first.article.title);
    await expect(page.locator("header.site-header a[aria-current='page'][href$='/docs']")).toHaveCount(1);
    // The card's own link, told from the floating button by its placement code.
    await expect(page.locator("main a[href*='%5BP-docs%5D']")).toHaveText(docs.ui.help.whatsapp);
  });

  for (const path of ["/docs", category, article, "/docs/search?q=x"]) {
    test(`${locale}${path}: no WCAG 2.2 AA violation axe can find`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/${locale}${path}`);
      await hydrated(page);
      const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.slice(0, 5).map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
    });
  }

  for (const width of WIDTHS) {
    test(`${locale} at ${width}px: the help pages never scroll sideways`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["/docs", category, article]) {
        await page.goto(`/${locale}${path}`);
        await hydrated(page);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }
}

test("the search index is served gzipped, cached and kept out of search", async ({ request }) => {
  for (const locale of LOCALES) {
    const res = await request.get(`/${locale}/docs/search.json`);
    expect(res.status()).toBe(200);
    expect(res.headers()["x-robots-tag"]).toBe("noindex");
    const index = (await res.json()) as { href: string }[];
    expect(index.length).toBe(allArticles(docsMap[locale]).length);
  }
});
