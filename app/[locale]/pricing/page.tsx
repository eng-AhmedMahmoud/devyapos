import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { pageJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/meta";
import CtaBand from "@/components/CtaBand";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import MarketAnchor from "@/components/MarketAnchor";
import PageHero from "@/components/PageHero";
import Pricing from "@/components/Pricing";
import PricingSegments from "@/components/PricingSegments";

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
      <JsonLd data={pageJsonLd(locale, "/pricing")} />
      <PageHero
        badge={c.pricing.eyebrow}
        title={c.pricing.title}
        sub={c.pricing.sub}
      />
      {/* Qualify first, price second: the tabs let the buyer say what kind of
          restaurant they run before a number is on screen. Same price in every
          tab — the block says so itself. */}
      <PricingSegments />
      {/* The plan grid carries its own billing toggle; the page hero already
          said everything a section head would have repeated. */}
      <div className="bg-bg pt-10 pb-20 sm:pb-24">
        <Pricing compact />
      </div>
      <MarketAnchor />

      <Faq />
      <CtaBand />
    </>
  );
}
