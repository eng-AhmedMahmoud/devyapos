import type { Metadata } from "next";
import { getContent } from "@/content";
import { routing } from "@/i18n/routing";
import { brand } from "./brand";

/**
 * Page metadata + hreflang alternates. Every page passes its own key from the
 * `meta` block of the content tree so titles stay next to the copy they belong
 * to.
 */
export function buildMetadata(
  locale: string,
  key: string,
  path = "",
): Metadata {
  const c = getContent(locale);
  const meta = c.meta[key] ?? c.meta.home;
  const url = `${brand.url}/${locale}${path}`;

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${brand.url}/${l}${path}`]),
  );

  return {
    metadataBase: new URL(brand.url),
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      url,
      title: meta.title,
      description: meta.description,
      siteName: brand.wordmark,
      locale: locale === "ar" ? "ar_EG" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}
