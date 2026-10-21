import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { brand, whatsappLink } from "@/lib/brand";

/**
 * Recomputes the contrast of the text pairs from `app/globals.css` itself, in
 * both themes — Moving Stores and the moving.devya.dev umbrella site keep the
 * same check — so a palette edit that drops a pair under WCAG AA fails here,
 * not in Lighthouse.
 */
const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`no block for ${selector}`);
  const body = css.slice(start, css.indexOf("}", start));
  return Object.fromEntries(
    [...body.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map((m) => [m[1], m[2]]),
  );
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const themes = {
  light: block(':root[data-theme="light"]'),
  dark: block(':root[data-theme="dark"]'),
};

describe("palette contrast (WCAG AA, 4.5:1 for text)", () => {
  for (const [name, t] of Object.entries(themes)) {
    it(`${name}: body, muted and accent text on the page, the bands and the cards`, () => {
      for (const ground of [t.bg, t.surface, t["surface-2"]]) {
        expect(contrast(t.ink, ground)).toBeGreaterThanOrEqual(7);
        expect(contrast(t["ink-dim"], ground)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(t.caramel, ground)).toBeGreaterThanOrEqual(4.5);
      }
    });

    it(`${name}: buttons — the primary, its saffron hover`, () => {
      expect(contrast(t["on-brand"], t.brand)).toBeGreaterThanOrEqual(7);
      expect(contrast(t["on-saffron"], t.saffron)).toBeGreaterThanOrEqual(4.5);
    });

    // `.band-espresso` re-points muted type to the band's dim and the amber
    // accent to saffron, so those are the pairs the band actually shows.
    it(`${name}: type on the dark band`, () => {
      expect(contrast(t["on-espresso"], t.espresso)).toBeGreaterThanOrEqual(7);
      expect(contrast(t["on-espresso-dim"], t.espresso)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t.saffron, t.espresso)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t.gold, t.espresso)).toBeGreaterThanOrEqual(4.5);
    });

    // The mark is a logo (exempt from 1.4.11), but its tile still has to stand
    // off the page and its letter off the tile, or the flip has gone wrong.
    it(`${name}: the mark's tile stands off the page, its letter off the tile`, () => {
      expect(contrast(t["mark-tile"], t.bg)).toBeGreaterThanOrEqual(3);
      expect(contrast(t["mark-glyph"], t["mark-tile"])).toBeGreaterThanOrEqual(7);
    });
  }
});

describe("brand", () => {
  it("lives on devya.dev, never devya.solutions", () => {
    expect(brand.url).toBe(`https://${brand.domain}`);
    expect(brand.domain.endsWith(".devya.dev")).toBe(true);
    expect(brand.parent.url).toBe("https://devya.dev");
  });

  it("splits the lockup into the family name and the product", () => {
    expect(brand.wordmark.ar.join(" ")).toBe(brand.name.ar);
    expect(brand.wordmark.en.join(" ")).toBe(brand.name.en);
  });

  it("builds wa.me links with the first line typed and encoded", () => {
    expect(whatsappLink("أهلاً & hi", "float")).toBe(
      `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("أهلاً & hi\n\n[P-float]")}`,
    );
  });
});
