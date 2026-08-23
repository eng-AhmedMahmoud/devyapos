import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { buildMetadata } from "@/lib/meta";
import CtaBand from "@/components/CtaBand";
import Compare from "@/components/home/Compare";
import RoiCalculator from "@/components/home/RoiCalculator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale, "compare", "/compare");
}

/**
 * The cost argument, on its own page.
 *
 * Compare states the category difference and RoiCalculator lets the visitor
 * compute their own aggregator loss — the two only work together, and both were
 * previously buried mid-scroll on a fourteen-section home page where a visitor
 * arriving from a "vs Foodics" search would never reach them.
 *
 * No PageHero: Compare opens with its own eyebrow/title/sub, and stacking a
 * second heading above it would say the same thing twice.
 */
export default async function ComparePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  getContent(locale);

  return (
    <>
      <Compare />
      <RoiCalculator />
      <CtaBand />
    </>
  );
}
