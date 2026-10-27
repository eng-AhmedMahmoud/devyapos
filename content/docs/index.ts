import type { Locale } from "@/i18n/routing";
import { arDocs } from "./ar";
import { enDocs } from "./en";
import type { DocsContent } from "./types";

/** The help centre per locale. Read it through `getDocs()` (lib/docs). */
export const docsMap: Record<Locale, DocsContent> = { ar: arDocs, en: enDocs };

export type * from "./types";
