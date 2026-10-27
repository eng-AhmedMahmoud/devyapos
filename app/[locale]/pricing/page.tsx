import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { pageJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/meta";
import CtaBand from "@/components/CtaBand";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import MarketAnchor from "@/components/MarketAnchor";
import MovingStoresBand from "@/components/MovingStoresBand";
import PageHero from "@/components/PageHero";
import Pricing from "@/components/Pricing";
import PricingAddOns from "@/components/PricingAddOns";
import PricingSegments from "@/components/PricingSegments";

/**
 * When this page was rendered — at build, since it is prerendered. The plan
 * grid judges the offers by it on the server and during hydration, then by
 * the browser's clock (components/Pricing.tsx). Module scope, so it is read
 * once and never inside a render.
 */
const BUILT_AT = Date.now();

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
          restaurant they run before a number is on screen, and each one points
          at the package built for it. */}
      <PricingSegments copy={c.pricing.segments} />
      {/* The plan grid carries its own billing and currency switches, and
          the AI credits block under it (#ai-credits, which the AI add-on
          links to) shares the currency; the page hero already said
          everything a section head would have repeated. */}
      <div className="bg-bg pt-10 pb-20 sm:pb-24">
        <Pricing copy={c.pricing} compact builtAt={BUILT_AT} withAi />
      </div>
      <PricingAddOns copy={c.pricing.addOns} />
      <MarketAnchor />
      {/* The sister product, as the add-on a restaurant takes next. */}
      <MovingStoresBand />

      <Faq />
      <CtaBand source="pricing" />
    </>
  );
}
