import { ar } from "@/content/ar";
import { en } from "@/content/en";
import type { SiteContent } from "@/content/types";

/**
 * The site's copy for a locale, for the specs' assertions. Read from the two
 * trees directly: content/index.ts imports "server-only", which throws
 * anywhere but a Next.js server component, Playwright's loader included.
 */
export function getContent(locale: string): SiteContent {
  return locale === "en" ? en : ar;
}
