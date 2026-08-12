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
