import { expect, hydrated, LOCALES, test } from "./fixtures";

/**
 * The footer's credit as a visitor meets it on a built page: "A product of
 * Devya Solutions" / «أحد منتجات Devya Solutions», the name a link to
 * devya.dev that opens in a new tab without handing the opener over. The
 * words are spelled out here, not read from content/, so a change to the
 * copy has to be made twice on purpose (tests/parent.test.ts holds the tree).
 */

const CREDIT = {
  en: "A product of Devya Solutions",
  ar: "أحد منتجات Devya Solutions",
} as const;

const PARENT_LINK = 'a[href="https://devya.dev"]';

for (const locale of LOCALES) {
  test(`${locale}: the footer credits Devya Solutions as the product's maker, linked to devya.dev`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await hydrated(page);

    // The footer's only link to the parent's site is the credit's.
    const link = page.locator(`footer ${PARENT_LINK}`);
    await expect(link).toHaveCount(1);
    await expect(link).toBeVisible();
    await expect(link).toHaveText("Devya Solutions");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /(^|\s)noopener(\s|$)/);

    // The line it sits in says exactly the credit, nothing before or after.
    await expect(page.locator("footer p").filter({ has: page.locator(PARENT_LINK) })).toHaveText(CREDIT[locale]);

    // The Latin name is one isolated run, so the Arabic line cannot reorder it.
    await expect(link.locator("bdi")).toHaveCSS("unicode-bidi", "isolate");
  });
}
