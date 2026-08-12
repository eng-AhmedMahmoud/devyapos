import { setRequestLocale } from "next-intl/server";
import CaseStudy from "@/components/home/CaseStudy";
import Compare from "@/components/home/Compare";
import Features from "@/components/home/Features";
import Flow from "@/components/home/Flow";
import Hero from "@/components/home/Hero";
import Ledger from "@/components/home/Ledger";
import Marquee from "@/components/home/Marquee";
import RoiCalculator from "@/components/home/RoiCalculator";
import Steps from "@/components/home/Steps";
import Testimonials from "@/components/home/Testimonials";
import Tour from "@/components/home/Tour";
import CtaBand from "@/components/CtaBand";
import Faq from "@/components/Faq";
import Pricing from "@/components/Pricing";

/**
 * The section order is the argument, and the surface alternates
 * page / espresso / cream so no two neighbours share a background:
 *
 *   hero        — asymmetric: promise on the reading edge, order flow opposite
 *   marquee     — espresso ribbon; states the platform's scope in one glance
 *   ledger      — each problem paired with the line that cancels it
 *   flow        — the pipeline drawn, since "connected" is a claim about shape
 *   features    — bento grid of what actually does it
 *   tour        — the four screens, so "system" stops being abstract
 *   steps       — adoption cost, made to look trivial
 *   compare     — category reframe: a QR menu is not a restaurant system
 *   roi         — the visitor computes the loss themselves; price stops mattering
 *   case study  — authority on verifiable numbers, not invented quotes
 *   pricing     — read against the anchor two sections above it
 *   faq         — remove the last objections
 *   cta         — ask, with the risk reversal repeated
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Marquee />
      <Ledger />
      <Flow />
      <Features />
      <Tour />
      <Steps />
      <Compare />
      <RoiCalculator />
      <CaseStudy />
      <Testimonials />
      <Pricing />
      <Faq />
      <CtaBand />
    </>
  );
}
