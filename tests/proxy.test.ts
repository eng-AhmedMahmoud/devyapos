import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { config, proxy } from "@/proxy";

/*
 * Locale routing, run through the real proxy (next-intl's middleware with
 * i18n/routing.ts) and Next's own matcher evaluation — not read off the source.
 * Arabic is the front door for everyone, campaign links keep their query
 * string, and nothing writes a locale cookie.
 */

const SITE = "https://pos.devya.dev";

function visit(path: string, headers: Record<string, string> = {}) {
  return proxy(new NextRequest(`${SITE}${path}`, { headers }));
}

function location(res: Response): string | null {
  return res.headers.get("location");
}

describe("locale routing (proxy.ts)", () => {
  it("sends bare / to /ar, whatever the browser's language", () => {
    for (const lang of [undefined, "en-US,en;q=0.9", "ar-EG", "fr-FR"]) {
      const res = visit("/", lang ? { "accept-language": lang } : {});
      expect(res.status, String(lang)).toBe(307);
      expect(location(res), String(lang)).toBe(`${SITE}/ar`);
    }
  });

  it("keeps the campaign query string through the redirect", () => {
    const res = visit("/?utm_source=meta&utm_campaign=eg-launch");
    expect(res.status).toBe(307);
    const to = new URL(location(res)!);
    expect(to.pathname).toBe("/ar");
    expect(to.searchParams.get("utm_source")).toBe("meta");
    expect(to.searchParams.get("utm_campaign")).toBe("eg-launch");
  });

  it("gives an unprefixed page the Arabic prefix", () => {
    const res = visit("/accounting-trial");
    expect(res.status).toBe(307);
    expect(location(res)).toBe(`${SITE}/ar/accounting-trial`);
  });

  it("serves a page that already carries its locale, without redirecting", () => {
    for (const path of ["/ar", "/en", "/en/contact", "/ar/accounting-trial"]) {
      const res = visit(path, { "accept-language": "fr-FR" });
      expect(res.status, path).toBe(200);
      expect(location(res), path).toBeNull();
    }
  });

  it("writes no locale cookie on any answer", () => {
    for (const path of ["/", "/ar", "/en/contact", "/pricing"]) {
      const res = visit(path, { "accept-language": "en-US" });
      expect(res.headers.get("set-cookie") ?? "", path).not.toMatch(/NEXT_LOCALE/i);
      expect(res.cookies.getAll(), path).toEqual([]);
    }
  });

  it("runs on pages, and stays out of the API, Next internals and static files", () => {
    const runs = (path: string) =>
      unstable_doesMiddlewareMatch({ config, url: `${SITE}${path}` });

    for (const path of ["/", "/ar", "/en/contact", "/ar/accounting-trial"]) {
      expect(runs(path), path).toBe(true);
    }
    for (const path of [
      "/api/lead",
      "/api/consent",
      "/_next/static/chunks/main.js",
      "/_next/image",
      "/_vercel/insights/view",
      "/favicon.ico",
      "/robots.txt",
      "/sitemap.xml",
      "/screenshots/pos-dashboard.webp",
    ]) {
      expect(runs(path), path).toBe(false);
    }
  });
});
