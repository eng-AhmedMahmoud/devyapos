import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { buildMetadata } from "@/lib/meta";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import Flow from "@/components/home/Flow";
import Steps from "@/components/home/Steps";
import Tour from "@/components/home/Tour";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale, "howItWorks", "/how-it-works");
}

/**
 * "How it works" used to be a `/#how` anchor on the home page, which is why the
 * home page had to carry fourteen sections. The three that answer *how* — the
 * pipeline, the four screens, and what adoption costs — live here instead.
 *
 * Hero copy is borrowed from the bridge section rather than adding a parallel
 * string to both locales: it already says what this page is.
 */
export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getContent(locale);

  return (
    <>
      <PageHero
        badge={c.bridge.eyebrow}
        title={c.bridge.title}
        sub={c.bridge.sub}
      />
      <Flow />
      <Tour />
      <Steps />
      <CtaBand />
    </>
  );
}
