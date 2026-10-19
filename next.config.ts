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
  // Marketing site: fully static content, no catalog fetches. The only
  // server-side hop is the demo/lead form posting to the platform API, so a
  // single /api rewrite keeps browser requests same-origin.
  async rewrites() {
    const apiUrl = process.env.API_URL ?? "http://localhost:3001";
    return [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }];
  },
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
    ];
  },
};

export default withNextIntl(nextConfig);
