import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { pageJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/meta";
import JsonLd from "@/components/JsonLd";
import LegalArticle from "@/components/pages/LegalArticle";

const PATH = "/privacy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    ...(await buildMetadata(locale, "privacy", PATH)),
    /* Unreviewed draft: reachable, but must not be indexed or presented as
       published terms until it has had a legal review. */
    robots: { index: false, follow: false },
  };
}

/** Privacy policy. Prose only — see `components/pages/LegalArticle`. */
export default async function PrivacyPage({
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
      <LegalArticle doc={c.legal.privacy} />
    </>
  );
}
