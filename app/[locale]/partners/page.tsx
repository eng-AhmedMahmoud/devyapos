import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { formatNumber } from "@/lib/format";
import { pageJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/meta";
import CtaBand from "@/components/CtaBand";
import { Check } from "@/components/icons";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";
import ClosingCta from "@/components/pages/ClosingCta";
import PageFaq, { pageFaqJsonLd } from "@/components/pages/PageFaq";

const PATH = "/partners";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale, "partners", PATH);
}

/**
 * The partner programmes: referral, reseller, and restaurant refers
 * restaurant.
 *
 * Accountants, hardware dealers, agencies and consultants already stand in
 * every new restaurant, and the incumbent pays them (Foodics runs referral,
 * reseller and cashback programmes; docs/business/market-research.md §6). The
 * figures on this page are commercial terms: they live in `partners` in both
 * content trees, change only with the owner's say-so, and nothing about them
 * is automated yet — an application is a WhatsApp message tagged `[P-partners]`
 * or the contact form, and the agreement is signed by a person.
 */
export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const p = getContent(locale).partners;

  /* This page's own questions, not the shared FAQ block — see PageFaq. */
  const jsonLd = [
    ...pageJsonLd(locale, PATH).filter((node) => node["@type"] !== "FAQPage"),
    pageFaqJsonLd(locale, PATH, p.faq.items),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <PageHero badge={p.badge} title={p.title} sub={p.sub} />

      {/* Who it is for. */}
      <section className="bg-bg py-14 sm:py-16">
        <Container>
          <SectionHead title={p.who.title} sub={p.who.sub} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {p.who.items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={(i % 2) * 70}>
                <article className="card flex h-full flex-col gap-3 p-6">
                  <h3 className="font-display text-base text-ink">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-pretty text-ink-dim">
                    {item.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* The three programmes, figure first. */}
      <section className="band-cream py-16 sm:py-20">
        <Container>
          <SectionHead title={p.programmes.title} sub={p.programmes.sub} />
          <ul className="mt-10 grid gap-4 lg:grid-cols-3">
            {p.programmes.items.map((item, i) => (
              <Reveal as="li" key={item.id} delay={(i % 3) * 70}>
                <article className="card flex h-full flex-col gap-4 p-6">
                  <h3 className="font-display text-lg text-ink">{item.name}</h3>
                  <p className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-display text-[2.25rem] leading-none text-brand">
                      {item.figure}
                    </span>
                    <span className="text-sm text-ink-dim">
                      {item.figureLabel}
                    </span>
                  </p>
                  <p className="text-sm leading-relaxed text-ink-2">
                    {item.body}
                  </p>
                  <ul className="flex flex-col gap-2.5 border-t border-line pt-4">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <Check
                          width={16}
                          height={16}
                          className="sl-tick mt-0.5 shrink-0 text-mint"
                        />
                        <span className="text-sm text-ink-2">{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={140}>
            <p className="mt-6 max-w-3xl text-sm leading-relaxed text-pretty text-ink-dim">
              {p.programmes.note}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* How it works, in order. */}
      <section className="bg-bg py-16 sm:py-20">
        <Container>
          <SectionHead title={p.steps.title} />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {p.steps.items.map((step, i) => (
              <Reveal as="li" key={step.title} delay={(i % 4) * 60}>
                <article className="card flex h-full flex-col gap-3 p-6">
                  <span
                    aria-hidden="true"
                    className="font-display text-2xl text-caramel"
                  >
                    {formatNumber(locale, i + 1)}
                  </span>
                  <h3 className="font-display text-base text-ink">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-pretty text-ink-dim">
                    {step.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <PageFaq title={p.faq.title} items={p.faq.items} />

      <ClosingCta
        title={p.cta.title}
        body={p.cta.body}
        primary={p.cta.primary}
        secondary={p.cta.secondary}
        whatsappFirst
        source="partners"
      />

      <CtaBand />
    </>
  );
}
