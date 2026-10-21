import { test as base, expect, type Page } from "@playwright/test";

/**
 * The shared test, with two guards on every test in e2e/:
 *
 * 1. Zero console errors and zero uncaught page errors on every page the test
 *    opens. This is what catches a hydration failure (React #418 is an uncaught
 *    error in the minified build), a CSP refusal, or a 404'd asset.
 * 2. No lead leaves a test. Every POST to /api/lead is refused at the browser
 *    unless the test intercepts it itself (a page route wins over this context
 *    route), so a test that forgets to mock the endpoint fails loudly instead
 *    of writing a lead.
 *
 * The fixture's callback is named `provide` rather than Playwright's usual
 * `use`, because the React hooks lint rule reads any call to `use` as a hook.
 */
export const test = base.extend<{ problems: string[] }>({
  problems: [
    async ({ context }, provide) => {
      const problems: string[] = [];
      const watch = (page: Page) => {
        page.on("pageerror", (error) => problems.push(`pageerror at ${page.url()}: ${error.message}`));
        page.on("console", (message) => {
          if (message.type() === "error") problems.push(`console.error at ${page.url()}: ${message.text()}`);
        });
      };
      context.pages().forEach(watch);
      context.on("page", watch);
      await context.route("**/api/lead", (route) => route.abort("blockedbyclient"));

      await provide(problems);

      expect(problems, "console errors or page errors").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export const LOCALES = ["ar", "en"] as const;

/**
 * Resolves once React has hydrated the page and run its first effects.
 *
 * Clicking before hydration would hit the server HTML with no handlers — the
 * lead form would do a native GET submit instead of validating. Next's route
 * announcer is created by an effect after hydration, so its presence is the
 * signal; the extra frame lets the state that effects set on mount (the
 * consent banner, which waits for the stored answer) commit before the test
 * asserts on it.
 */
export async function hydrated(page: Page): Promise<void> {
  await page.locator("next-route-announcer").waitFor({ state: "attached" });
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0))),
  );
}
