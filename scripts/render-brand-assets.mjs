// Renders the brand's baked rasters from HTML with headless Chrome:
//
//   app/apple-icon.png                     180 × 180  the iOS home-screen icon
//   public/brand/devyapos-icon-{192,512}.png          the mark for anything without CSS
//   public/og/og-{ar,en}.png               1200 × 630 the Open Graph cards
//
// Chrome rather than `next/og`: satori rejects the GSUB tables of the Arabic
// faces the site sets (Reem Kufi, IBM Plex Sans Arabic) and fails the build.
// Moving Stores (devya-commerce apps/admin/scripts/render-og.mjs) and the
// moving.devya.dev umbrella site render theirs the same way. Copy comes from
// content/{ar,en}.ts and the name from lib/brand.ts (Node strips their types).
//
//   node scripts/render-brand-assets.mjs   # needs Google Chrome and network (Google Fonts)
//
// Re-run after changing the hero copy, the product name or the mark, and
// commit the PNGs. The mark's geometry is the one in components/Logo.tsx.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { ar } from "../content/ar.ts";
import { en } from "../content/en.ts";
import { brand } from "../lib/brand.ts";

const CHROME = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((path) => path && existsSync(path));
if (!CHROME) throw new Error("no Chrome found — set CHROME_BIN");

const root = fileURLToPath(new URL("../", import.meta.url));

/* The light-theme mark for the icons (as Moving Stores bakes its own), and
   the dark theme the site boots into for the cards. */
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

function ogPage(lang, c) {
  const isAr = lang === "ar";
  const [family, product] = brand.wordmark[lang];
  return `<!doctype html><html lang="${lang}" dir="${isAr ? "rtl" : "ltr"}"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400..700&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Sans+Arabic:wght@400;500&family=IBM+Plex+Mono:wght@500&display=block" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px}
body{background:${C.night};color:${C.ink};font-family:${isAr ? "'IBM Plex Sans Arabic','IBM Plex Sans'" : "'IBM Plex Sans','IBM Plex Sans Arabic'"},sans-serif;display:grid;grid-template-columns:1fr 360px;overflow:hidden}
.l{padding:56px 56px 46px;display:flex;flex-direction:column;gap:30px;background-image:linear-gradient(rgb(239 232 218/.06) 1px,transparent 1px),linear-gradient(90deg,rgb(239 232 218/.06) 1px,transparent 1px);background-size:40px 40px}
.lock{display:flex;align-items:center;gap:20px;font-family:'Reem Kufi';font-size:38px;line-height:1}
.lock b{font-weight:700}.lock i{font-style:normal;font-weight:400;opacity:.7}
.kick{display:flex;align-items:center;gap:14px;font-size:${isAr ? 24 : 18}px;color:${C.muted};${isAr ? "" : "font-family:'IBM Plex Mono';letter-spacing:.1em;text-transform:uppercase;"}}
.kick:before{content:"";width:14px;height:14px;background:${C.saffron};flex:none}
h1{font-family:'Reem Kufi';font-weight:700;font-size:${isAr ? 64 : 70}px;line-height:${isAr ? 1.3 : 1.02};letter-spacing:${isAr ? "normal" : "-0.02em"}}
h1 em{display:block;font-style:normal;color:${C.saffron}}
.foot{margin-top:auto;display:flex;justify-content:space-between;align-items:baseline;gap:24px;font-size:18px;white-space:nowrap;color:${C.muted};border-top:1.5px solid ${C.rule};padding-top:18px}
.foot b{font-family:'IBM Plex Mono';font-weight:500;color:${C.ink};direction:ltr;unicode-bidi:isolate}
.r{background:${C.saffron};background-image:linear-gradient(rgb(26 22 18/.13) 1px,transparent 1px),linear-gradient(90deg,rgb(26 22 18/.13) 1px,transparent 1px);background-size:36px 36px;display:grid;place-items:center}
</style></head><body>
<div class="l"><div class="lock">${mark(58, { tile: C.ink, glyph: C.night, window: C.saffron })}<span><b>${family}</b> <i>${product}</i></span></div>
<p class="kick">${esc(c.hero.badge)}</p>
<h1>${esc(c.hero.line1)} <em>${esc(c.hero.line2)}</em></h1>
<p class="foot"><span>${c.bridge.chips.map(esc).join(" · ")}</span><b>${brand.domain}</b></p></div>
<div class="r">${mark(216, LIGHT)}</div></body></html>`;
}

const jobs = [
  { html: iconPage(180), w: 180, h: 180, out: "app/apple-icon.png" },
  { html: iconPage(192), w: 192, h: 192, out: "public/brand/devyapos-icon-192.png" },
  { html: iconPage(512), w: 512, h: 512, out: "public/brand/devyapos-icon-512.png" },
  { html: ogPage("ar", ar), w: 1200, h: 630, out: "public/og/og-ar.png" },
  { html: ogPage("en", en), w: 1200, h: 630, out: "public/og/og-en.png" },
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
