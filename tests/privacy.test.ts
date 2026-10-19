import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import { consent } from "@/lib/consent/config";
import { ATTRIBUTION_KEY } from "@/lib/leads";

/*
 * Keeps docs/compliance/gdpr-audit.md true: the only optional thing on this
 * site is the "marketing" campaign record, and it waits for consent. A
 * tracker, a third-party script or font, an embed, a cookie, or a lead in the
 * logs fails here until it goes through the consent design
 * (lib/consent/config.ts) and the cookie table.
 */

const root = join(__dirname, "..");
const SOURCE_DIRS = ["app", "components", "lib", "content", "i18n"];

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(tsx?|css|mjs)$/.test(name) ? [path] : [];
  });
}

const sources = SOURCE_DIRS.flatMap((d) => files(join(root, d))).map((path) => ({
  path: relative(root, path),
  text: readFileSync(path, "utf8"),
}));

/** Hosts the source may name: this site, its family, and plain navigation targets. */
const ALLOWED_HOSTS = new Set([
  "pos.devya.dev",
  "devya.dev",
  "wa.me",
  "schema.org",
  "www.w3.org",
  // Plain links, never loaded by the page.
  "www.instagram.com",
  "www.facebook.com",
  "bohub-c4.vercel.app",
]);

describe("privacy", () => {
  it("sets no locale cookie", () => {
    expect(routing.localeCookie).toBe(false);
  });

  it("asks only about the campaign record, and cleans it up on withdrawal", () => {
    expect(consent.config.categories).toEqual(["marketing"]);
    expect(consent.config.cleanup?.marketing?.storage).toEqual([ATTRIBUTION_KEY]);
    expect(consent.config.legacyKeys).toContain("devyapos.consent.v1");
  });

  it("never logs a lead — only its id and coarse funnel fields", () => {
    const route = readFileSync(join(root, "app", "api", "lead", "route.ts"), "utf8");
    const forbidden = [
      /JSON\.stringify\(/, // a whole object
      /\bpayload\b(?!\.)/, // the payload itself
      /\.lead\.(?!locale|branches)/, // any lead field but two counts
      /\b(phone|message|userAgent|referer)\b/,
      /\bbody\b/,
    ];
    for (const call of route.match(/console\.\w+\([\s\S]*?\);/g) ?? []) {
      for (const pattern of forbidden) expect(call, call).not.toMatch(pattern);
    }
  });

  it("loads no third-party script, frame, font or tracker", () => {
    const banned = [
      /from ["']next\/script["']/,
      /<iframe/i,
      /<script[^>]+src=/i,
      /fonts\.(googleapis|gstatic)\.com/,
      /googletagmanager|google-analytics|gtag\(|fbq\(|connect\.facebook\.net/,
      /posthog|sentry|hotjar|clarity\.ms|plausible|umami|@vercel\/analytics|@vercel\/speed-insights/i,
    ];
    for (const { path, text } of sources) {
      for (const pattern of banned) {
        expect(pattern.test(text), `${path} matches ${pattern}`).toBe(false);
      }
    }
  });

  it("writes no cookie outside the consent core", () => {
    for (const { path, text } of sources) {
      if (path === join("lib", "consent", "core.ts")) continue;
      expect(/document\.cookie/.test(text), `${path} touches document.cookie`).toBe(false);
    }
  });

  it("names no host outside the allow-list", () => {
    for (const { path, text } of sources) {
      for (const [, host] of text.matchAll(/https?:\/\/([a-z0-9.-]+)/gi)) {
        expect(ALLOWED_HOSTS.has(host.toLowerCase()), `${path} names ${host}`).toBe(true);
      }
    }
  });

  it("sends a same-origin-only CSP and HSTS in production", () => {
    const config = readFileSync(join(root, "next.config.ts"), "utf8");
    expect(config).toMatch(/"default-src 'self'"/);
    expect(config).toMatch(/Strict-Transport-Security/);
  });
});
