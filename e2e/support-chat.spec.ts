import { expect, hydrated, LOCALES, test } from "./fixtures";

/*
 * The Moving support assistant's place on this site: its loader comes from
 * this origin with this site's hand-off channels, and its button sits in the
 * floating stack, on a 320 px phone and a desktop. The widget itself is
 * stood in for (e2e/fixtures.ts); moving-landing's suite tests it.
 */

const LABEL = { ar: "اسأل المساعد", en: "Ask our assistant" } as const;

for (const locale of LOCALES) {
  for (const viewport of [
    { width: 320, height: 640 },
    { width: 1280, height: 800 },
  ]) {
    test(`${locale} at ${viewport.width}px: the chat button opens the assistant from the floating stack`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`/${locale}`);
      await hydrated(page);

      const config = await page.evaluate(() => (window as unknown as { __supportStub: { config: Record<string, string> } }).__supportStub.config);
      expect(config).toMatchObject({ site: "pos", locale, launcher: "none", contact: `/${locale}/contact`, privacy: `/${locale}/privacy` });
      expect(decodeURIComponent(config.whatsapp)).toMatch(/^https:\/\/wa\.me\/\d+\?text=[\s\S]+\[P-chat\]$/);

      const button = page.locator(".fab-stack").getByRole("button", { name: LABEL[locale] });
      await expect(button).toBeVisible();
      await expect(button).toHaveAttribute("aria-haspopup", "dialog");
      await expect(button).toHaveAttribute("aria-expanded", "false");
      const box = (await button.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);

      await button.click();
      await expect(button).toHaveAttribute("aria-expanded", "true");
      expect(await page.evaluate(() => (window as unknown as { __supportStub: { opened: number } }).__supportStub.opened)).toBe(1);
    });
  }
}
