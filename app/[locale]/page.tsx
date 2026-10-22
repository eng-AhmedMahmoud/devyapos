import { setRequestLocale } from "next-intl/server";
import { pageJsonLd } from "@/lib/jsonld";
import JsonLd from "@/components/JsonLd";
import BrandPromise from "@/components/home/BrandPromise";
import Features from "@/components/home/Features";
import HomeContact from "@/components/home/HomeContact";
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
 * Now each of those has a route, and this page keeps only the through-line:
 *
 *   hero      — the promise
 *   caseStudy — the proof, before any of the argument
 *   marquee   — the scope, in one glance
 *   ledger    — each problem paired with the line that cancels it
 *   promo     — four seconds of the register actually being operated
 *   features  — what actually does it
 *   showcase  — the product itself, so the claims stop being abstract
 *   promise   — and it gets fitted to your brand, not licensed as-is
 *   testimonials — hides itself until real quotes exist
 *   contact   — every direct route, for the visitor who will not fill a form
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
      {/* The product and its prices (SoftwareApplication); the home page has
          no breadcrumb of its own. */}
      <JsonLd data={pageJsonLd(locale, "")} />
      <Hero />
      {/* Proof before pitch: 25 branches on the system reads as evidence only
          while the visitor is still holding the promise the hero just made. */}
      <CaseStudy />
      <Marquee />
      <Ledger />
      <Promo />
      <Features />
      <Showcase />
      <BrandPromise />
      <Testimonials />
      <HomeContact />
      <CtaBand />
    </>
  );
}
