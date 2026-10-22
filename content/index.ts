// Server components only. Both locales' copy trees are imported below, so a
// client component that reached this module put every word of both languages
// into the JS every visitor downloads (X-Ray ARC-F7: about 59 KB gzip on every
// page). Client components take the slice they render as props from their
// server parent, and their types from `@/content/types`; this import makes
// `next build` fail if one ever imports this module again.
import "server-only";
import type { Locale } from "@/i18n/routing";
import { ar } from "./ar";
import { en } from "./en";
import type { SiteContent, SiteContentMap } from "./types";

const map: SiteContentMap = { ar, en };

/** Copy tree for a locale. Unknown locales fall back to Arabic (the default). */
export function getContent(locale: string): SiteContent {
  return map[locale as Locale] ?? ar;
}

export type { SiteContent };
export * from "./types";
