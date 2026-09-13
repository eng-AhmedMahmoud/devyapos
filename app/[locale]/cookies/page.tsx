import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { pageJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/meta";
import JsonLd from "@/components/JsonLd";
import LegalArticle from "@/components/pages/LegalArticle";

const PATH = "/cookies";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    ...(await buildMetadata(locale, "cookies", PATH)),
    /* Unreviewed draft: reachable and linked, but must not be indexed or
       presented as published terms until it has had a legal review. */
    robots: { index: false, follow: false },
  };
}

/** Cookie policy. Prose plus the storage inventory — see `LegalArticle`. */
export default async function CookiesPage({
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
      <LegalArticle doc={c.legal.cookies} />
    </>
  );
}
