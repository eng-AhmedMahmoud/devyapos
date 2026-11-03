import type { Page } from "@playwright/test";
import { THEME_KEY } from "@/lib/theme";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";
import { expect, hydrated, LOCALES, test } from "./fixtures";

/**
 * The theme toggle (components/ThemeToggle.tsx): two themes, light and dark,
 * and never the OS's. Every test runs with the OS set to dark, so a page that
 * still followed it would open dark.
 */
test.use({ colorScheme: "dark" });

const labels = { ar: arMessages.a11y, en: enMessages.a11y };

const stored = (page: Page) => page.evaluate((key) => localStorage.getItem(key), THEME_KEY);

for (const locale of LOCALES) {
  const { themeDark, themeLight } = labels[locale];

  test(`${locale}: opens light on a dark OS, and the toggle flips between light and dark`, async ({
    page,
  }) => {
    await page.goto(`/${locale}`);
    await hydrated(page);
    const html = page.locator("html");
    const header = page.locator("header");
    await expect(html).toHaveAttribute("data-theme", "light");
    expect(await stored(page)).toBeNull();

    // One control in the bar, offering the other theme: no third state.
    await header.getByRole("button", { name: themeDark }).click();
    await expect(html).toHaveAttribute("data-theme", "dark");
    expect(await stored(page)).toBe("dark");

    await header.getByRole("button", { name: themeLight }).click();
    await expect(html).toHaveAttribute("data-theme", "light");
    expect(await stored(page)).toBe("light");
  });
}

test('a stored "dark" wins on reload, and a stored "system" opens light', async ({ page }) => {
  const html = page.locator("html");
  await page.goto("/en");
  await hydrated(page);

  await page.evaluate((key) => localStorage.setItem(key, "dark"), THEME_KEY);
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");

  await page.evaluate((key) => localStorage.setItem(key, "system"), THEME_KEY);
  await page.reload();
  await hydrated(page);
  await expect(html).toHaveAttribute("data-theme", "light");

  // The next press replaces the stale value with a real choice.
  await page.locator("header").getByRole("button", { name: labels.en.themeDark }).click();
  expect(await stored(page)).toBe("dark");
});
