import type { Page } from "@playwright/test";
import { consent } from "@/lib/consent/config";
import { ATTRIBUTION_KEY } from "@/lib/leads";
import { expect, hydrated, LOCALES, test } from "./fixtures";

/**
 * The consent banner (docs/compliance/consent-design.md), driven through its
 * `data-consent` hooks. The only thing it gates on this site is the
 * "marketing" first-touch campaign record in sessionStorage, so that is what
 * each answer is checked against. Every test starts from a fresh context:
 * nothing stored, banner up.
 */

const KEY = consent.config.storageKey;
const CAMPAIGN = "?utm_source=e2e&utm_campaign=smoke";

type Stored = {
  local: string[];
  session: string[];
  cookie: string;
  record: { action: string; choices: Record<string, boolean>; id: string } | null;
  attribution: { source?: string; campaign?: string; landingPath?: string } | null;
};

function stored(page: Page): Promise<Stored> {
  return page.evaluate(
    ([key, attributionKey]) => {
      const parse = (raw: string | null) => (raw ? JSON.parse(raw) : null);
      return {
        local: Object.keys(localStorage),
        session: Object.keys(sessionStorage),
        cookie: document.cookie,
        record: parse(localStorage.getItem(key)),
        attribution: parse(sessionStorage.getItem(attributionKey)),
      };
    },
    [KEY, ATTRIBUTION_KEY],
  );
}

const banner = (page: Page) => page.locator('[data-consent="banner"]');

for (const locale of LOCALES) {
  const landing = `/${locale}${CAMPAIGN}`;

  test(`${locale}: nothing is stored before an answer`, async ({ page }) => {
    await page.goto(landing);
    await hydrated(page);
    await expect(banner(page)).toBeVisible();
    const before = await stored(page);
    expect(before.local).toEqual([]);
    expect(before.session).toEqual([]);
    expect(before.cookie).toBe("");
  });

  test(`${locale}: Reject is kept across a reload and the campaign is not recorded`, async ({ page }) => {
    await page.goto(landing);
    await hydrated(page);
    const receipt = page.waitForRequest((r) => r.url().endsWith("/api/consent") && r.method() === "POST");
    await banner(page).locator('[data-consent="reject"]').click();
    await expect(banner(page)).toBeHidden();
    expect((await receipt).postDataJSON()).toMatchObject({ action: "reject_all", choices: { marketing: false } });

    const after = await stored(page);
    expect(after.record).toMatchObject({ action: "reject_all", choices: { marketing: false } });
    expect(after.attribution).toBeNull();

    await page.reload();
    await hydrated(page);
    await expect(banner(page)).toBeHidden();
    const reloaded = await stored(page);
    expect(reloaded.record?.id).toBe(after.record?.id);
    expect(reloaded.attribution).toBeNull();
  });

  test(`${locale}: Accept is kept across a reload and records the campaign`, async ({ page }) => {
    await page.goto(landing);
    await hydrated(page);
    await banner(page).locator('[data-consent="accept"]').click();
    await expect(banner(page)).toBeHidden();

    // The record is written by an effect once the answer lands.
    await expect.poll(async () => (await stored(page)).attribution).toMatchObject({
      source: "e2e",
      campaign: "smoke",
      landingPath: landing,
    });
    const after = await stored(page);
    expect(after.record).toMatchObject({ action: "accept_all", choices: { marketing: true } });

    await page.reload();
    await hydrated(page);
    await expect(banner(page)).toBeHidden();
    expect((await stored(page)).record?.id).toBe(after.record?.id);
  });
}
