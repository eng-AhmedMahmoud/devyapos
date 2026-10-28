import type { Page } from "@playwright/test";
import { expect, hydrated, LOCALES, test } from "./fixtures";

/**
 * Page transitions (components/PageTransition.tsx): the first page of a visit
 * is drawn as it is — it is the LCP (vitals.spec.ts) — and a client
 * navigation fades the next page in with a slide from the inline end,
 * mirrored in Arabic. A hash on the same page never replays it, a new page
 * starts at its top, and reduced motion turns it off. The fixture fails any
 * test that logs an error.
 */

const PAGE = "main#main > .page-frame > div";

async function open(page: Page, path: string) {
  const response = await page.goto(path);
  expect(response?.status(), path).toBe(200);
  await hydrated(page);
}

/** The animation the entering page runs, and the side it slides in from. */
async function entrance(page: Page) {
  return page.locator(`${PAGE}.page-enter`).evaluate((el) => {
    const style = getComputedStyle(el);
    return { name: style.animationName, x: style.getPropertyValue("--page-enter-x").trim() };
  });
}

for (const locale of LOCALES) {
  const fromEnd = locale === "ar" ? "-8px" : "8px";
  const pricing = `header nav a[href="/${locale}/pricing"]`;

  test(`${locale}: the first page is still; a client navigation enters from the inline end`, async ({ page }) => {
    await open(page, `/${locale}`);
    await expect(page.locator(PAGE)).toHaveCount(1);
    await expect(page.locator(PAGE)).not.toHaveClass(/page-enter/);
    await expect(page.locator("html")).toHaveAttribute("data-scroll-behavior", "smooth");

    await page.evaluate(() => ((window as unknown as { stayed: boolean }).stayed = true));
    await page.locator(pricing).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/pricing$`));
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator(`${PAGE}.page-enter`)).toHaveCount(1);
    expect(await entrance(page)).toEqual({ name: "page-enter", x: fromEnd });
    // A client navigation, not a document load.
    expect(await page.evaluate(() => (window as unknown as { stayed?: boolean }).stayed)).toBe(true);

    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`/${locale}$`));
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator(`${PAGE}.page-enter`)).toHaveCount(1);
  });

  test(`${locale}: the next page opens at its top`, async ({ page }) => {
    await open(page, `/${locale}`);
    const start = await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight / 2, behavior: "instant" });
      const seen: number[] = [];
      (window as unknown as { seen: number[] }).seen = seen;
      window.addEventListener("scroll", () => seen.push(window.scrollY));
      return window.scrollY;
    });
    expect(start).toBeGreaterThan(0);
    await page.locator(pricing).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/pricing$`));
    await expect(page.locator("main h1")).toBeInViewport();
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    // A jump, not a glide: at most one stop on the way (the browser clamping
    // to a shorter page before Next scrolls to the top).
    const seen = await page.evaluate(() => (window as unknown as { seen: number[] }).seen);
    expect(seen.filter((y) => y !== 0 && y !== start).length).toBeLessThanOrEqual(1);
  });

  test(`${locale}: an anchor on the same page does not replay the transition`, async ({ page }) => {
    await open(page, `/${locale}`);
    await page.locator(PAGE).evaluate((el) => (el.dataset.mark = "first"));
    await page.locator('main a[href="#promo"]').click();
    await expect(page).toHaveURL(new RegExp(`/${locale}#promo$`));
    await expect(page.locator("#promo")).toBeInViewport();
    await expect(page.locator(`${PAGE}[data-mark="first"]`)).toHaveCount(1);
    await expect(page.locator(PAGE)).not.toHaveClass(/page-enter/);
  });

  test.describe("on a phone", () => {
    test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

    // The slide must never widen the page: a phone grows its layout viewport
    // to fit 8 px of overflow, and Chrome aborts the view transition with an
    // uncaught "Viewport size changed" (which the fixture would report).
    test(`${locale}: the slide stays inside the screen`, async ({ page }) => {
      await open(page, `/${locale}`);
      await page.evaluate(() => {
        const w = window as unknown as { widths: number[]; sampling: boolean };
        w.widths = [];
        w.sampling = true;
        const tick = () => {
          w.widths.push(document.documentElement.scrollWidth - window.innerWidth);
          if (w.sampling) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      await page.locator(`footer a[href="/${locale}/pricing"]`).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/pricing$`));
      await expect(page.locator("main h1")).toBeVisible();
      expect(await entrance(page)).toEqual({ name: "page-enter", x: fromEnd });
      // Sample until the entrance has run its course.
      await expect.poll(() => page.locator(`${PAGE}.page-enter`).evaluate((el) => el.getAnimations().length)).toBe(0);
      const widths = await page.evaluate(() => {
        const w = window as unknown as { widths: number[]; sampling: boolean };
        w.sampling = false;
        return w.widths;
      });
      expect(Math.max(...widths)).toBe(0);
    });
  });

  test(`${locale}: reduced motion gets no transition`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page, `/${locale}`);
    await page.locator(pricing).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/pricing$`));
    await expect(page.locator(`${PAGE}.page-enter`)).toHaveCount(1);
    expect((await entrance(page)).name).toBe("none");
  });
}
