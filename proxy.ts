import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intl = createIntlMiddleware(routing);

/**
 * Next 16 proxy (né middleware) — next-intl locale negotiation + redirects.
 * `/` bounces to `/ar` (default locale), bare paths get their locale prefix.
 */
export function proxy(request: NextRequest) {
  return intl(request);
}

export const config = {
  // Everything except the API proxy, Next internals and static files.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
