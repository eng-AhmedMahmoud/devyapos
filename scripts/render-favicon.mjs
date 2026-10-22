// Renders app/favicon.ico: the Moving mark at 16, 32 and 48 px, each a PNG
// inside one ICO container (every browser since IE 11 reads PNG entries).
//
// /favicon.ico is requested by browsers, crawlers and bookmark tools whatever
// the page's <link rel=icon> says, and it answered 404. Next serves
// app/favicon.ico as-is. The mark and its light-theme colours are the ones
// scripts/render-brand-assets.mjs bakes into apple-icon.png and the 192/512
// PNGs; it lives apart from that script because it needs no copy, fonts or
// network, only Chrome.
//
//   node scripts/render-favicon.mjs
//
// Re-run after changing the mark (components/Logo.tsx) and commit the file.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const CHROME = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((path) => path && existsSync(path));
if (!CHROME) throw new Error("no Chrome found — set CHROME_BIN");

const root = fileURLToPath(new URL("../", import.meta.url));
const LIGHT = { tile: "#1a1612", glyph: "#f2ede3", window: "#e8a11a" };
const GLYPH = "M24 8H56V40H16V56H8V32H24Z M32 16V32H48V16Z";
const SIZES = [16, 32, 48];
/* Headless Chrome stalls on a window as small as an icon and will not scale
   below 0.5, so each size is drawn in a window twice as large at 0.5. */
const SCALE = 0.5;

const page = (box) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0}html,body{width:${box}px;height:${box}px;overflow:hidden;background:transparent}svg{display:block}</style></head><body><svg width="${box}" height="${box}" viewBox="0 0 64 64"><rect width="64" height="64" rx="3" fill="${LIGHT.tile}"/><path fill="${LIGHT.glyph}" fill-rule="evenodd" d="${GLYPH}"/><rect x="32" y="16" width="16" height="16" fill="${LIGHT.window}"/></svg></body></html>`;

/** Width and height from a PNG's IHDR chunk. */
function pngSize(buf) {
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/** An ICO file whose entries are the given PNGs, in order. */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map((png) => {
    const { width, height } = pngSize(png);
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // no palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...pngs]);
}

const dir = mkdtempSync(join(tmpdir(), "moving-pos-favicon-"));
try {
  const pngs = SIZES.map((size) => {
    const html = join(dir, `${size}.html`);
    const out = join(dir, `${size}.png`);
    const box = size / SCALE;
    writeFileSync(html, page(box));
    execFileSync(
      CHROME,
      [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        // A transparent page makes Chrome write RGBA, which the ICO decoders
        // (Turbopack's among them) require of a PNG entry; the tile's rounded
        // corners come out transparent too.
        "--default-background-color=00000000",
        `--user-data-dir=${join(dir, "profile")}`,
        `--window-size=${box},${box}`,
        `--force-device-scale-factor=${SCALE}`,
        `--screenshot=${out}`,
        `file://${html}`,
      ],
      { stdio: "ignore", timeout: 30_000 },
    );
    const png = readFileSync(out);
    const RGBA = 6; // IHDR colour type
    if (png.readUInt8(25) !== RGBA) throw new Error(`Chrome wrote a non-RGBA PNG for ${size}px`);
    const got = pngSize(png);
    if (got.width !== size || got.height !== size) {
      throw new Error(`Chrome rendered ${got.width}×${got.height} for ${size}px`);
    }
    return png;
  });
  writeFileSync(join(root, "app/favicon.ico"), ico(pngs));
  console.log(`wrote app/favicon.ico (${SIZES.join(", ")} px)`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
