import { expect, hydrated, LOCALES, test } from "./fixtures";

/*
 * Largest Contentful Paint guards. Chrome does not count an element while it
 * is at opacity 0, so text that the motion layer hides, even for a moment,
 * stops being the page's LCP: the measurement moves to the end of the fade,
 * or to the consent banner that appears at hydration. Both happened in the
 * Lighthouse baseline of 2026-10-23 (docs/seo/audit-2026-10-23.md).
 */

// A Lighthouse mobile viewport, so "on screen" means what it means there.
test.use({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true });

for (const locale of LOCALES) {
  test(`${locale}: the hero's entrance moves the text but never fades it`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await hydrated(page);
    const keyframes = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => (a as CSSAnimation).animationName === "reveal-rise")
        .flatMap((a) => (a.effect as KeyframeEffect).getKeyframes()),
    );
    expect(keyframes.length).toBeGreaterThan(0);
    for (const frame of keyframes) expect(frame).not.toHaveProperty("opacity");
  });

  test(`${locale}: nothing on screen at hydration is hidden to be revealed; below the fold still is`, async ({ page }) => {
    // Every element that is armed (opacity 0) while it sits in the viewport.
    await page.addInitScript(() => {
      const hidden: string[] = [];
      (window as unknown as { armedOnScreen: string[] }).armedOnScreen = hidden;
      new MutationObserver((records) => {
        for (const { target } of records) {
          const el = target as HTMLElement;
          if (!el.classList.contains("reveal-armed")) continue;
          if (el.getBoundingClientRect().top < window.innerHeight) {
            hidden.push((el.textContent ?? "").trim().slice(0, 60));
          }
        }
      }).observe(document, { subtree: true, attributes: true, attributeFilter: ["class"] });
    });

    // A page whose first screen is all scroll-reveal content under the hero.
    await page.goto(`/${locale}/foodics-alternative`);
    await hydrated(page);

    const armed = page.locator(".reveal-armed");
    await expect.poll(() => armed.count()).toBeGreaterThan(0);
    expect(await page.evaluate(() => (window as unknown as { armedOnScreen: string[] }).armedOnScreen)).toEqual([]);

    // Below the fold, the reveal still runs when the visitor gets there.
    // Tagged, because the class the locator matches on is the one that changes.
    await armed.last().evaluate((el) => el.setAttribute("data-e2e-last", ""));
    const last = page.locator("[data-e2e-last]");
    await last.scrollIntoViewIfNeeded();
    await expect(last).toHaveClass(/reveal-in/);
  });
}
