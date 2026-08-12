import { setRequestLocale } from "next-intl/server";
import Bridge from "@/components/home/Bridge";
import CaseStudy from "@/components/home/CaseStudy";
import Compare from "@/components/home/Compare";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Pain from "@/components/home/Pain";
import RoiCalculator from "@/components/home/RoiCalculator";
import Steps from "@/components/home/Steps";
import Testimonials from "@/components/home/Testimonials";
import Tour from "@/components/home/Tour";
import CtaBand from "@/components/CtaBand";
import Faq from "@/components/Faq";
import Pricing from "@/components/Pricing";

/**
 * Home page section order is the argument, in this sequence:
 *
 *   hero        — the promise, plus proof-of-scale numbers
 *   pain        — agitate on the dark band; the visitor recognises their week
 *   bridge      — one sentence that collapses all four pains into one flow
 *   features    — what actually does it
 *   tour        — what it looks like, so "system" stops being abstract
 *   steps       — adoption cost, made to look trivial
 *   compare     — category reframe: a QR menu is not a restaurant system
 *   roi         — the visitor computes the loss themselves; price stops mattering
 *   case study  — authority, on verifiable numbers rather than invented quotes
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
      <Pain />
      <Bridge />
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
