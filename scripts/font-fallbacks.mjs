#!/usr/bin/env node
// Arabic fallback metrics for IBM Plex Sans Arabic, the Arabic text face
// (docs/decisions/0009-arabic-fallback-metrics.md).
//
// While the face downloads, Arabic text is set in a local font, and when the
// face arrives the text must keep its line breaks. next/font sizes the face's
// one fallback (local Arial) from Latin letters: 101.17 %, where Arial's
// Arabic needs about 118 % to set as wide as Plex Arabic. So a first paint
// that beats the font sets Arabic about 15 % narrower, and the swap re-wraps
// the hero (mobile CLS 0.135 on /ar, docs/seo/audit-2026-11-04.md P4).
//
// This sets the site's own Arabic copy (content/ar.ts) in Chrome, in the face
// and in each local fallback, at each weight the site loads, and writes the
// size-adjust that makes the fallback's Arabic as wide as the face's:
//
//   desktop   Arial (macOS and Windows both ship it with Arabic glyphs)
//   android   Noto Naskh Arabic (Android's Arabic system face; no Arial there)
//
// The vertical overrides come from next/font's own metrics for the face
// (the ascent and descent it gives its Arial fallback, times that fallback's
// size-adjust), so both fallbacks sit on the same line box as the face.
// Everything that is not Arabic (the space, Latin words, punctuation) keeps
// next/font's fallback exactly: the face's Arabic file has no space or Latin,
// so those characters never come from the face and do not move at the swap.
//
//   pnpm fonts:fallbacks
//
// Measuring fetches the face and Noto Naskh Arabic from Google Fonts, the
// source next/font builds from; the site itself still loads nothing from a
// third party. Writes app/plex-arabic-fallbacks.css. Rerun when the face, its
// weights or the Arabic copy change a lot.
import { existsSync, writeFileSync } from "node:fs";
import { createRequire, registerHooks } from "node:module";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);

/* content/ar.ts imports through the `@/` alias; resolve it the way
   scripts/render-brand-assets.mjs does. */
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith("@/")) return nextResolve(specifier, context);
    const base = join(root, specifier.slice(2));
    const file = [`${base}.ts`, `${base}.tsx`, join(base, "index.ts")].find(existsSync);
    return nextResolve(file ? pathToFileURL(file).href : specifier, context);
  },
});

const FACE = "IBM Plex Sans Arabic";
/** The weights app/[locale]/layout.tsx loads, each its own class of fallback. */
const WEIGHTS = [400, 500, 600, 700];
/** Chrome is the browser the A/B and Lighthouse run; Google serves it woff2. */
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36";

const CHROME = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((path) => path && existsSync(path));
if (!CHROME) throw new Error("no Chrome found — set CHROME_BIN");

/** Google's stylesheet for a family at the site's weights. */
async function googleCss(family) {
  const name = family.replace(/ /g, "+");
  const res = await fetch(
    `https://fonts.googleapis.com/css2?family=${name}:wght@${WEIGHTS.join(";")}&display=block`,
    { headers: { "user-agent": UA } },
  );
  if (!res.ok) throw new Error(`no stylesheet for ${family}: ${res.status}`);
  return res.text();
}

/** The site's Arabic copy as lines of Arabic words, Latin, digits and marks of punctuation removed. */
async function arabicLines() {
  const { ar } = await import("../content/ar.ts");
  const strings = [];
  const walk = (node) => {
    if (typeof node === "string") strings.push(node);
    else if (node && typeof node === "object") Object.values(node).forEach(walk);
  };
  walk(ar);
  const words = strings
    .flatMap((s) => s.replace(/\{[^{}]*\}/g, " ").split(/\s+/))
    .map((w) => w.replace(/[^ء-يً-ٟ٠-٩ٰ-ۓ]/g, ""))
    .filter(Boolean);
  const lines = [];
  for (let i = 0; i < words.length; i += 120) lines.push(words.slice(i, i + 120).join(" "));
  return { lines, words: words.length };
}

const { lines, words } = await arabicLines();
const [faceCss, naskhCss] = await Promise.all([googleCss(FACE), googleCss("Noto Naskh Arabic")]);

const page = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
${faceCss}
${naskhCss.replace(/font-family: 'Noto Naskh Arabic'/g, "font-family: 'FB android'")}
@font-face{font-family:'FB desktop';src:local('Arial'),local('ArialMT');font-weight:100 549}
@font-face{font-family:'FB desktop';src:local('Arial Bold'),local('Arial-BoldMT');font-weight:550 1000}
span{white-space:pre;font-size:100px;display:block;width:max-content}
</style></head><body></body></html>`;

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const tab = await browser.newPage();
await tab.setContent(page);

/** The Arabic words' width per em, spaces taken out, in `family` at `weight`. */
const measure = (family, weight) =>
  tab.evaluate(
    async ({ family, weight, lines }) => {
      const font = `${weight} 100px '${family}'`;
      await document.fonts.load(font, lines.join(" "));
      const width = (text) => {
        const span = document.createElement("span");
        span.style.font = font;
        span.textContent = text;
        document.body.append(span);
        const w = span.getBoundingClientRect().width;
        span.remove();
        return w;
      };
      const space = width(" ".repeat(200)) / 200;
      let arabic = 0;
      for (const line of lines) arabic += width(line) - (line.split(" ").length - 1) * space;
      return arabic / 100;
    },
    { family, weight, lines },
  );

/* The face's vertical metrics, from the fallback next/font computes for it. */
const { getFallbackFontOverrideMetrics } = require(
  "next/dist/compiled/@next/font/dist/google/get-fallback-font-override-metrics.js",
);
const nextFallback = getFallbackFontOverrideMetrics(FACE);
const pctOf = (s) => Number.parseFloat(s) / 100;
const vertical = {
  ascent: pctOf(nextFallback.ascentOverride) * pctOf(nextFallback.sizeAdjust),
  descent: pctOf(nextFallback.descentOverride) * pctOf(nextFallback.sizeAdjust),
  lineGap: pctOf(nextFallback.lineGapOverride) * pctOf(nextFallback.sizeAdjust),
};

const pct = (value) => `${(Math.round(value * 10000) / 100).toFixed(2)}%`;
const metrics = {};
for (const weight of WEIGHTS) {
  const face = await measure(FACE, weight);
  metrics[weight] = {};
  for (const target of ["desktop", "android"]) {
    const size = face / (await measure(`FB ${target}`, weight));
    metrics[weight][target] = {
      size: pct(size),
      ascent: pct(vertical.ascent / size),
      descent: pct(vertical.descent / size),
      lineGap: pct(vertical.lineGap / size),
    };
  }
  process.stdout.write(`${weight} ${JSON.stringify(metrics[weight])}\n`);
}
await browser.close();

/** The Arabic blocks, and the joiners and direction marks Arabic text uses. */
const ARABIC_RANGE = "U+0600-06FF,U+0750-077F,U+0870-08FF,U+200C-200F,U+FB50-FDFF,U+FE70-FEFF";
/** Each measured class, the weights it covers, and which local file sets it. */
const CLASSES = {
  400: { range: "100 449", local: "regular" },
  500: { range: "450 549", local: "regular" },
  600: { range: "550 649", local: "bold" },
  700: { range: "650 1000", local: "bold" },
};
const TARGETS = {
  desktop: {
    family: `${FACE} AR`,
    regular: ["Arial", "ArialMT"],
    bold: ["Arial Bold", "Arial-BoldMT"],
  },
  android: {
    family: `${FACE} AR Android`,
    regular: ["Noto Naskh Arabic UI", "NotoNaskhArabicUI-Regular", "Noto Naskh Arabic", "NotoNaskhArabic-Regular"],
    bold: ["Noto Naskh Arabic UI Bold", "NotoNaskhArabicUI-Bold", "Noto Naskh Arabic Bold", "NotoNaskhArabic-Bold"],
  },
};

const rules = [];
for (const [target, t] of Object.entries(TARGETS)) {
  for (const [weight, { range, local }] of Object.entries(CLASSES)) {
    const m = metrics[weight][target];
    rules.push(
      `@font-face {\n  font-family: "${t.family}";\n  src: ${t[local].map((n) => `local("${n}")`).join(", ")};\n` +
        `  font-weight: ${range};\n  unicode-range: ${ARABIC_RANGE};\n  size-adjust: ${m.size};\n` +
        `  ascent-override: ${m.ascent};\n  descent-override: ${m.descent};\n  line-gap-override: ${m.lineGap};\n}`,
    );
  }
}
rules.push(
  `@font-face {\n  font-family: "${FACE} Rest";\n  src: local("${nextFallback.fallbackFont}");\n` +
    `  size-adjust: ${nextFallback.sizeAdjust};\n  ascent-override: ${nextFallback.ascentOverride};\n` +
    `  descent-override: ${nextFallback.descentOverride};\n  line-gap-override: ${nextFallback.lineGapOverride};\n}`,
);

const out = `/*
 * Generated by scripts/font-fallbacks.mjs from ${words} Arabic words of
 * content/ar.ts, measured in Chrome. Do not edit by hand; rerun the script.
 *
 * Fallbacks for IBM Plex Sans Arabic while it downloads
 * (docs/decisions/0009-arabic-fallback-metrics.md): its Arabic in local Arial
 * (macOS, Windows) or Noto Naskh Arabic (Android), sized so a line of Arabic
 * is as wide as in the face, one rule per weight class. "${FACE} Rest" is
 * next/font's own Arial fallback for the face, unchanged, for everything that
 * is not Arabic. app/[locale]/layout.tsx lists the three after the face.
 */
${rules.join("\n")}
`;
writeFileSync(join(root, "app/plex-arabic-fallbacks.css"), out);
process.stdout.write(`wrote app/plex-arabic-fallbacks.css (${words} words)\n`);
