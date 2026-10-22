// First-load JS budget, checked after `pnpm build` (CI runs it right after the
// Build step):
//
//   node scripts/check-bundle.mjs                  # reads .next/, fails over budget
//   node scripts/check-bundle.mjs --dir <build dir> --budget-kb <n>
//
// "First-load JS" is every script a page's prerendered HTML loads, measured
// gzipped (level 9, the figure `next build` used to print). The nomodule
// polyfill is left out: no browser that runs modules downloads it. Every page
// here is prerendered, so `.next/server/app/**/*.html` is the whole site; a
// page that turns dynamic has no HTML at build time and drops out of the
// check, which the page count in the output makes visible.
//
// Why a budget at all: until #21 every page shipped both locales' full copy
// (content/ar.ts and content/en.ts, about 59 KB gzip) because client
// components imported the content module. Nothing noticed for weeks. The
// budget is the measured maximum after that fix plus about 10% headroom, so an
// ordinary feature fits and a second copy of the site does not.
//
//   2026-10-22, main before #21: max 225.6 KB (/ar, /en), min 216.8 KB
//   2026-10-22, with #21:        max 167.9 KB (/ar, /en), min 159.1 KB
//
// Raise BUDGET_KB deliberately, in its own commit that says what grew and why.

import { appendFileSync, existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

/** Per page, KB of gzip (1 KB = 1024 bytes). 167.9 KB measured + ~10%. */
export const BUDGET_KB = 185;

/**
 * The `/_next/static/…js` files an HTML page loads with a `<script src>`, in
 * document order and once each. Preload hints are not counted on their own:
 * every preloaded script also has its `<script>` tag. A query string (Next's
 * `?dpl=` deployment id) is not part of the file name.
 *
 * @param {string} html
 * @returns {string[]} paths relative to the build directory, e.g. `static/chunks/a1.js`
 */
export function firstLoadScripts(html) {
  const files = [];
  for (const [tag] of html.matchAll(/<script\b[^>]*>/gi)) {
    if (/\snomodule\b/i.test(tag)) continue;
    const src = /\ssrc="[^"]*?\/_next\/(static\/[^"?#]+\.js)(?:[?#][^"]*)?"/i.exec(tag);
    if (src && !files.includes(src[1])) files.push(src[1]);
  }
  return files;
}

/** @param {string} dir @returns {string[]} */
function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith(".html") ? [path] : [];
  });
}

/**
 * First-load JS of every prerendered page in a build directory.
 *
 * @param {string} buildDir the `.next` directory (or one laid out like it)
 * @returns {{ page: string, scripts: number, bytes: number, gzip: number }[]} sorted largest first
 */
export function measure(buildDir) {
  const appDir = join(buildDir, "server", "app");
  if (!existsSync(appDir)) return [];
  /** @type {Map<string, { bytes: number, gzip: number }>} */
  const sizes = new Map();
  const sizeOf = (/** @type {string} */ file) => {
    let size = sizes.get(file);
    if (!size) {
      const body = readFileSync(join(buildDir, file));
      size = { bytes: body.length, gzip: gzipSync(body, { level: 9 }).length };
      sizes.set(file, size);
    }
    return size;
  };
  return htmlFiles(appDir)
    .map((path) => {
      const page = `/${relative(appDir, path).split(sep).join("/").replace(/\.html$/, "")}`;
      const scripts = firstLoadScripts(readFileSync(path, "utf8"));
      let bytes = 0;
      let gzip = 0;
      for (const file of scripts) {
        const size = sizeOf(file);
        bytes += size.bytes;
        gzip += size.gzip;
      }
      return { page, scripts: scripts.length, bytes, gzip };
    })
    .sort((a, b) => b.gzip - a.gzip || a.page.localeCompare(b.page));
}

/**
 * @param {{ page: string, gzip: number }[]} rows
 * @param {number} budgetKb
 */
export function overBudget(rows, budgetKb) {
  return rows.filter((row) => row.gzip > budgetKb * 1024);
}

const kb = (/** @type {number} */ bytes) => (bytes / 1024).toFixed(1);

/** @param {string} name */
function arg(name) {
  const at = process.argv.indexOf(name);
  return at > 0 ? process.argv[at + 1] : undefined;
}

function main() {
  const buildDir = arg("--dir") ?? ".next";
  const budget = Number(arg("--budget-kb") ?? BUDGET_KB);
  if (!(budget > 0)) {
    console.error("check-bundle: --budget-kb must be a positive number of KB.");
    process.exit(1);
  }
  const rows = measure(buildDir);
  if (rows.length === 0) {
    console.error(`check-bundle: no prerendered pages under ${join(buildDir, "server", "app")} — run \`pnpm build\` first.`);
    process.exit(1);
  }

  const over = overBudget(rows, budget);
  const lines = rows.map(
    (row) =>
      `${row.page.padEnd(28)} ${kb(row.gzip).padStart(7)} KB gzip  ${kb(row.bytes).padStart(7)} KB raw  ${String(row.scripts).padStart(2)} scripts${
        row.gzip > budget * 1024 ? "  OVER BUDGET" : ""
      }`,
  );
  console.log(`First-load JS per page (budget ${budget} KB gzip, ${rows.length} pages)\n`);
  console.log(lines.join("\n"));

  if (process.env.GITHUB_STEP_SUMMARY) {
    const table = rows.map((row) => `| ${row.page} | ${kb(row.gzip)} | ${kb(row.bytes)} | ${row.scripts} |`);
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      [
        `### First-load JS (budget ${budget} KB gzip)`,
        "",
        "| Page | KB gzip | KB raw | Scripts |",
        "| --- | ---: | ---: | ---: |",
        ...table,
        "",
      ].join("\n"),
    );
  }

  if (over.length > 0) {
    console.error(
      `\ncheck-bundle: ${over.length} page(s) over the ${budget} KB budget: ${over.map((row) => row.page).join(", ")}.`,
    );
    process.exit(1);
  }
  console.log(`\nAll ${rows.length} pages within ${budget} KB (largest ${kb(rows[0].gzip)} KB, ${rows[0].page}).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
