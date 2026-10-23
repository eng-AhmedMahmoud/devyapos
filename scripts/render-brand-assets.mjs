// Renders the brand's baked rasters from HTML with headless Chrome:
//
//   app/apple-icon.png                     180 × 180  the iOS home-screen icon
//   public/brand/devyapos-icon-{192,512}.png          the mark for anything without CSS
//   public/og/og-{ar,en}.png               1200 × 630 the home page's Open Graph cards
//   public/og/og-<page>-{ar,en}.png        1200 × 630 one card per other page (ogImageUrl in lib/meta.ts)
//
// Chrome rather than `next/og`: satori rejects the GSUB tables of the Arabic
// faces the site sets (Reem Kufi, IBM Plex Sans Arabic) and fails the build.
// Moving Stores (devya-commerce apps/admin/scripts/render-og.mjs) and the
// moving.devya.dev umbrella site render theirs the same way. Copy comes from
// content/{ar,en}.ts, the pages from lib/routes.ts and the name from
// lib/brand.ts (Node strips their types).
//
//   node scripts/render-brand-assets.mjs   # needs Google Chrome and network (Google Fonts)
//
// Re-run after changing the hero copy, a page's <title>, the product name or
// the mark, and commit the PNGs. The mark's geometry is the one in
// components/Logo.tsx.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

/* The content trees import through the `@/` alias (content/ar.ts reads
   `@/lib/consent/copy`), which only TypeScript and the bundler know. Resolve
   it to the repo root here so Node can load the copy as-is; without this the
   script stopped running when the consent copy moved into lib/. */
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith("@/")) return nextResolve(specifier, context);
    const base = join(root, specifier.slice(2));
    const file = [`${base}.ts`, `${base}.tsx`, join(base, "index.ts")].find(existsSync);
    return nextResolve(file ? pathToFileURL(file).href : specifier, context);
  },
});

const { ar } = await import("../content/ar.ts");
const { en } = await import("../content/en.ts");
const { brand } = await import("../lib/brand.ts");
const { NOINDEX_PATHS, ogImagePath, routes } = await import("../lib/routes.ts");

const CHROME = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((path) => path && existsSync(path));
if (!CHROME) throw new Error("no Chrome found — set CHROME_BIN");

/* The light-theme mark for the icons (as Moving Stores bakes its own), and
   the dark theme for the cards — the bone mark on the night ground. */
const LIGHT = { tile: "#1a1612", glyph: "#f2ede3", window: "#e8a11a" };
const C = {
  night: "#15120f",
  ink: "#efe8da",
  muted: "#aba294",
  saffron: "#f0ae35",
  rule: "rgb(239 232 218 / .7)",
};
const GLYPH = "M24 8H56V40H16V56H8V32H24Z M32 16V32H48V16Z";
const mark = (size, { tile, glyph, window }) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 64 64"><rect width="64" height="64" rx="3" fill="${tile}"/><path fill="${glyph}" fill-rule="evenodd" d="${GLYPH}"/><rect x="32" y="16" width="16" height="16" fill="${window}"/></svg>`;

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function iconPage(size) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0}html,body{width:${size}px;height:${size}px;overflow:hidden;background:${LIGHT.tile}}svg{display:block}</style></head><body>${mark(size, LIGHT)}</body></html>`;
}

/**
 * What a page's card says, from the copy the page already prints: the home
 * card keeps the hero; every other page takes its <title> without the brand
 * half, split into a headline and a saffron second line at " | ", " — " or
 * ": ", under the label the site's own links give the page.
 */
function cardCopy(lang, c, path, key) {
  if (!path) {
    return { kick: c.hero.badge, line1: c.hero.line1, line2: c.hero.line2, chips: c.bridge.chips, url: brand.domain };
  }
  const name = brand.name[lang];
  const parts = c.meta[key].title.split(" | ").filter((p) => p !== name);
  let [line1, line2 = ""] = parts;
  if (!line2) {
    const at = line1.search(/ — |: /);
    if (at > 0) [line1, line2] = [line1.slice(0, at), line1.slice(at).replace(/^ — |^: /, "")];
  }
  const link = [...c.nav.links, ...c.nav.extra, ...c.footer.cols.flatMap((col) => col.links)].find(
    (l) => l.href === path,
  );
  // The page's own address in the footer, in place of the home card's chips.
  return { kick: link?.label ?? line1, line1, line2, chips: [], url: `${brand.domain}/${lang}${path}` };
}

function ogPage(lang, { kick, line1, line2, chips, url }) {
  const isAr = lang === "ar";
  const [family, product] = brand.wordmark[lang];
  // A long page title steps the headline down so it stays within three lines.
  const chars = line1.length + line2.length;
  const scale = chars <= 34 ? 1 : chars <= 50 ? 0.84 : 0.72;
  const size = Math.round((isAr ? 64 : 70) * scale);
  return `<!doctype html><html lang="${lang}" dir="${isAr ? "rtl" : "ltr"}"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400..700&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Sans+Arabic:wght@400;500&family=IBM+Plex+Mono:wght@500&display=block" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px}
body{background:${C.night};color:${C.ink};font-family:${isAr ? "'IBM Plex Sans Arabic','IBM Plex Sans'" : "'IBM Plex Sans','IBM Plex Sans Arabic'"},sans-serif;display:grid;grid-template-columns:minmax(0,1fr) 360px;overflow:hidden}
.l{padding:56px 56px 46px;display:flex;flex-direction:column;gap:30px;background-image:linear-gradient(rgb(239 232 218/.06) 1px,transparent 1px),linear-gradient(90deg,rgb(239 232 218/.06) 1px,transparent 1px);background-size:40px 40px}
.lock{display:flex;align-items:center;gap:20px;font-family:'Reem Kufi';font-size:38px;line-height:1}
.lock b{font-weight:700}.lock i{font-style:normal;font-weight:400;opacity:.7}
.kick{display:flex;align-items:center;gap:14px;font-size:${isAr ? 24 : 18}px;color:${C.muted};${isAr ? "" : "font-family:'IBM Plex Mono';letter-spacing:.1em;text-transform:uppercase;"}}
.kick:before{content:"";width:14px;height:14px;background:${C.saffron};flex:none}
h1{font-family:'Reem Kufi';font-weight:700;font-size:${size}px;line-height:${isAr ? 1.3 : 1.02};letter-spacing:${isAr ? "normal" : "-0.02em"}}
h1 em{display:block;font-style:normal;color:${C.saffron}}
.foot{margin-top:auto;display:flex;justify-content:space-between;align-items:baseline;gap:24px;font-size:18px;white-space:nowrap;color:${C.muted};border-top:1.5px solid ${C.rule};padding-top:18px}
.foot b{font-family:'IBM Plex Mono';font-weight:500;color:${C.ink};direction:ltr;unicode-bidi:isolate}
.r{background:${C.saffron};background-image:linear-gradient(rgb(26 22 18/.13) 1px,transparent 1px),linear-gradient(90deg,rgb(26 22 18/.13) 1px,transparent 1px);background-size:36px 36px;display:grid;place-items:center}
</style></head><body>
<div class="l"><div class="lock">${mark(58, { tile: C.ink, glyph: C.night, window: C.saffron })}<span><b>${family}</b> <i>${product}</i></span></div>
<p class="kick">${esc(kick)}</p>
<h1>${esc(line1)}${line2 ? ` <em>${esc(line2)}</em>` : ""}</h1>
<p class="foot"><span>${chips.map(esc).join(" · ")}</span><b>${esc(url)}</b></p></div>
<div class="r">${mark(216, LIGHT)}</div></body></html>`;
}

const jobs = [
  { html: iconPage(180), w: 180, h: 180, out: "app/apple-icon.png" },
  { html: iconPage(192), w: 192, h: 192, out: "public/brand/devyapos-icon-192.png" },
  { html: iconPage(512), w: 512, h: 512, out: "public/brand/devyapos-icon-512.png" },
  // Every page, indexed or not: a /terms link pasted into a chat still unfurls.
  ...[...routes, ...NOINDEX_PATHS.map((path) => ({ path, key: path.slice(1) }))].flatMap(
    ({ path, key }) =>
      [["ar", ar], ["en", en]].map(([lang, c]) => ({
        html: ogPage(lang, cardCopy(lang, c, path, key)),
        w: 1200,
        h: 630,
        out: `public${ogImagePath(lang, path)}`,
      })),
  ),
];

mkdirSync(join(root, "public/og"), { recursive: true });
const dir = mkdtempSync(join(tmpdir(), "moving-pos-assets-"));
try {
  for (const [i, job] of jobs.entries()) {
    const html = join(dir, `${i}.html`);
    writeFileSync(html, job.html);
    execFileSync(
      CHROME,
      [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        `--user-data-dir=${join(dir, "profile")}`,
        `--window-size=${job.w},${job.h}`,
        "--force-device-scale-factor=1",
        "--virtual-time-budget=8000",
        `--screenshot=${join(root, job.out)}`,
        `file://${html}`,
      ],
      { stdio: "ignore" },
    );
    console.log(`wrote ${job.out}`);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
