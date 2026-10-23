import AxeBuilder from "@axe-core/playwright";
import { NOINDEX_PATHS, routes } from "@/lib/routes";
import { expect, hydrated, LOCALES, test } from "./fixtures";

/*
 * axe-core on every page in both locales, against WCAG 2.2 A and AA: what a
 * machine can find (names, roles, contrast, lang and dir, landmarks, labels).
 * It does not replace a person with a screen reader, but it keeps the pages
 * from sliding back once they pass.
 *
 * Reduced motion on purpose: the scroll reveals start at opacity 0, and axe
 * would measure the contrast of text caught mid-fade. With the media query
 * set, the hero is still and the scroll reveals never arm (app/globals.css),
 * so axe sees the page as it rests.
 */

const PATHS = [...routes.map((r) => r.path), ...NOINDEX_PATHS];
const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"];

/*
 * The step cards' watermark numerals (/how-it-works, /about): 60 px digits in
 * the hairline colour behind each card, aria-hidden, unselectable, and
 * repeating the order the <ol> already gives. Pure decoration, which WCAG
 * 1.4.3 exempts; axe cannot tell, so they are left out of the scan by the
 * class pair that draws them. Anything else in that colour is still checked.
 */
const DECORATION = '[aria-hidden="true"].text-line-soft';

for (const locale of LOCALES) {
  for (const path of PATHS) {
    test(`${locale}${path || "/"}: no WCAG 2.2 AA violation axe can find`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/${locale}${path}`);
      await hydrated(page);

      const { violations } = await new AxeBuilder({ page }).withTags(WCAG).exclude(DECORATION).analyze();
      const found = violations.map(
        (v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 5).map((n) => n.target.join(" ")).join(" | ")}`,
      );
      expect(found).toEqual([]);
    });
  }
}
