import { getContent } from "./content";
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
    for (const field of ["name", "restaurant", "email", "phone"]) {
      await expect(page.locator(`#lead-${field}`)).toHaveAttribute("aria-invalid", "true");
      await expect(summary.locator(`a[href="#lead-${field}"]`)).toBeVisible();
    }
    // Optional fields stay quiet when empty.
    await expect(page.locator("#lead-branches")).not.toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#lead-message")).not.toHaveAttribute("aria-invalid", "true");
    expect(posted).toBe(0);
    await expect(page).toHaveURL(new RegExp(`/${locale}/contact$`));
  });

  test(`${locale}: the email field is a left-to-right email input and refuses a malformed address`, async ({ page }) => {
    const f = getContent(locale).contact.form;
    let posted = 0;
    await page.route("**/api/lead", (route) => {
      posted += 1;
      return route.abort();
    });

    await page.goto(`/${locale}/contact`);
    await hydrated(page);
    const email = page.locator("#lead-email");
    await expect(email).toHaveAttribute("type", "email");
    await expect(email).toHaveAttribute("autocomplete", "email");
    await expect(email).toHaveAttribute("inputmode", "email");
    await expect(email).toHaveAttribute("dir", "ltr");
    await expect(email).toHaveAttribute("placeholder", f.emailPlaceholder);
    await expect(page.locator('label[for="lead-email"]')).toContainText(f.email);
    await expect(page.locator('label[for="lead-email"]')).toContainText(f.emailHint);

    await page.locator("#lead-name").fill("E2E Smoke");
    await page.locator("#lead-restaurant").fill("Smoke Test Cafe");
    await email.fill("test@devya");
    await page.locator("#lead-phone").fill("01012345678");
    await page.getByRole("button", { name: f.submitLead }).click();

    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#lead-email-error")).toHaveText(f.errors.invalid_email);
    expect(posted).toBe(0);
  });

  test(`${locale}: the WhatsApp route carries the email with the rest of the form`, async ({ page }) => {
    const f = getContent(locale).contact.form;
    await page.goto(`/${locale}/contact`);
    await hydrated(page);
    // Catch the link instead of opening WhatsApp.
    await page.evaluate(() => {
      const w = window as unknown as { open: (url?: string | URL) => null; __opened?: string };
      w.open = (url) => {
        w.__opened = String(url);
        return null;
      };
    });
    await page.locator("#lead-name").fill("E2E Smoke");
    await page.locator("#lead-email").fill("test@devya.dev");
    const form = page.locator("form", { has: page.locator("#lead-name") });
    await form.getByRole("button", { name: f.submit }).click();

    const opened = await page.evaluate(() => (window as unknown as { __opened?: string }).__opened);
    const text = new URL(String(opened)).searchParams.get("text") ?? "";
    expect(text).toContain(`${f.name}: E2E Smoke`);
    expect(text).toContain(`${f.email}: test@devya.dev`);
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
    await page.locator("#lead-email").fill("test@devya.dev");
    await page.locator("#lead-phone").fill("01012345678");
    await page.locator("#lead-branches").fill("3");
    await page.locator("#lead-message").fill("Automated smoke test, not a real lead.");
    await page.getByRole("button", { name: f.submitLead }).click();

    // No `emailed` in the answer: the plain thank-you, which promises no email.
    const success = page.getByRole("status").filter({ hasText: f.status.successTitle });
    await expect(success).toBeVisible();
    await expect(success).toContainText(f.status.successBody);
    expect(requests).toEqual([
      {
        method: "POST",
        contentType: "application/json",
        body: {
          name: "E2E Smoke",
          restaurant: "Smoke Test Cafe",
          email: "test@devya.dev",
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

  test(`${locale}: when the receiver has emailed a reply, the success state names the address`, async ({ page }) => {
    const f = getContent(locale).contact.form;
    await page.route("**/api/lead", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, id: "e2e", delivered: ["forward"], emailed: true }),
      }),
    );

    await page.goto(`/${locale}/contact`);
    await hydrated(page);
    await page.locator("#lead-name").fill("E2E Smoke");
    await page.locator("#lead-restaurant").fill("Smoke Test Cafe");
    // Typed in mixed case: the page shows the address as it was sent.
    await page.locator("#lead-email").fill(" Test@Devya.dev ");
    await page.locator("#lead-phone").fill("01012345678");
    await page.getByRole("button", { name: f.submitLead }).click();

    const success = page.getByRole("status").filter({ hasText: f.status.successTitle });
    await expect(success).toBeVisible();
    await expect(success.locator("p")).toHaveText(f.status.successEmailed.replace("{email}", "test@devya.dev"));
    // The address is its own left-to-right run inside an Arabic sentence.
    await expect(success.locator('bdi[dir="ltr"]')).toHaveText("test@devya.dev");
    await expect(success).not.toContainText(f.status.successBody);
  });
}
