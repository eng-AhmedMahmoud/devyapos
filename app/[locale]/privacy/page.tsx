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
  /* Indexed, unlike /terms and /refund. Those two are contractual and keep the
     noindex until a lawyer has read them; a privacy policy is a description of
     what the site already does, and hiding one reads as evasion rather than
     caution. Search engines and AI assistants both treat a reachable policy as
     a trust signal, which is the opposite of what noindex was achieving. */
  return buildMetadata(locale, "privacy", PATH);
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
