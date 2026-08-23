import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { brand } from "@/lib/brand";

const paths = [
  "",
  "/features",
  "/how-it-works",
  "/compare",
  "/pricing",
  "/about",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${brand.url}/${locale}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${brand.url}/${l}${path}`]),
        ),
      },
    })),
  );
}
