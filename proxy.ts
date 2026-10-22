import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intl = createIntlMiddleware(routing);

/**
 * Next 16 proxy (né middleware) — next-intl locale negotiation + redirects.
 * `/` bounces to `/ar` (default locale), bare paths get their locale prefix.
 *
 * next-intl answers those with 307, a temporary redirect, because by default
 * the target depends on the visitor's language. Here it never does
 * (`localeDetection: false` in i18n/routing.ts): `/` is /ar for everyone, so
 * the redirect is permanent and says so with 308, which lets search engines
 * consolidate `/` into /ar instead of re-checking it. Browsers cache a 308,
 * so turning detection back on must drop this mapping in the same change.
 */
export function proxy(request: NextRequest) {
  const response = intl(request);
  if (response.status === 307 && response.headers.has("location")) {
    return new NextResponse(null, { status: 308, headers: response.headers });
  }
  return response;
}

export const config = {
  // Everything except the API proxy, Next internals and static files.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
