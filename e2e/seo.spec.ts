import { brandName } from "@/lib/brand";
import { NOINDEX_PATHS, routes } from "@/lib/routes";
import { getContent } from "./content";
import { expect, hydrated, LOCALES, test } from "./fixtures";

/*
 * What the server sends a crawler, read from the HTML of the production build
 * (`request`, so no browser runs and no console is involved), plus the few
 * things only a browser can measure.
 */

const PATHS = [...routes.map((r) => r.path), ...NOINDEX_PATHS];

/** The HTML between <tag ...> and </tag>, first occurrence. */
function section(html: string, tag: string): string {
  const start = html.search(new RegExp(`<${tag}[\\s>]`));
  const end = html.indexOf(`</${tag}>`, start);
  return start === -1 || end === -1 ? "" : html.slice(start, end);
}

for (const locale of LOCALES) {
  test(`${locale}: every page has exactly one h1, in main, before any other heading`, async ({ request }) => {
    for (const path of PATHS) {
      const res = await request.get(`/${locale}${path}`);
      expect(res.status(), path).toBe(200);
      const main = section(await res.text(), "main");
      expect(main.match(/<h1[\s>]/g)?.length ?? 0, `${locale}${path}`).toBe(1);
      expect(main.search(/<h[1-6][\s>]/), `${locale}${path}`).toBe(main.search(/<h1[\s>]/));
    }
  });

  // The closed consent panel's h2 is still there: ConsentManager.tsx is shared
  // byte-for-byte across repos (docs/compliance/consent-design.md).
  test(`${locale}: the footer adds no headings`, async ({ request }) => {
    const html = await (await request.get(`/${locale}/pricing`)).text();
    expect(section(html, "footer")).not.toMatch(/<h[1-6][\s>]/);
  });

  test(`${locale}: home preloads the hero face only, and no image`, async ({ request }) => {
    const html = await (await request.get(`/${locale}`)).text();
    const preloads = html.match(/<link[^>]*rel="preload"[^>]*>/g) ?? [];
    expect(preloads.filter((l) => /as="image"/.test(l))).toEqual([]);
    expect(preloads.filter((l) => /as="font"/.test(l)).length).toBeLessThanOrEqual(2);
  });

  test(`${locale}: the header logo is named by what it shows`, async ({ request }) => {
    const html = await (await request.get(`/${locale}`)).text();
    const header = section(html, "header");
    expect(header).toContain(`aria-label="${brandName(locale)} — `);
  });
}

for (const path of ["/ar/does-not-exist", "/en/does-not-exist", "/nope", "/nope.php", "/ar/a/b"]) {
  test(`${path} is a branded 404 the server renders whole`, async ({ request }) => {
    const res = await request.get(path);
    expect(res.status()).toBe(404);
    const html = await res.text();
    expect(html).toMatch(/<html lang="ar" dir="rtl"/);
    expect(html).toMatch(/<meta name="robots" content="[^"]*noindex/);
    expect(html).not.toMatch(/rel="canonical"/);
    expect(html).not.toMatch(/hreflang/i);
    expect(section(html, "h1")).toContain(getContent("ar").notFound.title);
    expect(html).toContain(`lang="en" dir="ltr"`);
    expect(html).toContain(getContent("en").notFound.title.replace("'", "&#x27;"));
  });
}

test("/favicon.ico and /llms.txt are served", async ({ request }) => {
  const icon = await request.get("/favicon.ico");
  expect(icon.status()).toBe(200);
  expect(icon.headers()["content-type"]).toMatch(/image\/(x-icon|vnd\.microsoft\.icon)/);

  const llms = await request.get("/llms.txt");
  expect(llms.status()).toBe(200);
  expect(llms.headers()["content-type"]).toMatch(/^text\/plain/);
  expect(await llms.text()).toMatch(/^# Moving POS\n/);
});

test("/ redirects permanently to /ar", async ({ request }) => {
  const res = await request.get("/?utm_source=e2e", { maxRedirects: 0 });
  expect(res.status()).toBe(308);
  expect(res.headers().location).toMatch(/\/ar\?utm_source=e2e$/);
});

test("ar: the carousel dots are 24 px targets", async ({ page }) => {
  await page.goto("/ar/features");
  await hydrated(page);
  const dots = page.locator("button[aria-current]");
  expect(await dots.count()).toBeGreaterThan(1);
  for (const dot of await dots.all()) {
    const box = await dot.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(24);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(24);
  }
});

test("ar: the promo poster waits for the visitor to scroll", async ({ page }) => {
  const posters: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("pos-demo-poster")) posters.push(r.url());
  });
  await page.goto("/ar");
  await hydrated(page);
  await page.waitForLoadState("networkidle");
  expect(posters).toEqual([]);

  await page.locator("#promo").scrollIntoViewIfNeeded();
  await expect.poll(() => posters.length).toBeGreaterThan(0);
});
