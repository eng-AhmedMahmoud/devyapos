import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * The trial form posts from the browser to Devya's control plane
 * (NEXT_PUBLIC_TRIAL_CLAIM_URL, baked at build time), so its origin is the one
 * exception to "this origin only" in the CSP below.
 */
function trialClaimOrigin(): string | null {
  try {
    const url = process.env.NEXT_PUBLIC_TRIAL_CLAIM_URL?.trim();
    return url ? new URL(url).origin : null;
  } catch {
    return null;
  }
}

/**
 * Content-Security-Policy: this origin only (plus the trial claim origin).
 * Beyond hardening, it is the browser-side half of the privacy promise — a
 * third-party script, font, pixel or beacon is refused, not just left out
 * (tests/privacy.test.ts is the source-side half). 'unsafe-inline' covers the
 * theme boot script, the JSON-LD and Next's inline payload. Production only:
 * the dev server evals.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'",
  ["connect-src 'self'", trialClaimOrigin()].filter(Boolean).join(" "),
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // app/global-not-found.tsx: the branded 404 for every URL that matches no
    // page. The root layout is the dynamic [locale] segment, so without it an
    // unknown URL got Next's unbranded default page.
    globalNotFound: true,
  },
  // The Docker image runs `.next/standalone/server.js` with only the files the
  // server traces, not the repo and its devDependencies (Dockerfile, runner
  // stage).
  output: "standalone",
  // No rewrites. The /api/:path* rewrite to the platform API (API_URL) outlived
  // the platform era: nothing listened behind it in production, so every
  // unknown /api path answered 500. Both /api routes are handlers in this app
  // and the trial posts cross-origin by design, so an unknown /api path now
  // answers 404 (tests/ops.test.ts keeps it that way).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          ...(isProduction
            ? [
                { key: "Content-Security-Policy", value: contentSecurityPolicy },
                // A year, this host only.
                { key: "Strict-Transport-Security", value: "max-age=31536000" },
              ]
            : []),
        ],
      },
      /* The API is the only part of this host that is not a page: /api/health
         answers a GET with JSON, and a crawler that finds the URL would
         otherwise index it as a document. robots.txt keeps "allow everything"
         (app/robots.ts), so the header, not a Disallow, keeps it out — a
         disallowed URL can still be indexed from links, unread. */
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
