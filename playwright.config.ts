import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defineConfig, devices } from "@playwright/test";

/**
 * Browser smoke journeys (e2e/), always against a production build: `next
 * start` runs with NODE_ENV=production, so the CSP, HSTS and the minified React
 * that threw #418 are what the tests see. Build first — `pnpm build`.
 *
 * Two ways to point it at a server:
 *
 * - `E2E_BASE_URL` set: test that server and start nothing. Locally that is the
 *   portless route, e.g.
 *     portless devyapos -- pnpm start
 *     E2E_BASE_URL=$(portless get devyapos) pnpm e2e
 * - unset (CI): Playwright starts `pnpm start` itself on `E2E_PORT`, default
 *   3100, with `PORT` handed to Next through the environment, so no script
 *   hardcodes a port.
 *
 * `E2E_CHROME_PATH` launches an installed Chrome instead of Playwright's own
 * Chromium, for a laptop whose browser cache has gone missing. CI always uses
 * Playwright's (`npx playwright install --with-deps chromium`).
 */

const external = process.env.E2E_BASE_URL?.replace(/\/$/, "");
const port = Number(process.env.E2E_PORT) || 3100;
const baseURL = external ?? `http://127.0.0.1:${port}`;

// The lead route needs somewhere durable to put a lead it cannot forward. The
// tests intercept every POST to /api/lead, so nothing should land here; if
// one ever does, it lands in a temp dir and never in a real outbox.
const outbox = join(tmpdir(), "devyapos-e2e-outbox");
mkdirSync(outbox, { recursive: true });

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  // No retries: a retry that passes would hide an intermittent failure, and an
  // intermittent hydration error is exactly what this suite exists to catch.
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]]
    : [["list"]],
  outputDir: "test-results",
  use: {
    baseURL,
    // The portless route is HTTPS under a local CA the browser does not know.
    ignoreHTTPSErrors: Boolean(external),
    // Recording costs every test about a second; CI keeps it for the failures
    // it uploads, a local run can rerun with --trace on.
    trace: process.env.CI ? "retain-on-failure" : "off",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: process.env.E2E_CHROME_PATH
          ? { executablePath: process.env.E2E_CHROME_PATH }
          : {},
      },
    },
  ],
  webServer: external
    ? undefined
    : {
        command: "pnpm start",
        url: `${baseURL}/ar`,
        reuseExistingServer: false,
        timeout: 60_000,
        env: {
          PORT: String(port),
          LEAD_OUTBOX_DIR: outbox,
          // Never forward a test lead anywhere, whatever the shell has set.
          LEAD_FORWARD_URL: "",
        },
      },
});
