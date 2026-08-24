import { setRequestLocale } from "next-intl/server";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Ledger from "@/components/home/Ledger";
import Marquee from "@/components/home/Marquee";
import Promo from "@/components/home/Promo";
import Showcase from "@/components/home/Showcase";
import Testimonials from "@/components/home/Testimonials";
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
 * Now each of those has a route, and this page keeps only the through-line:
 *
 *   hero      — the promise
 *   marquee   — the scope, in one glance
 *   ledger    — each problem paired with the line that cancels it
 *   promo     — four seconds of the register actually being operated
 *   features  — what actually does it
 *   showcase  — the product itself, so the claims stop being abstract
 *   testimonials — hides itself until real quotes exist
 *   cta       — the ask
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
      <Marquee />
      <Ledger />
      <Promo />
      <Features />
      <Showcase />
      <Testimonials />
      <CtaBand />
    </>
  );
}
