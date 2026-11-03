import { getContent } from "./content";
import { expect, hydrated, LOCALES, test } from "./fixtures";

/*
 * The plan comparison on /pricing at a phone's width (components/PricingCompare.tsx).
 * The table is wider than the screen, so it scrolls sideways inside its own
 * focusable region and the page never does; the row heads hold their place
 * at the inline start while the plans scroll under them, on the right in
 * Arabic and on the left in English.
 *
 * Reduced motion, as the axe pass runs: the scroll reveals never arm, so no
 * box is measured mid-slide.
 */

for (const locale of LOCALES) {
  test(`${locale} at 390px: the plan comparison scrolls inside its region, never the page`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${locale}/pricing`);
    await hydrated(page);

    const words = getContent(locale).pricing.comparePlans;
    const region = page.getByRole("region", { name: words.caption });
    await expect(region).toHaveAttribute("tabindex", "0");
    await expect(region.getByRole("table")).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, "the page scrolls sideways").toBeLessThanOrEqual(0);

    const widths = await region.evaluate((el) => ({ client: el.clientWidth, scroll: el.scrollWidth }));
    expect(widths.scroll, "the table fits; nothing to scroll").toBeGreaterThan(widths.client);

    // Scroll the region toward the inline end: negative in RTL, as Chromium counts it.
    const rowHead = region.locator('th[scope="row"]').first();
    const before = await rowHead.boundingBox();
    await region.evaluate((el) => {
      el.scrollLeft = getComputedStyle(el).direction === "rtl" ? -200 : 200;
    });
    const after = await rowHead.boundingBox();
    expect(Math.abs(await region.evaluate((el) => el.scrollLeft))).toBeGreaterThan(0);
    expect(after?.x).toBe(before?.x);
  });
}
