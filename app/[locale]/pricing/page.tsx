import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { buildMetadata } from "@/lib/meta";
import Compare from "@/components/home/Compare";
import CtaBand from "@/components/CtaBand";
import Faq from "@/components/Faq";
import PageHero from "@/components/PageHero";
import Pricing from "@/components/Pricing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale, "pricing", "/pricing");
}

export default async function PricingPage({
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
        badge={c.pricing.eyebrow}
        title={c.pricing.title}
        sub={c.pricing.sub}
      />
      {/* The plan grid carries its own billing toggle; the page hero already
          said everything the section head would have repeated. */}
      <div className="bg-surface pt-4 pb-20 sm:pb-24">
        <Pricing compact />
      </div>
      <Compare />
      <Faq />
      <CtaBand />
    </>
  );
}
