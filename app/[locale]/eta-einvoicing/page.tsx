import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { formatNumber } from "@/lib/format";
import { pageJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/meta";
import CtaBand from "@/components/CtaBand";
import { Close } from "@/components/icons";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";
import ClosingCta from "@/components/pages/ClosingCta";
import PageFaq, { pageFaqJsonLd } from "@/components/pages/PageFaq";

const PATH = "/eta-einvoicing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale, "etaInvoicing", PATH);
}

/**
 * Egyptian VAT and ETA e-invoicing.
 *
 * The incumbent ships a ZATCA section on its Saudi pages and says nothing at
 * all about the Egyptian Tax Authority; this page is the answer to a search
 * nobody is currently answering. Its whole value is that it is believable, so
 * `doesNot` gets the loudest surface on the page — the espresso band, full
 * cards, same heading scale as everything else — rather than an accordion or a
 * footnote.
 *
 * Nothing here may imply certification: no badge, no seal, no checkmark next
 * to a capability. The `does` list is marked with the house pearl and the
 * `doesNot` list with a plain cross, because a tick beside "14% VAT computed
 * on every line" is exactly the visual shorthand a reader mistakes for
 * accreditation.
 */
export default async function EtaInvoicingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getContent(locale);
  const e = c.etaInvoicing;

  /* FAQPage from this page's own questions. `pageJsonLd` only attaches the
     shared FAQ to the routes in FAQ_PATHS, and that shared block answers
     different questions — the filter keeps it out if the route is ever added
     there, so the markup always describes what is on screen. */
  const jsonLd = [
    ...pageJsonLd(locale, PATH).filter((node) => node["@type"] !== "FAQPage"),
    pageFaqJsonLd(locale, PATH, e.faq.items),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <PageHero badge={e.badge} title={e.title} sub={e.sub} />

      {/* The position, in one paragraph, before a visitor scrolls anywhere. */}
      <section className="bg-bg py-14 sm:py-16">
        <Container>
          <Reveal>
            <div className="card p-7 sm:p-9">
              <p className="max-w-4xl text-lg leading-loose text-pretty text-ink-2">
                {e.standfirst}
              </p>
              <p className="mt-6 border-t border-line pt-4 text-xs text-ink-dim">
                {e.updated}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* What the law asks of the reader — the part every other vendor omits. */}
      <section className="band-cream py-16 sm:py-20">
        <Container>
          <SectionHead title={e.required.title} sub={e.required.sub} />
          <ol className="mt-10 flex flex-col gap-4">
            {e.required.items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={(i % 3) * 60}>
                <article className="card flex flex-col gap-4 p-6 sm:flex-row sm:gap-6 sm:p-7">
                  <span
                    aria-hidden="true"
                    className="font-display shrink-0 text-2xl text-caramel"
                  >
                    {formatNumber(locale, i + 1)}
                  </span>
                  <div>
                    <h3 className="font-display text-base text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-pretty text-ink-dim">
                      {item.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={120}>
            <p className="mt-6 max-w-3xl text-xs leading-relaxed text-ink-dim">
              {e.required.note}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* What ships today. */}
      <section className="bg-bg py-16 sm:py-20">
        <Container>
          <SectionHead title={e.does.title} sub={e.does.sub} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {e.does.items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={(i % 3) * 70}>
                <article className="card lift flex h-full flex-col gap-3 p-6">
                  <span className="pearl pearl-lg" aria-hidden="true" />
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

      {/* What does not. Loudest band on the page, on purpose. */}
      <section className="band-espresso pearl-grid-dark py-16 sm:py-20">
        <Container>
          <SectionHead
            title={e.doesNot.title}
            sub={e.doesNot.sub}
            tone="espresso"
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {e.doesNot.items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={(i % 2) * 70}>
                <article className="card-espresso flex h-full flex-col gap-3 p-6 sm:p-7">
                  <Close width={22} height={22} className="text-gold" />
                  <h3 className="font-display text-base text-on-espresso">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-pretty text-on-espresso-dim">
                    {item.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={140}>
            <p className="mt-8 max-w-3xl leading-relaxed text-pretty text-on-espresso-dim">
              {e.doesNot.note}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* How to read all of that as a buyer. */}
      <section className="bg-bg py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,18rem)_1fr]">
            <Reveal>
              <h2 className="font-display text-2xl text-balance text-ink sm:text-3xl">
                {e.meaning.title}
              </h2>
            </Reveal>
            <div className="flex max-w-2xl flex-col gap-6">
              <Reveal>
                <p className="leading-loose text-pretty text-ink-2">
                  {e.meaning.body}
                </p>
              </Reveal>
              <ul className="flex flex-col gap-4">
                {e.meaning.points.map((point, i) => (
                  <Reveal
                    as="li"
                    key={point}
                    delay={i * 60}
                    className="flex items-start gap-3"
                  >
                    <span
                      className="pearl mt-2 shrink-0"
                      aria-hidden="true"
                    />
                    <p className="leading-relaxed text-pretty text-ink-dim">
                      {point}
                    </p>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <PageFaq title={e.faq.title} items={e.faq.items} />

      <ClosingCta
        title={e.cta.title}
        body={e.cta.body}
        primary={e.cta.primary}
        secondary={e.cta.secondary}
      />

      <CtaBand />
    </>
  );
}
