import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { pageJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/meta";
import JsonLd from "@/components/JsonLd";
import LegalArticle from "@/components/pages/LegalArticle";

const PATH = "/refund";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  /* Unreviewed draft: reachable, but kept out of search until it has had a
     legal review. `buildMetadata` adds the noindex for every path in
     NOINDEX_PATHS (lib/meta.ts). */
  return buildMetadata(locale, "refund", PATH);
}

/** Refund and cancellation policy. Prose only — see `components/pages/LegalArticle`. */
export default async function RefundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getContent(locale);

  return (
    <>
      <JsonLd data={pageJsonLd(locale, PATH)} />
      <LegalArticle doc={c.legal.refund} />
    </>
  );
}
