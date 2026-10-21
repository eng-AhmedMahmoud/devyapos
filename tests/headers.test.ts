import type { NextConfig } from "next";
import { unstable_getResponseFromNextConfig } from "next/experimental/testing/server";
import { afterEach, describe, expect, it, vi } from "vitest";

/*
 * Security headers, read off the responses Next would send — next.config.ts is
 * imported under a given build environment and its `headers()` run through
 * Next's own route matching. The CSP is the browser-side half of the privacy
 * promise (tests/privacy.test.ts is the source-side half): this origin only,
 * plus the trial claim origin, because the trial form posts there from the
 * browser. If that origin drops out of connect-src, every trial sign-up is
 * blocked silently; these tests are what notices.
 */

const SITE = "https://pos.devya.dev";
const CLAIM_URL = "https://ops.example.test/api/trial/claim";
const CLAIM_ORIGIN = "https://ops.example.test";

/** Source keywords that never name a third party. */
const SELF_ONLY = new Set(["'self'", "'none'", "'unsafe-inline'", "data:", "blob:"]);

afterEach(() => {
  vi.unstubAllEnvs();
});

async function configFor(env: Record<string, string>): Promise<NextConfig> {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
  return (await import("@/next.config")).default;
}

async function responseFor(config: NextConfig, path: string) {
  return unstable_getResponseFromNextConfig({ url: `${SITE}${path}`, nextConfig: config });
}

/** `default-src 'self'; connect-src 'self' x` → { "default-src": ["'self'"], … } */
function directives(csp: string): Record<string, string[]> {
  return Object.fromEntries(
    csp
      .split(";")
      .map((part) => part.trim().split(/\s+/))
      .filter(([name]) => name)
      .map(([name, ...sources]) => [name, sources]),
  );
}

// The first import of next.config.ts loads next-intl's plugin, about a second
// on a quiet machine; the headroom is for a busy CI runner.
describe("security headers (next.config.ts)", { timeout: 20_000 }, () => {
  it("sends a same-origin CSP that lets the trial form reach its claim origin, in production", async () => {
    const config = await configFor({ NODE_ENV: "production", NEXT_PUBLIC_TRIAL_CLAIM_URL: CLAIM_URL });
    const res = await responseFor(config, "/ar/accounting-trial");
    const csp = res.headers.get("content-security-policy");
    expect(csp).toBeTruthy();
    const d = directives(csp!);

    // The origin only — never the claim route's path.
    expect(d["connect-src"]).toEqual(["'self'", CLAIM_ORIGIN]);
    expect(d["default-src"]).toEqual(["'self'"]);
    expect(d["frame-ancestors"]).toEqual(["'none'"]);
    expect(d["object-src"]).toEqual(["'none'"]);
    expect(d["base-uri"]).toEqual(["'self'"]);
    expect(d["form-action"]).toEqual(["'self'"]);

    // Every other directive names no host at all.
    for (const [name, sources] of Object.entries(d)) {
      if (name === "connect-src") continue;
      for (const source of sources) expect(SELF_ONLY.has(source), `${name} ${source}`).toBe(true);
    }
  });

  it("sends HSTS and the baseline headers on pages and on the API alike, in production", async () => {
    const config = await configFor({ NODE_ENV: "production", NEXT_PUBLIC_TRIAL_CLAIM_URL: CLAIM_URL });
    for (const path of ["/ar", "/en/contact", "/api/lead"]) {
      const res = await responseFor(config, path);
      expect(res.headers.get("strict-transport-security"), path).toBe("max-age=31536000");
      expect(res.headers.get("content-security-policy"), path).toBeTruthy();
      expect(res.headers.get("x-content-type-options"), path).toBe("nosniff");
      expect(res.headers.get("x-frame-options"), path).toBe("DENY");
      expect(res.headers.get("referrer-policy"), path).toBe("strict-origin-when-cross-origin");
      expect(res.headers.get("permissions-policy"), path).toBe(
        "camera=(), microphone=(), geolocation=()",
      );
    }
  });

  it("keeps connect-src to this origin when the claim URL is unset or does not parse", async () => {
    for (const claim of ["", "   ", "not a url", "ops.example.test/api/trial/claim"]) {
      const config = await configFor({ NODE_ENV: "production", NEXT_PUBLIC_TRIAL_CLAIM_URL: claim });
      const res = await responseFor(config, "/ar");
      const d = directives(res.headers.get("content-security-policy") ?? "");
      expect(d["connect-src"], JSON.stringify(claim)).toEqual(["'self'"]);
    }
  });

  it("sends no CSP or HSTS outside production, where the dev server evals", async () => {
    for (const env of ["development", "test"]) {
      const config = await configFor({ NODE_ENV: env, NEXT_PUBLIC_TRIAL_CLAIM_URL: CLAIM_URL });
      const res = await responseFor(config, "/ar");
      expect(res.headers.get("content-security-policy"), env).toBeNull();
      expect(res.headers.get("strict-transport-security"), env).toBeNull();
      // The baseline headers do not depend on the environment.
      expect(res.headers.get("x-content-type-options"), env).toBe("nosniff");
      expect(res.headers.get("x-frame-options"), env).toBe("DENY");
    }
  });

  it("does not advertise the framework", async () => {
    const config = await configFor({ NODE_ENV: "production" });
    expect(config.poweredByHeader).toBe(false);
  });
});
