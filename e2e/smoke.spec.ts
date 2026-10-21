import { getContent } from "@/content";
import { expect, hydrated, LOCALES, test } from "./fixtures";

test("/ opens the Arabic site", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/ar$/);
});

for (const locale of LOCALES) {
  const dir = locale === "ar" ? "rtl" : "ltr";

  test(`${locale}: home renders with lang="${locale}" and dir="${dir}"`, async ({ page }) => {
    const response = await page.goto(`/${locale}`);
    expect(response?.status()).toBe(200);
    await hydrated(page);
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", locale);
    await expect(html).toHaveAttribute("dir", dir);
    await expect(page.locator("main h1")).toBeVisible();
  });

  test(`${locale}: the header reaches pricing, then contact`, async ({ page }) => {
    const c = getContent(locale);
    await page.goto(`/${locale}`);
    await hydrated(page);

    await page.locator(`header nav a[href="/${locale}/pricing"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/pricing$`));
    await expect(page.locator("main h1")).toBeVisible();

    await page.locator("header").getByRole("link", { name: c.nav.cta }).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/contact$`));
    await expect(page.locator("#lead-name")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
  });
}

test("pages carry the production security headers", async ({ page }) => {
  const response = await page.goto("/en/pricing");
  const headers = response?.headers() ?? {};
  expect(headers["content-security-policy"]).toContain("default-src 'self'");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
});
