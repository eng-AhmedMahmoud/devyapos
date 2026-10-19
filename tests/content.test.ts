import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ar } from "@/content/ar";
import { en } from "@/content/en";
import { brand, brandName } from "@/lib/brand";

/**
 * The two content trees and the product's name. `content/types.ts` already
 * makes the trees the same shape at compile time; it cannot see list lengths,
 * and it cannot see a product name that was renamed in one language only.
 */

/**
 * Lists known to differ in length, each a bug to fix in the copy rather than a
 * licence. The English privacy policy's cookies section still carries the
 * superseded "theme choice" paragraph beside the one that replaced it (found
 * 2026-10-19, left for its own change). Delete the entry with the fix.
 */
const KNOWN_DIVERGENCE = new Set(["legal.privacy.sections[9].body"]);

/** Every leaf path with its list lengths, e.g. `faq.items[3].q`. */
function shape(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) {
    if (KNOWN_DIVERGENCE.has(path)) return [`${path}[]`];
    return [`${path}[]=${value.length}`, ...value.flatMap((v, i) => shape(v, `${path}[${i}]`))];
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => shape(v, path ? `${path}.${k}` : k));
  }
  return [path];
}

/** Every string in a tree, flattened. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

/* Names the product carried before: DevyaPOS until 18 October 2026, Drinki POS
   until 19 October 2026. Identifiers keep `devyapos`, so only the spaced and
   cased forms people read are banned. */
const RETIRED = [/drinki/i, /دري?نكي/, /DevyaPOS/, /Devya POS/];

describe("content", () => {
  it("has the same keys and list lengths in Arabic and English", () => {
    expect(shape(ar)).toEqual(shape(en));
  });

  it("names the product in each page's own language", () => {
    expect(brandName("ar")).toBe("موفينج POS");
    expect(brandName("en")).toBe("Moving POS");
    expect(strings(ar).join("\n")).toContain(brand.name.ar);
    expect(strings(en).join("\n")).toContain(brand.name.en);
    // Arabic copy sets the Arabic family name; the Latin one stays on English pages.
    expect(strings(ar).some((s) => s.includes(brand.name.en))).toBe(false);
  });

  it("puts the product's name in every page title", () => {
    for (const [locale, c] of [["ar", ar], ["en", en]] as const) {
      for (const [key, meta] of Object.entries(c.meta)) {
        expect(meta.title, `${locale} meta.${key}`).toContain(brandName(locale));
      }
    }
  });

  it("never prints a retired product name", () => {
    for (const s of [...strings(ar), ...strings(en)]) {
      for (const name of RETIRED) expect(s).not.toMatch(name);
    }
  });
});

describe("brand assets", () => {
  const files = [
    "app/icon.svg",
    ...readdirSync(join(process.cwd(), "public/brand"))
      .filter((f) => f.endsWith(".svg"))
      .map((f) => `public/brand/${f}`),
  ];

  it.each(files)("%s is the Moving mark, titled Moving POS", (file) => {
    const svg = readFileSync(join(process.cwd(), file), "utf8");
    expect(svg).toMatch(/<title>Moving POS[^<]*<\/title>/);
    expect(svg).toContain('d="M24 8H56V40H16V56H8V32H24Z M32 16V32H48V16Z"');
    for (const name of RETIRED) expect(svg).not.toMatch(name);
  });
});
