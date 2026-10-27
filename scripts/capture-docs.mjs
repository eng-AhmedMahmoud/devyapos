// Captures the help centre's screenshots — Arabic and English, desktop and
// phone — from a Moving POS instance seeded with the demo tenant, into
// public/docs/shots/ as WebP, and records what it shot in
// content/docs/shots.captured.json, which the figures read
// (components/docs/Figure.tsx). A slot that has not been shot renders as a
// drawn placeholder, so running this is never required to build.
//
// Adapted from the Moving family's umbrella help centre (moving-landing
// scripts/capture-docs.mjs). The instance is the one you run: the bohub-pos
// apps on any origin, each given in the environment, so no host is typed in
// this repo's sources.
//
//   CAPTURE_ORIGIN_POS_ADMIN=https://…      admin-app (the back office)
//   CAPTURE_ORIGIN_POS_REGISTER=https://…   pos-app (register, shift, kitchen display)
//   CAPTURE_ORIGIN_POS_ORDERING=https://…   shop-app (the ordering site)
//   CAPTURE_ADMIN_EMAIL, CAPTURE_POS_EMAIL   demo-tenant accounts (…@demo.devya.dev)
//   CAPTURE_POS_MANAGER_EMAIL                 the demo branch manager, for slots marked `asManager`
//   CAPTURE_DEMO_PASSWORD                     their password (the local seed's SEED_PASSWORD)
//
//   node scripts/capture-docs.mjs                       # every slot whose surface has an origin
//   node scripts/capture-docs.mjs --surface pos-admin
//   node scripts/capture-docs.mjs --only pos-register-shift,pos-reports-daily
//   node scripts/capture-docs.mjs --locale ar --device phone
//   node scripts/capture-docs.mjs --missing             # only what is not captured yet
//
// The rules, enforced here rather than left to whoever runs it:
//   1. Only the surfaces in content/docs/surfaces.ts, and every URL stays on
//      its surface's origin; a page that redirects elsewhere is skipped.
//   2. Signed-in surfaces sign in only as an account in the demo tenant's
//      email domain — the demo's catalogue is fictional, so a screenshot can
//      never show a client's menu, staff or customers.
//   3. Read-only over HTTP: every request that is not GET, HEAD or OPTIONS
//      is blocked but the sign-in itself and Socket.IO's transport. The
//      socket carries the live order feed; it is not inspected, so what an
//      app emits on load (its own subscriptions) goes through — one more
//      reason to point this only at a demo-seeded instance.
//   4. The password is typed only into the surface's own sign-in page, and
//      TLS errors are ignored only for a local (.localhost or loopback) origin.
//
// One browser, one page at a time: the machine this runs on is shared.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { DEVICES, SHOTS, SURFACES } from "../content/docs/shots.ts";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const OUT_DIR = `${ROOT}public/docs/shots/`;
const MANIFEST = `${ROOT}content/docs/shots.captured.json`;
const LOCALES = ["ar", "en"];
const DEMO_DOMAIN = "demo.devya.dev";

const { values: args } = parseArgs({
  options: {
    surface: { type: "string" },
    only: { type: "string" },
    locale: { type: "string" },
    device: { type: "string" },
    missing: { type: "boolean", default: false },
    headed: { type: "boolean", default: false },
  },
});
const only = args.only ? new Set(args.only.split(",").map((s) => s.trim())) : null;
const locales = args.locale ? [args.locale] : LOCALES;
const devices = args.device ? [args.device] : Object.keys(DEVICES);
for (const l of locales) if (!LOCALES.includes(l)) throw new Error(`unknown locale ${l}`);
for (const d of devices) if (!DEVICES[d]) throw new Error(`unknown device ${d}`);
if (only) for (const id of only) if (!SHOTS[id]) throw new Error(`unknown slot ${id}`);

const originOf = (name) => process.env[`CAPTURE_ORIGIN_${name.toUpperCase().replaceAll("-", "_")}`];
const ACCOUNTS = { admin: "CAPTURE_ADMIN_EMAIL", pos: "CAPTURE_POS_EMAIL", manager: "CAPTURE_POS_MANAGER_EMAIL" };

/** The slots this run is about, grouped by surface. */
const bySurface = new Map();
for (const [id, spec] of Object.entries(SHOTS)) {
  // tests/help-centre.test.ts fails the build on an unknown surface; here it is only skipped.
  if (!SURFACES[spec.surface]) {
    console.log(`skip ${id}: unknown surface ${spec.surface}`);
    continue;
  }
  if (args.surface && spec.surface !== args.surface) continue;
  if (only && !only.has(id)) continue;
  if (!bySurface.has(spec.surface)) bySurface.set(spec.surface, []);
  bySurface.get(spec.surface).push([id, spec]);
}

const report = [];
function note(line) {
  report.push(line);
  console.log(line);
}

const isRead = (method) => ["GET", "HEAD", "OPTIONS"].includes(method);
/** A local instance behind portless has a certificate the browser does not know. */
const isLocal = (origin) => /^https?:\/\/([a-z0-9-]+\.)*localhost(:\d+)?$|^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin);
const urlFor = (surface, origin, locale, path) =>
  surface.url.replace("{origin}", origin).replace("{locale}", locale).replace("{path}", path);

/** A browser context for one surface, locale and device: read-only, language set before load. */
async function openContext(browser, surface, origin, locale, device, storageState) {
  const context = await browser.newContext({
    ...DEVICES[device],
    locale: locale === "ar" ? "ar-EG" : "en-US",
    colorScheme: "light",
    reducedMotion: "reduce",
    serviceWorkers: "block",
    ignoreHTTPSErrors: isLocal(origin),
    storageState,
  });
  if (surface.storage) {
    const entries = Object.entries(surface.storage).map(([k, v]) => [k, v.replace("{locale}", locale)]);
    await context.addInitScript((entries) => {
      try {
        for (const [k, v] of entries) localStorage.setItem(k, v);
      } catch {}
    }, entries);
  }
  await context.route("**/*", (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const sameOrigin = url.origin === origin;
    // Socket.IO's long-polling transport sends its packets as POSTs: that is
    // the live order feed the kitchen display listens on, not a write, and
    // blocking it put "Disconnected" on every kitchen screen.
    const socket = sameOrigin && /^\/socket\.io(\/|$)/.test(url.pathname);
    // Off-origin requests are font and image loads at most; only reads go anywhere.
    return socket || (isRead(req.method()) && (sameOrigin || req.resourceType() !== "document"))
      ? route.continue()
      : route.abort("blockedbyclient");
  });
  return context;
}

/**
 * Signs in once per surface through the app's own form and returns the
 * session, reused by every locale × device context (sign-in is rate limited).
 * The one write a run makes.
 */
async function signIn(browser, origin, account) {
  const email = process.env[ACCOUNTS[account]];
  const password = process.env.CAPTURE_DEMO_PASSWORD;
  if (!email || !password) return { why: `set ${ACCOUNTS[account]} and CAPTURE_DEMO_PASSWORD` };
  if (!email.toLowerCase().endsWith(`@${DEMO_DOMAIN}`)) return { why: `${email} is not a ${DEMO_DOMAIN} account` };
  const ctx = await browser.newContext({ serviceWorkers: "block", ignoreHTTPSErrors: isLocal(origin) });
  await ctx.route("**/*", (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const sameOrigin = url.origin === origin;
    const signInCall = sameOrigin && url.pathname.endsWith("/auth/login");
    const read = isRead(req.method()) && (sameOrigin || req.resourceType() !== "document");
    return read || signInCall ? route.continue() : route.abort("blockedbyclient");
  });
  try {
    const page = await ctx.newPage();
    await page.goto(`${origin}/login`, { waitUntil: "domcontentloaded", timeout: 90_000 });
    // The form submits natively until it hydrates; wait for React first.
    await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
    await page.waitForTimeout(1500);
    // Never type the password into a page the sign-in redirected to.
    if (new URL(page.url()).origin !== origin) return { why: `the sign-in page is not on ${origin}` };
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 60_000 });
    if (new URL(page.url()).origin !== origin) return { why: `sign-in left ${origin}` };
    return { state: await ctx.storageState() };
  } catch (e) {
    return { why: `sign-in failed: ${e.message.split("\n")[0]}` };
  } finally {
    await ctx.close();
  }
}

async function settle(page, spec) {
  // A page with a live socket or a poll never goes network-idle: wait a
  // little for its data, then rely on `waitFor` and the fixed pause below.
  await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  for (const click of spec.clicks ?? []) {
    await page.locator(click).first().click({ timeout: 20_000 });
    await page.waitForLoadState("networkidle", { timeout: 5_000 }).catch(() => {});
    await page.waitForTimeout(500);
  }
  // After the clicks: what a slot waits for is often what a click opens.
  if (spec.waitFor) await page.locator(spec.waitFor).first().waitFor({ timeout: 30_000 });
  if (spec.scrollTo) await page.locator(spec.scrollTo).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200 + (spec.delay ?? 0));
}

/** One screenshot, viewport or element, saved as WebP under its published name. */
async function shoot(page, id, spec, locale, device) {
  const options = { animations: "disabled", caret: "hide" };
  const png = spec.clip
    ? await page.locator(spec.clip).first().screenshot(options)
    : await page.screenshot({ ...options, fullPage: !!spec.fullPage });
  return sharp(png).webp({ quality: 80, effort: 5 }).toFile(`${OUT_DIR}${id}.${locale}.${device}.webp`);
}

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};

function record(id, surface, spec, locale, device, size) {
  manifest[id] ??= { capturedAt: "", source: "", images: {} };
  manifest[id].images[locale] ??= {};
  manifest[id].images[locale][device] = { w: size.width, h: size.height };
  manifest[id].capturedAt = new Date().toISOString().slice(0, 10);
  // The app and the path, never the origin it happened to run on.
  manifest[id].source = `${surface.app}${spec.path || "/"}`;
}

function writeManifest() {
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(MANIFEST, `${JSON.stringify(sorted, null, 2)}\n`);
}

/** Shoots one surface's slots in one locale on one device. */
async function run(browser, surface, origin, slots, locale, device, storageState) {
  const context = await openContext(browser, surface, origin, locale, device, storageState);
  try {
    const page = await context.newPage();
    for (const [id, spec] of slots) {
      const at = `${locale}/${device}`;
      try {
        const requested = urlFor(surface, origin, locale, spec.path);
        const response = await page.goto(requested, { waitUntil: "domcontentloaded", timeout: 90_000 });
        if (response && response.status() >= 400) throw new Error(`status ${response.status()}`);
        await settle(page, spec);
        const now = new URL(page.url());
        if (now.origin !== origin) {
          note(`skip ${id} ${at}: left for ${now.origin}`);
          continue;
        }
        if (now.pathname.startsWith("/login") && !spec.path.startsWith("/login")) {
          note(`skip ${id} ${at}: signed out (redirected to the sign-in page)`);
          continue;
        }
        const size = await shoot(page, id, spec, locale, device);
        record(id, surface, spec, locale, device, size);
        // Written after every shot, so a run that is stopped keeps what it shot.
        writeManifest();
        note(`shot ${id} ${at} ${size.width}×${size.height} ${Math.round(size.size / 1024)} KB`);
      } catch (e) {
        note(`fail ${id} ${at}: ${e.message.split("\n")[0]}`);
      }
    }
  } finally {
    await context.close();
  }
}

mkdirSync(OUT_DIR, { recursive: true });
const browser = await chromium.launch({ headless: !args.headed });

try {
  for (const [surfaceName, slots] of bySurface) {
    const surface = SURFACES[surfaceName];
    const origin = originOf(surfaceName);
    if (!origin) {
      note(`skip ${surfaceName}: set CAPTURE_ORIGIN_${surfaceName.toUpperCase().replaceAll("-", "_")}`);
      continue;
    }
    const base = new URL(origin).origin;

    let signedIn;
    let manager;
    if (surface.auth) {
      const result = await signIn(browser, base, surface.auth.app);
      if (result.why) {
        note(`skip ${surfaceName}: ${result.why}`);
        continue;
      }
      signedIn = result.state;
      if (slots.some(([, spec]) => spec.asManager)) {
        const m = await signIn(browser, base, "manager");
        if (m.why) note(`skip ${surfaceName}'s manager slots: ${m.why}`);
        else manager = m.state;
      }
    }

    for (const locale of locales) {
      for (const device of devices) {
        const todo = slots.filter(
          ([id, spec]) =>
            spec.devices.includes(device) && !(args.missing && manifest[id]?.images[locale]?.[device]),
        );
        const signedOut = todo.filter(([, spec]) => spec.signedOut);
        const asManager = todo.filter(([, spec]) => spec.asManager && !spec.signedOut);
        const rest = todo.filter(([, spec]) => !spec.signedOut && !spec.asManager);
        if (signedOut.length) await run(browser, surface, base, signedOut, locale, device, undefined);
        if (asManager.length && manager) await run(browser, surface, base, asManager, locale, device, manager);
        if (rest.length) await run(browser, surface, base, rest, locale, device, signedIn);
      }
    }
  }
} finally {
  await browser.close();
  writeManifest();
}

const count = (word) => report.filter((l) => l.startsWith(word)).length;
console.log(`\n${count("shot")} shot · ${count("skip")} skipped · ${count("fail")} failed`);
