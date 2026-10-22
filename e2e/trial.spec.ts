import { getContent } from "@/content";
import { expect, hydrated, LOCALES, test } from "./fixtures";

/**
 * With NEXT_PUBLIC_TRIAL_CLAIM_URL unset at build time — as in CI — sign-ups
 * are closed on this build, and the page must say so and hand the visitor to
 * WhatsApp rather than post a claim anywhere.
 */
test.skip(
  Boolean(process.env.NEXT_PUBLIC_TRIAL_CLAIM_URL),
  "this build has a trial claim URL, so the form is open",
);

for (const locale of LOCALES) {
  test(`${locale}: /accounting-trial renders and offers WhatsApp while sign-ups are closed`, async ({ page }) => {
    const t = getContent(locale).accountingTrial;
    const response = await page.goto(`/${locale}/accounting-trial`);
    expect(response?.status()).toBe(200);
    await hydrated(page);

    await expect(page.locator("main h1")).toHaveText(t.title);
    // The form's section (`#start`, where every CTA on the page points). The
    // floating button and the plans table carry WhatsApp links of their own.
    const form = page.locator("#start");
    await expect(form.getByText(t.outcomes.closedTitle)).toBeVisible();
    const whatsapp = form.getByRole("link", { name: t.outcomes.whatsapp });
    await expect(whatsapp).toBeVisible();
    await expect(whatsapp).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+\?text=/);
  });
}
