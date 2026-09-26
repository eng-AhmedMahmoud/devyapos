import { setRequestLocale } from "next-intl/server";
import BrandPromise from "@/components/home/BrandPromise";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Ledger from "@/components/home/Ledger";
import Marquee from "@/components/home/Marquee";
import Promo from "@/components/home/Promo";
import Showcase from "@/components/home/Showcase";
import Testimonials from "@/components/home/Testimonials";
import CaseStudy from "@/components/CaseStudy";
import CtaBand from "@/components/CtaBand";

/**
 * The home page argues once and then hands off.
 *
 * It used to run fourteen sections because "How it works" and "Compare" were
 * `/#` anchors rather than pages, so everything had to live here — the tour,
 * the adoption steps, the comparison, the ROI calculator, pricing and the FAQ
 * all stacked below the fold, each competing with the next. A visitor landing
 * from a pricing search still had to scroll past the whole argument.
 *
 * Now each of those has a route, and this page keeps only the through-line —
 * with the two sections that show the real product pulled up near the top, so a
 * visitor (a phone visitor especially) sees live screens before the argument:
 *
 *   hero      — the promise
 *   caseStudy — the proof, before any of the argument
 *   promo     — four seconds of the register actually being operated
 *   showcase  — the product itself, so the claims stop being abstract
 *   marquee   — the scope, in one glance
 *   ledger    — each problem paired with the line that cancels it
 *   features  — what actually does it
 *   promise   — and it gets fitted to your brand, not licensed as-is
 *   testimonials — hides itself until real quotes exist
 *   cta       — the ask
 *
 * The bands still alternate light/cream against dark/espresso: promo and
 * marquee (both espresso) bracket showcase, and features now carries a cream
 * band rather than page-white so it doesn't sit flush against ledger.
 *
 * Depth lives at /how-it-works, /compare, /features and /pricing.
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
      {/* Proof before pitch: 25 branches on the system reads as evidence only
          while the visitor is still holding the promise the hero just made. */}
      <CaseStudy />
      {/* Show the product before arguing for it: the register recording and the
          real-screens carousel ride up here so live screens land before the
          fold-deep argument, which sells harder on a phone. */}
      <Promo />
      <Showcase />
      <Marquee />
      <Ledger />
      <Features />
      <BrandPromise />
      <Testimonials />
      <CtaBand />
    </>
  );
}
