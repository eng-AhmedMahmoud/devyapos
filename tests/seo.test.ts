import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { getContent } from "@/content";
import { brand } from "@/lib/brand";
import { allArticles, articleHref, DOCS_BASE, docsPaths, getDocs } from "@/lib/docs";
import { llmsTxt } from "@/lib/llms";
import { NOINDEX_PATHS, buildMetadata, localeHref, ogImagePath, routes } from "@/lib/meta";
import { proxy } from "@/proxy";

/**
 * What search engines read before they read a page: the route manifest, the
 * sitemap and robots.txt, every page's head, and the links between pages.
 * Run against the real builders (buildMetadata, sitemap(), robots(), the
 * proxy), not read off the source.
 */

const LOCALES = ["ar", "en"] as const;
const root = join(__dirname, "..");
const today = new Date().toISOString().slice(0, 10);

/** Every page under app/[locale], as the path below the locale ("" is home). */
function pagePaths(): string[] {
  const dir = join(root, "app/[locale]");
  return [
    "",
    ...readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && existsSync(join(dir, d.name, "page.tsx")))
      .map((d) => `/${d.name}`),
  ].sort();
}

/** The `meta` key a path's page passes to buildMetadata. */
function keyFor(path: string): string {
  const route = routes.find((r) => r.path === path);
  if (route) return route.key;
  return path.slice(1); // /terms → terms, /refund → refund
}

const ALL_PATHS = [...routes.map((r) => r.path), ...NOINDEX_PATHS];

/** Hosts this site must never point at: the old ones, and devya.solutions. */
const FOREIGN_HOST = /[a-z0-9-]+\.devya\.dev|https?:\/\/[^\s)"]*devya\.solutions/;

/** Loyalty ships as points only. */
const UNSHIPPED = /\btiers?\b|\blevels?\b|referr|مستويات|إحالة/i;

describe("route manifest", () => {
  it("places every page: indexed (routes) or deliberately not (NOINDEX_PATHS)", () => {
    expect([...ALL_PATHS].sort()).toEqual(pagePaths());
    expect(routes.map((r) => r.path)).toContain("/privacy");
    for (const path of NOINDEX_PATHS) {
      expect(routes.map((r) => r.path), path).not.toContain(path);
    }
  });

  it("leaves robots to buildMetadata: no page sets its own", () => {
    for (const path of pagePaths()) {
      const file = join(root, "app/[locale]", path, "page.tsx");
      expect(readFileSync(file, "utf8"), file).not.toMatch(/\brobots\s*:/);
    }
  });

  it("dates every route by its copy, never in the future", () => {
    for (const route of routes) {
      expect(route.updated, route.path).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(route.updated).toISOString().slice(0, 10), route.path).toBe(route.updated);
      expect(route.updated <= today, `${route.path} ${route.updated}`).toBe(true);
    }
  });

  it("dates /privacy by the 'Last updated' line the page prints", () => {
    const privacy = routes.find((r) => r.path === "/privacy")!;
    const printed = getContent("en").legal.privacy.updated.replace(/^Last updated /, "");
    expect(new Date(`${printed} UTC`).toISOString().slice(0, 10)).toBe(privacy.updated);
  });
});

describe("page metadata (buildMetadata)", () => {
  const pages = LOCALES.flatMap((locale) =>
    ALL_PATHS.map((path) => ({
      locale,
      path,
      label: `${locale} ${path || "/"}`,
      meta: buildMetadata(locale, keyFor(path), path),
    })),
  );

  it("gives every page a self-canonical and ar/en/x-default alternates", () => {
    for (const { locale, path, label, meta } of pages) {
      expect(meta.alternates?.canonical, label).toBe(localeHref(locale, path));
      expect(meta.alternates?.languages, label).toEqual({
        ar: `${brand.url}/ar${path}`,
        en: `${brand.url}/en${path}`,
        "x-default": `${brand.url}/ar${path}`,
      });
    }
  });

  it("names the other language's page in og:locale:alternate", () => {
    for (const { locale, label, meta } of pages) {
      const og = meta.openGraph as { locale?: string; alternateLocale?: string[]; url?: string };
      expect(og.locale, label).toBe(locale === "ar" ? "ar_EG" : "en_US");
      expect(og.alternateLocale, label).toEqual([locale === "ar" ? "en_US" : "ar_EG"]);
      expect(og.url, label).toBe(meta.alternates?.canonical);
    }
  });

  it("noindexes exactly NOINDEX_PATHS, and still follows their links", () => {
    for (const { path, label, meta } of pages) {
      if (NOINDEX_PATHS.includes(path)) {
        expect(meta.robots, label).toEqual({ index: false, follow: true });
      } else {
        expect(meta.robots, label).toBeUndefined();
      }
    }
  });

  it("keeps titles within 65 characters and descriptions within 70-160", () => {
    for (const locale of LOCALES) {
      const c = getContent(locale);
      for (const [key, { title, description }] of Object.entries(c.meta)) {
        const label = `${locale} meta.${key}`;
        expect([...title].length, `${label}.title: ${title}`).toBeLessThanOrEqual(65);
        expect([...description].length, `${label}.description`).toBeGreaterThanOrEqual(70);
        expect([...description].length, `${label}.description`).toBeLessThanOrEqual(160);
      }
    }
  });

  it("gives every indexed page a title worth matching, unique in its language", () => {
    for (const locale of LOCALES) {
      const c = getContent(locale);
      const indexed = routes.map((r) => c.meta[r.key]);
      for (const { title } of indexed) {
        expect([...title].length, `${locale} ${title}`).toBeGreaterThanOrEqual(30);
      }
      expect(new Set(indexed.map((m) => m.title)).size, locale).toBe(indexed.length);
      expect(new Set(indexed.map((m) => m.description)).size, locale).toBe(indexed.length);
    }
  });

  it("gives every page its own 1200×630 share card, baked into public/og, on Open Graph and X alike", () => {
    const cards = new Set<string>();
    for (const { locale, path, label, meta } of pages) {
      const og = (meta.openGraph as { images: { url: string; width: number; height: number; alt: string }[] }).images;
      const tw = (meta.twitter as { images: { url: string }[] }).images;
      expect(og, label).toHaveLength(1);
      expect(tw.map((i) => i.url), label).toEqual([og[0].url]);
      expect(og[0].url, label).toBe(`${brand.url}${ogImagePath(locale, path)}`);
      expect(og[0].alt, label).toBe(meta.title);
      expect([og[0].width, og[0].height], label).toEqual([1200, 630]);

      // The PNG on disk is the size the tags declare (IHDR: width, height).
      const png = readFileSync(join(root, "public", ogImagePath(locale, path)));
      expect(png.subarray(1, 4).toString(), label).toBe("PNG");
      expect([png.readUInt32BE(16), png.readUInt32BE(20)], label).toEqual([1200, 630]);
      cards.add(og[0].url);
    }
    expect(cards.size).toBe(pages.length);
  });

  it("keeps the home card where the Organization markup and older shares point", () => {
    expect(ogImagePath("ar")).toBe("/og/og-ar.png");
    expect(ogImagePath("en", "")).toBe("/og/og-en.png");
    expect(ogImagePath("en", "/pricing")).toBe("/og/og-pricing-en.png");
  });

  it("claims no loyalty tiers or referrals, and points at no other Devya host", () => {
    for (const { label, meta } of pages) {
      const text = JSON.stringify(meta);
      expect(text, label).not.toMatch(UNSHIPPED);
      expect(text, label).not.toMatch(FOREIGN_HOST);
    }
  });
});

describe("sitemap.xml", () => {
  const entries = sitemap();
  /** The help centre's categories and articles, beside its front page in `routes`. */
  const helpPages = (locale: string) => docsPaths(locale).filter((p) => p.path !== DOCS_BASE);

  it("lists every indexed route and help page in both locales, and nothing else", () => {
    const expected = LOCALES.flatMap((l) => [
      ...routes.map((r) => localeHref(l, r.path)),
      ...helpPages(l).map((p) => localeHref(l, p.path)),
    ]);
    expect(entries.map((e) => e.url).sort()).toEqual(expected.sort());
    for (const locale of LOCALES) {
      expect(entries.map((e) => e.url)).toContain(`${brand.url}/${locale}/privacy`);
      for (const path of NOINDEX_PATHS) {
        expect(entries.map((e) => e.url)).not.toContain(`${brand.url}/${locale}${path}`);
      }
    }
  });

  it("dates each entry by its route's copy (a help page by its last review), never by the build", () => {
    for (const entry of entries) {
      const path = entry.url.replace(/^https:\/\/[^/]+\/(ar|en)/, "");
      const route = routes.find((r) => r.path === path) ?? helpPages("ar").find((p) => p.path === path)!;
      expect(entry.lastModified, entry.url).toBe(route.updated);
      expect(String(entry.lastModified) <= today, entry.url).toBe(true);
    }
  });

  it("carries the hreflang alternates, x-default on Arabic", () => {
    for (const entry of entries) {
      const languages = entry.alternates?.languages as Record<string, string>;
      expect(Object.keys(languages).sort(), entry.url).toEqual(["ar", "en", "x-default"]);
      expect(languages["x-default"], entry.url).toBe(languages.ar);
    }
  });

  it("is on this host only", () => {
    const text = JSON.stringify(entries);
    expect(text).not.toMatch(FOREIGN_HOST);
    for (const entry of entries) expect(entry.url.startsWith(`${brand.url}/`)).toBe(true);
  });
});

describe("robots.txt", () => {
  const r = robots();

  it("points at the sitemap on this host and has no Host line", () => {
    expect(r.sitemap).toBe(`${brand.url}/sitemap.xml`);
    expect(r).not.toHaveProperty("host");
    expect(JSON.stringify(r)).not.toMatch(FOREIGN_HOST);
  });

  it("allows everyone, AI crawlers included", () => {
    const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
    expect(rules[0]).toEqual({ userAgent: "*", allow: "/" });
    for (const rule of rules) {
      expect(rule.allow, String(rule.userAgent)).toBe("/");
      expect(rule).not.toHaveProperty("disallow");
    }
  });
});

describe("internal links", () => {
  /**
   * The fragments the site links to, and the component that carries each id.
   * A fragment link must land on a section that is actually on that page.
   */
  const ANCHORS: Record<string, Record<string, string>> = {
    "": { promo: "components/home/Promo.tsx" },
    "/compare": { compare: "components/home/Compare.tsx", roi: "components/home/RoiCalculator.tsx" },
    "/how-it-works": { how: "components/home/Steps.tsx" },
  };

  it("sends every header and footer link to a page that exists, and every #fragment to a section on it", () => {
    for (const locale of LOCALES) {
      const c = getContent(locale);
      const links = [...c.nav.links, ...c.nav.extra, ...c.footer.cols.flatMap((col) => col.links)];
      expect(links.length).toBeGreaterThan(10);
      for (const { href, label } of links) {
        if (!href.startsWith("/")) continue;
        const [pathPart, frag] = href.split("#");
        const path = pathPart === "/" ? "" : pathPart;
        const where = `${locale} "${label}" → ${href}`;
        expect(ALL_PATHS, where).toContain(path);
        if (!frag) continue;

        const component = ANCHORS[path]?.[frag];
        expect(component, `${where}: #${frag} is not a known section of ${path || "/"}`).toBeDefined();
        expect(readFileSync(join(root, component), "utf8"), where).toContain(`id="${frag}"`);
        const page = readFileSync(join(root, "app/[locale]", path, "page.tsx"), "utf8");
        const name = component.split("/").pop()!.replace(/\.tsx$/, "");
        expect(page, `${where}: ${path || "/"} does not render ${name}`).toMatch(
          new RegExp(`import ${name} from`),
        );
      }
    }
  });
});

describe("the root redirect", () => {
  it("is permanent: / answers 308 to /ar", () => {
    const res = proxy(new NextRequest(`${brand.url}/`));
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe(`${brand.url}/ar`);
  });
});

describe("llms.txt", () => {
  const text = llmsTxt();

  it("names the product and its parent, and lists every indexed page in both languages", () => {
    expect(text.startsWith(`# ${brand.name.en}\n`)).toBe(true);
    expect(text).toContain(brand.parent.url);
    for (const locale of LOCALES) {
      const c = getContent(locale);
      for (const route of routes) {
        expect(text).toContain(
          `- [${c.meta[route.key].title}](${localeHref(locale, route.path)}): ${c.meta[route.key].description}`,
        );
      }
    }
    expect(text).toContain(`${brand.url}/sitemap.xml`);
    expect(text.endsWith("\n")).toBe(true);
  });

  it("lists every help-centre article in both languages", () => {
    for (const locale of LOCALES) {
      for (const { category, article } of allArticles(getDocs(locale))) {
        expect(text).toContain(`](${localeHref(locale, articleHref(category.id, article.slug))}): `);
      }
    }
  });

  it("never lists a noindexed page or another Devya host", () => {
    for (const locale of LOCALES) {
      for (const path of NOINDEX_PATHS) {
        expect(text).not.toContain(`${localeHref(locale, path)})`);
      }
    }
    expect(text).not.toMatch(FOREIGN_HOST);
    expect(text).not.toMatch(UNSHIPPED);
  });
});
