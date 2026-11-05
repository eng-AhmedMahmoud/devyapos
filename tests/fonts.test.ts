import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/*
 * IBM Plex Sans Arabic's fallbacks (docs/decisions/0009-arabic-fallback-metrics.md).
 * The layout lists them by name in next/font's options, the stylesheet that
 * scripts/font-fallbacks.mjs writes defines them, and the two must agree: a
 * name in one and not the other silently falls back to next/font's Arial
 * again, and the hero re-wraps on the swap (mobile CLS 0.135 on /ar).
 */

const root = join(__dirname, "..");
const layout = readFileSync(join(root, "app/[locale]/layout.tsx"), "utf8");
const css = readFileSync(join(root, "app/plex-arabic-fallbacks.css"), "utf8");

const FACE = "IBM Plex Sans Arabic";
const FAMILIES = [`${FACE} AR`, `${FACE} AR Android`, `${FACE} Rest`];

interface Rule {
  family: string;
  src: string;
  weight?: string;
  range?: string;
  size: number;
  ascent: string;
  descent: string;
  lineGap: string;
}

const rules: Rule[] = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map(([, body]) => {
  const get = (prop: string) => body.match(new RegExp(`${prop}:\\s*([^;]+);`))?.[1].trim();
  return {
    family: get("font-family")!.replace(/"/g, ""),
    src: get("src")!,
    weight: get("font-weight"),
    range: get("unicode-range"),
    size: Number.parseFloat(get("size-adjust")!),
    ascent: get("ascent-override")!,
    descent: get("descent-override")!,
    lineGap: get("line-gap-override")!,
  };
});

/** The Plex Arabic call in the layout, from `IBM_Plex_Sans_Arabic({` to its `});`. */
const plexCall = layout.slice(
  layout.indexOf("IBM_Plex_Sans_Arabic({"),
  layout.indexOf("});", layout.indexOf("IBM_Plex_Sans_Arabic({")),
);

describe("Plex Arabic's fallbacks", () => {
  it("replace next/font's Latin-sized fallback, in the layout, by the stylesheet's names, in order", () => {
    expect(plexCall).toMatch(/adjustFontFallback:\s*false/);
    const listed = [...(plexCall.match(/fallback:\s*\[([^\]]*)\]/)?.[1] ?? "").matchAll(/"'([^']+)'"/g)].map(
      (m) => m[1],
    );
    expect(listed).toEqual(FAMILIES);
    expect(layout).toContain('import "../plex-arabic-fallbacks.css";');
    expect([...new Set(rules.map((r) => r.family))]).toEqual(FAMILIES);
  });

  it.each(["AR", "AR Android"])("%s: covers every weight once, Arabic only, at a measured size", (suffix) => {
    const mine = rules.filter((r) => r.family === `${FACE} ${suffix}`);
    // 400, 500, 600 and 700, each its own class, end to end from 100 to 1000.
    expect(mine.map((r) => r.weight)).toEqual(["100 449", "450 549", "550 649", "650 1000"]);
    for (const rule of mine) {
      // Arabic only: the space and Latin keep next/font's fallback (the Rest face).
      expect(rule.range).toMatch(/^U\+0600-06FF,/);
      expect(rule.range).not.toMatch(/U\+0020|U\+00?[2-7][0-9A-F](?![0-9A-F])/);
      expect(rule.src).toMatch(/^local\(/);
      expect(rule.src).not.toMatch(/url\(/);
      expect(rule.size).toBeGreaterThan(95);
      expect(rule.size).toBeLessThan(140);
    }
  });

  it("sizes Arial's Arabic up, as measured: the Latin-sized 101.17 % set it about 15 % narrower than the face", () => {
    const regular = rules.find((r) => r.family === `${FACE} AR` && r.weight === "100 449")!;
    expect(regular.size).toBeGreaterThan(110);
  });

  it("keeps next/font's own fallback for everything that is not Arabic, as next/font computes it", () => {
    const require = createRequire(import.meta.url);
    const { getFallbackFontOverrideMetrics } = require(
      "next/dist/compiled/@next/font/dist/google/get-fallback-font-override-metrics.js",
    ) as { getFallbackFontOverrideMetrics: (family: string) => Record<string, string> };
    const next = getFallbackFontOverrideMetrics(FACE);
    const rest = rules.find((r) => r.family === `${FACE} Rest`)!;
    expect(rest.range).toBeUndefined();
    expect(rest.src).toBe(`local("${next.fallbackFont}")`);
    expect(`${rest.size.toFixed(2)}%`).toBe(next.sizeAdjust);
    expect([rest.ascent, rest.descent, rest.lineGap]).toEqual([
      next.ascentOverride,
      next.descentOverride,
      next.lineGapOverride,
    ]);
  });
});
