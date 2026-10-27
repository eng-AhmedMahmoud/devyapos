import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { docsMap } from "@/content/docs";
import { SHOTS as SHOT_MAP, SURFACES, type ShotSpec } from "@/content/docs/shots";
import captured from "@/content/docs/shots.captured.json";
import { routing } from "@/i18n/routing";
import {
  allArticles,
  articleShots,
  blockText,
  buildSearchIndex,
  DOCS_BASE,
  docsPaths,
  docsTrail,
  getDocs,
  resolveRef,
  sections,
} from "@/lib/docs";
import { inlineLinks, plainText } from "@/lib/docs/inline";
import { articlePageJsonLd, docsPageJsonLd } from "@/lib/docs/jsonld";
import {
  articleMetadata,
  categoryDescription,
  categoryMetadata,
  metaDescription,
  pageTitle,
  searchMetadata,
} from "@/lib/docs/meta";
import { brand } from "@/lib/brand";
import { NOINDEX_PATHS, routes } from "@/lib/meta";

/**
 * The help centre's content and its screenshot manifest (content/docs). The
 * model is the Moving family's umbrella help centre's (moving-landing
 * tests/docs.test.ts); the rules this site adds on top — its own pages as
 * link targets, no host typed in the copy, points-only loyalty — are the
 * ones tests/seo.test.ts and tests/privacy.test.ts hold the marketing copy to.
 */

const SHOTS = SHOT_MAP as Record<string, ShotSpec>;
const root = join(__dirname, "..");

/** Every key path of a value, with array items collapsed to their index. */
function shape(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) {
    return [`${path}[${value.length}]`, ...value.flatMap((v, i) => shape(v, `${path}[${i}]`))];
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => shape(v, path ? `${path}.${k}` : k));
  }
  return [path];
}

/** Values that must be identical in both languages: ids, slugs, block kinds, screenshot ids, links. */
function skeleton(locale: "ar" | "en") {
  const d = docsMap[locale];
  return {
    startHere: d.startHere,
    popular: d.popular,
    categories: d.categories.map((c) => ({
      id: c.id,
      group: c.group,
      icon: c.icon,
      articles: c.articles.map((a) => ({
        slug: a.slug,
        reviewed: a.reviewed,
        related: a.related,
        sections: sections(a).map((s) => s.id),
        blocks: a.body.map((b) => b.t + (b.t === "callout" ? `:${b.tone}` : "")),
        shots: articleShots(a).map((s) => s.id),
        links: [a.summary, ...a.before, ...a.body.flatMap(blockText)].flatMap(inlineLinks),
      })),
    })),
  };
}

/** Every string leaf, for the placeholder and wording checks. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

/** Loyalty ships as points only (tests/seo.test.ts holds the marketing copy to the same words). */
const UNSHIPPED = /\btiers?\b|\blevels?\b|referr|مستويات|إحالة/i;
/** Retired names, other hosts, and anything a reader could dial or mail. */
const FORBIDDEN = /DevyaPOS|Drinki|devya\.solutions|\.devya\.dev|https?:\/\/|www\.|@[a-z0-9-]+\.[a-z]{2,}|\+?\d[\d\s-]{9,}\d/i;
const length = (s: string) => [...s].length;

/** Site pages an article may link to: every indexed route, and the noindexed legal pages. */
const SITE_PATHS = new Set([...routes.map((r) => r.path), ...NOINDEX_PATHS]);

describe("help centre content", () => {
  it("has a tree for every locale", () => {
    expect(Object.keys(docsMap).sort()).toEqual([...routing.locales].sort());
  });

  it("keeps Arabic and English the same shape, list lengths included", () => {
    expect(shape(docsMap.en)).toEqual(shape(docsMap.ar));
  });

  it("keeps ids, slugs, blocks, screenshots and links identical across languages", () => {
    expect(skeleton("en")).toEqual(skeleton("ar"));
  });

  it("has no empty or placeholder strings", () => {
    for (const locale of routing.locales) {
      for (const s of strings(docsMap[locale])) {
        expect(s.trim(), `${locale}: "${s}"`).not.toBe("");
        expect(s, `${locale}: "${s}"`).not.toMatch(/lorem|TODO|TBD|xxx|PLACEHOLDER/i);
      }
    }
  });

  it("names no retired product, no host, phone number or email, and no unshipped loyalty", () => {
    for (const locale of routing.locales) {
      for (const s of strings(docsMap[locale])) {
        expect(s, `${locale}: "${s}"`).not.toMatch(FORBIDDEN);
        expect(s, `${locale}: "${s}"`).not.toMatch(UNSHIPPED);
        expect(s, `${locale}: "${s}"`).not.toMatch(/garden|الحديقة|حديقة الولاء/i);
      }
    }
  });

  it("writes the Arabic tree in Arabic", () => {
    for (const { category, article } of allArticles(docsMap.ar)) {
      expect(category.title).toMatch(/[؀-ۿ]/);
      expect(article.title, article.slug).toMatch(/[؀-ۿ]/);
      expect(article.summary, article.slug).toMatch(/[؀-ۿ]/);
    }
  });

  it("keeps marks out of every field that is set as plain text (titles, keywords, categories)", () => {
    const mark = /\*\*|`|\]\(/;
    for (const locale of routing.locales) {
      for (const c of docsMap[locale].categories) {
        expect(c.title, c.id).not.toMatch(mark);
        expect(c.description, c.id).not.toMatch(mark);
        for (const a of c.articles) {
          expect(a.title, a.slug).not.toMatch(mark);
          for (const k of a.keywords) expect(k, a.slug).not.toMatch(mark);
        }
      }
    }
  });

  it("uses unique, URL-safe ids and slugs, none of them a reserved path", () => {
    const ids = docsMap.ar.categories.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of docsMap.ar.categories) {
      expect(c.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(["search", "search.json"]).not.toContain(c.id);
      expect(c.articles.length, c.id).toBeGreaterThan(0);
      const slugs = c.articles.map((a) => a.slug);
      expect(new Set(slugs).size, c.id).toBe(slugs.length);
      for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("starts with getting started and ends with the FAQ", () => {
    const ids = docsMap.ar.categories.map((c) => c.id);
    expect(ids[0]).toBe("getting-started");
    expect(ids.at(-1)).toBe("faq");
  });

  it("covers what an owner and a cashier come for", () => {
    const refs = allArticles(docsMap.ar).map(({ category, article }) => `${category.id}/${article.slug}`);
    for (const ref of [
      "getting-started/get-started-with-pos",
      "journeys/owner-setup",
      "selling/sign-in-and-open-a-shift",
      "selling/close-the-shift",
      "setup/build-your-menu",
      "payments/payment-methods",
      "setup/receipt-printers",
      "setup/staff-and-permissions",
      "reports/sales-reports",
      "assistant/ask-the-assistant",
    ]) {
      expect(refs, ref).toContain(ref);
    }
  });

  it("dates every review as a real ISO day, not in the future", () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const { article } of allArticles(docsMap.ar)) {
      expect(article.reviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(article.reviewed))).toBe(false);
      expect(article.reviewed <= today, article.slug).toBe(true);
    }
  });

  it("gives every section a unique anchor within its article", () => {
    for (const { article } of allArticles(docsMap.ar)) {
      const ids = sections(article).map((s) => s.id);
      expect(new Set(ids).size, article.slug).toBe(ids.length);
      for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("offers five numbered first steps and a most-read row that all resolve", () => {
    const docs = docsMap.ar;
    expect(docs.startHere).toHaveLength(5);
    for (const ref of [...docs.startHere, ...docs.popular]) expect(resolveRef(docs, ref), ref).toBeDefined();
    expect(docs.popular.length).toBeGreaterThanOrEqual(6);
  });

  it("resolves every related article", () => {
    const docs = docsMap.ar;
    for (const { category, article } of allArticles(docs)) {
      for (const ref of article.related) {
        expect(resolveRef(docs, ref), `${category.id}/${article.slug} → ${ref}`).toBeDefined();
        expect(ref).not.toBe(`${category.id}/${article.slug}`);
      }
    }
  });

  it("links only to real articles, to this site's pages and to the sister product", () => {
    const docs = docsMap.ar;
    for (const link of skeleton("ar").categories.flatMap((c) => c.articles.flatMap((a) => a.links))) {
      if (link.startsWith("/docs/")) {
        const [, , category, slug, ...rest] = link.split("/");
        expect(rest, link).toEqual([]);
        expect(resolveRef(docs, `${category}/${slug}`), link).toBeDefined();
      } else if (link.startsWith("/")) {
        expect(SITE_PATHS.has(link.split("#")[0]), link).toBe(true);
      } else {
        expect(link, "the only outbound link is the sister product's site").toBe("{stores}");
      }
    }
  });

  it("gives every article a meta description of 70–160 characters", () => {
    for (const locale of routing.locales) {
      for (const { article } of allArticles(docsMap[locale])) {
        const s = plainText(article.summary);
        expect(length(s), `${locale} ${article.slug}: ${s}`).toBeGreaterThanOrEqual(70);
        expect(length(s), `${locale} ${article.slug}: ${s}`).toBeLessThanOrEqual(160);
      }
    }
  });

  it("titles every help page within 65 characters, with a description of 70–160, unique per language", () => {
    for (const locale of routing.locales) {
      const docs = getDocs(locale);
      const metas = [
        ...docs.categories.map((c) => categoryMetadata(locale, c.id)),
        ...allArticles(docs).map(({ category, article }) => articleMetadata(locale, category.id, article.slug)),
      ];
      for (const m of metas) {
        const title = String(m.title);
        const description = String(m.description);
        expect(length(title), title).toBeLessThanOrEqual(65);
        expect(length(description), `${title}: ${description}`).toBeGreaterThanOrEqual(70);
        expect(length(description), title).toBeLessThanOrEqual(160);
        expect(m.robots, title).toBeUndefined();
      }
      expect(new Set(metas.map((m) => String(m.title))).size, locale).toBe(metas.length);
    }
  });

  it("keeps the search results page out of the index", () => {
    for (const locale of routing.locales) {
      expect(searchMetadata(locale).robots).toEqual({ index: false, follow: true });
    }
  });

  it("indexes every article for search in both languages, marks removed", () => {
    for (const locale of routing.locales) {
      const index = buildSearchIndex(locale);
      expect(index.length).toBe(allArticles(getDocs(locale)).length);
      for (const e of index) {
        expect(e.title.trim()).not.toBe("");
        expect(e.body).not.toMatch(/\*\*|`/);
      }
    }
  });

  it("lists the front page, every category and every article for the sitemap", () => {
    const docs = docsMap.ar;
    const paths = docsPaths("ar").map((p) => p.path);
    expect(paths[0]).toBe(DOCS_BASE);
    expect(paths).toHaveLength(1 + docs.categories.length + allArticles(docs).length);
    expect(new Set(paths).size).toBe(paths.length);
    expect(docsPaths("en").map((p) => p.path)).toEqual(paths);
  });
});

describe("help-centre metadata and structured data", () => {
  it("titles a page with its section and the product when there is room, and clips when there is not", () => {
    expect(pageTitle("en", "Close the shift", "Help centre")).toBe("Close the shift | Help centre | Moving POS");
    const long = "A very long article title that keeps going well past the sixty-five character limit";
    expect([...pageTitle("en", long, "Help centre")].length).toBeLessThanOrEqual(65);
    expect(pageTitle("en", long, "Help centre").endsWith("…")).toBe(true);
    expect(metaDescription("**Bold** and `code` " + "word ".repeat(60)).length).toBeLessThanOrEqual(160);
  });

  it("gives every article page its trail, a TechArticle dated by its review, and its questions as an FAQPage", () => {
    for (const locale of routing.locales) {
      for (const { category, article } of allArticles(getDocs(locale))) {
        const nodes = articlePageJsonLd(locale, category.id, article.slug);
        const crumbs = nodes.find((n) => n["@type"] === "BreadcrumbList") as unknown as { itemListElement: { name: string; item: string }[] };
        expect(crumbs.itemListElement.map((i) => i.name)).toEqual([
          brand.name[locale],
          getDocs(locale).ui.name,
          category.title,
          article.title,
        ]);
        expect(crumbs.itemListElement.at(-1)!.item).toBe(`${brand.url}/${locale}${`/docs/${category.id}/${article.slug}`}`);
        const tech = nodes.find((n) => n["@type"] === "TechArticle")!;
        expect(tech.dateModified).toBe(article.reviewed);
        expect(tech.inLanguage).toBe(locale);
        expect((tech.image as string[]).length).toBeGreaterThan(0);
        for (const img of tech.image as string[]) expect(img.startsWith(`${brand.url}/`)).toBe(true);
        const hasQa = article.body.some((b) => b.t === "qa");
        expect(nodes.some((n) => n["@type"] === "FAQPage")).toBe(hasQa);
      }
    }
    expect(articlePageJsonLd("ar", "nope", "nope")).toEqual([]);
  });

  it("answers an unknown category or article with nothing rather than a guess", () => {
    expect(categoryMetadata("en", "nope")).toEqual({});
    expect(articleMetadata("en", "nope", "nope")).toEqual({});
    expect(categoryDescription("en", "nope")).toBeUndefined();
    expect(getDocs("xx")).toBe(docsMap.ar);
    const docs = getDocs("en");
    expect(docsTrail(docs, "nope")).toEqual([{ label: docs.ui.name }]);
    expect(docsTrail(docs, docs.categories[0].id, "nope")).toEqual([
      { label: docs.ui.name, href: DOCS_BASE },
      { label: docs.categories[0].title },
    ]);
    expect(resolveRef(docs, "nope/nope")).toBeUndefined();
  });

  it("drops the section, then the product, from a title that would not fit", () => {
    const mid = "An article title long enough that the section no longer fits";
    expect(pageTitle("en", mid, "Help centre")).toBe(mid);
    expect(pageTitle("en", "Short", undefined)).toBe("Short | Moving POS");
  });

  it("lists a short category's first guides after its description", () => {
    for (const locale of routing.locales) {
      for (const c of getDocs(locale).categories) {
        const d = categoryDescription(locale, c.id)!;
        expect([...d].length, `${locale} ${c.id}`).toBeGreaterThanOrEqual(70);
        expect([...d].length, `${locale} ${c.id}`).toBeLessThanOrEqual(160);
      }
    }
  });

  it("gives the front page and each category the trail they print", () => {
    const docs = getDocs("en");
    const front = docsPageJsonLd("en")[0] as unknown as { itemListElement: { name: string }[] };
    expect(front.itemListElement.map((i) => i.name)).toEqual([brand.name.en, docs.ui.name]);
    const cat = docsPageJsonLd("en", docs.categories[0].id)[0] as unknown as { itemListElement: { name: string }[] };
    expect(cat.itemListElement.map((i) => i.name)).toEqual([brand.name.en, docs.ui.name, docs.categories[0].title]);
  });
});

describe("screenshot slots", () => {
  const used = new Set(skeleton("ar").categories.flatMap((c) => c.articles.flatMap((a) => a.shots)));

  it("uses every screenshot slot somewhere, and only slots that exist", () => {
    // A slot may appear in more than one article — a role journey shows the
    // same screen a task article does, with its own caption — but never twice
    // in one article, and never a slot the manifest does not define.
    expect([...used].sort()).toEqual(Object.keys(SHOTS).sort());
    for (const { article } of allArticles(docsMap.ar)) {
      const ids = articleShots(article).map((s) => s.id);
      expect(new Set(ids).size, article.slug).toBe(ids.length);
    }
  });

  it("shoots only the platform's own apps, on paths below their root", () => {
    for (const [id, spec] of Object.entries(SHOTS)) {
      expect(Object.keys(SURFACES), id).toContain(spec.surface);
      expect(spec.path === "" || spec.path.startsWith("/"), id).toBe(true);
      expect(spec.devices.length, id).toBeGreaterThan(0);
    }
  });

  it("defines each slot id in exactly one category fragment", () => {
    const dir = join(root, "content/docs/shots");
    const ids = readdirSync(dir)
      .filter((f) => f.endsWith(".ts"))
      .flatMap((f) => [...readFileSync(join(dir, f), "utf8").matchAll(/^\s{2}"([a-z0-9-]+)":\s*\{/gm)].map((m) => m[1]));
    expect(new Set(ids).size, "an id appears in two fragments").toBe(ids.length);
    expect(ids.sort()).toEqual(Object.keys(SHOTS).sort());
  });

  it("has every recorded capture on disk", () => {
    for (const [id, entry] of Object.entries(captured as Record<string, { images: Record<string, Record<string, unknown>> }>)) {
      for (const [locale, devices] of Object.entries(entry.images)) {
        for (const device of Object.keys(devices)) {
          const file = join(root, "public/docs/shots", `${id}.${locale}.${device}.webp`);
          expect(existsSync(file), file).toBe(true);
        }
      }
    }
  });

  it("records captures only for known slots, locales and devices, with real sizes", () => {
    for (const [id, entry] of Object.entries(captured as Record<string, { images: Record<string, Record<string, { w: number; h: number }>> }>)) {
      expect(Object.keys(SHOTS), id).toContain(id);
      for (const [locale, devices] of Object.entries(entry.images)) {
        expect(routing.locales as readonly string[]).toContain(locale);
        for (const [device, size] of Object.entries(devices)) {
          expect(["desktop", "phone"]).toContain(device);
          expect(SHOTS[id].devices as readonly string[]).toContain(device);
          expect(size.w).toBeGreaterThan(0);
          expect(size.h).toBeGreaterThan(0);
        }
      }
    }
  });
});
