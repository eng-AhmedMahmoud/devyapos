import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Marketing site: fully static content, no catalog fetches. The only
  // server-side hop is the demo/lead form posting to the platform API, so a
  // single /api rewrite keeps browser requests same-origin.
  async rewrites() {
    const apiUrl = process.env.API_URL ?? "http://localhost:3001";
    return [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }];
  },
};

export default withNextIntl(nextConfig);
