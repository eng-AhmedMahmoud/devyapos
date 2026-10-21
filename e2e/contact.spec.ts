import { getContent } from "@/content";
import { expect, hydrated, LOCALES, test } from "./fixtures";

/**
 * Cold loads of /contact. Before the theme boot script moved out of a client
 * module (lib/theme.ts), about one cold load in seven failed to hydrate with
 * React #418. Each test below runs in a fresh browser context — empty cache,
 * nothing stored — and the fixture fails it on any page error, so a return of
 * that bug fails this block on most runs; tests/client-boundary.test.ts fails
 * on it every time.
 */
const COLD_LOADS = 6;

for (const locale of LOCALES) {
  test.describe(`${locale}: cold /contact loads`, () => {
    for (let run = 1; run <= COLD_LOADS; run += 1) {
      test(`load ${run} hydrates without errors`, async ({ page }) => {
        await page.goto(`/${locale}/contact`);
        await hydrated(page);
        await expect(page.locator("#lead-name")).toBeEditable();
      });
    }
  });

  test(`${locale}: the lead form flags every missing field and sends nothing`, async ({ page }) => {
    const f = getContent(locale).contact.form;
    let posted = 0;
    await page.route("**/api/lead", (route) => {
      posted += 1;
      return route.abort();
    });

    await page.goto(`/${locale}/contact`);
    await hydrated(page);
    const form = page.locator("form", { has: page.locator("#lead-name") });
    await form.getByRole("button", { name: f.submitLead }).click();

    // Scoped to the form: Next's route announcer is an alert too.
    const summary = form.getByRole("alert");
    await expect(summary).toContainText(f.status.errorTitle);
    for (const field of ["name", "restaurant", "phone"]) {
      await expect(page.locator(`#lead-${field}`)).toHaveAttribute("aria-invalid", "true");
      await expect(summary.locator(`a[href="#lead-${field}"]`)).toBeVisible();
    }
    // Optional fields stay quiet when empty.
    await expect(page.locator("#lead-branches")).not.toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#lead-message")).not.toHaveAttribute("aria-invalid", "true");
    expect(posted).toBe(0);
    await expect(page).toHaveURL(new RegExp(`/${locale}/contact$`));
  });

  test(`${locale}: a valid lead posts the agreed JSON and shows the success state`, async ({ page }) => {
    const f = getContent(locale).contact.form;
    const requests: { method: string; contentType: string | undefined; body: unknown }[] = [];
    // The real route is never reached: the lead is answered here.
    await page.route("**/api/lead", async (route) => {
      const request = route.request();
      requests.push({
        method: request.method(),
        contentType: request.headers()["content-type"],
        body: request.postDataJSON(),
      });
      await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
    });

    await page.goto(`/${locale}/contact`);
    await hydrated(page);
    await page.locator("#lead-name").fill("E2E Smoke");
    await page.locator("#lead-restaurant").fill("Smoke Test Cafe");
    await page.locator("#lead-phone").fill("01012345678");
    await page.locator("#lead-branches").fill("3");
    await page.locator("#lead-message").fill("Automated smoke test, not a real lead.");
    await page.getByRole("button", { name: f.submitLead }).click();

    await expect(page.getByRole("status").filter({ hasText: f.status.successTitle })).toBeVisible();
    expect(requests).toEqual([
      {
        method: "POST",
        contentType: "application/json",
        body: {
          name: "E2E Smoke",
          restaurant: "Smoke Test Cafe",
          branches: "3",
          phone: "01012345678",
          message: "Automated smoke test, not a real lead.",
          locale,
          // The honeypot, empty because no person fills it.
          company: "",
          // No consent was given, so the campaign record stays home.
          attribution: null,
        },
      },
    ]);
  });
}
