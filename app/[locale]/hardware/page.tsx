import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { formatNumber } from "@/lib/format";
import { pageJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/meta";
import CtaBand from "@/components/CtaBand";
import { Icon } from "@/components/icons";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";
import ClosingCta from "@/components/pages/ClosingCta";
import PageFaq, { pageFaqJsonLd } from "@/components/pages/PageFaq";

const PATH = "/hardware";

/* Same tile hues, in the same order, as the principles grid on /about. */
const TILES = [
  "var(--brand)",
  "var(--caramel)",
  "var(--gold)",
  "var(--mint)",
  "var(--pink)",
  "var(--brand-hover)",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale, "hardware", PATH);
}

/**
 * Bring your own hardware, argued rather than apologised for.
 *
 * The buying guide sits on the espresso band because its footnote — we sell no
 * hardware and take no commission — is the line that makes the advice above it
 * worth reading, and it should not look like fine print.
 */
export default async function HardwarePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getContent(locale);
  const h = c.hardware;

  /* This page's own questions, not the shared FAQ block — see PageFaq. */
  const jsonLd = [
    ...pageJsonLd(locale, PATH).filter((node) => node["@type"] !== "FAQPage"),
    pageFaqJsonLd(locale, PATH, h.faq.items),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <PageHero badge={h.badge} title={h.title} sub={h.sub} />

      {/* Why there is no terminal to sell you. */}
      <section className="bg-bg py-14 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,18rem)_1fr]">
            <Reveal>
              <h2 className="font-display text-2xl text-balance text-ink sm:text-3xl">
                {h.stance.title}
              </h2>
            </Reveal>
            <div className="flex max-w-2xl flex-col gap-6">
              <Reveal>
                <p className="leading-loose text-pretty text-ink-2">
                  {h.stance.body}
                </p>
              </Reveal>
              <ul className="flex flex-col gap-4">
                {h.stance.points.map((point, i) => (
                  <Reveal
                    as="li"
                    key={point}
                    delay={i * 60}
                    className="flex items-start gap-3"
                  >
                    <span className="pearl mt-2 shrink-0" aria-hidden="true" />
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

      {/* What it runs on. */}
      <section className="band-cream py-16 sm:py-20">
        <Container>
          <SectionHead title={h.works.title} sub={h.works.sub} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {h.works.items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={(i % 3) * 70}>
                <article className="card lift flex h-full flex-col gap-3 p-6">
                  <span
                    className="icon-tile"
                    style={{ ["--tile" as string]: TILES[i % TILES.length] }}
                  >
                    <Icon name={item.icon} />
                  </span>
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

      {/* The realistic minimum for one branch. */}
      <section className="bg-bg py-16 sm:py-20">
        <Container>
          <SectionHead title={h.need.title} sub={h.need.sub} />
          <ol className="mt-10 flex flex-col gap-4">
            {h.need.items.map((item, i) => (
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
        </Container>
      </section>

      {/* Buying guidance — generic on purpose, and unpaid for. */}
      <section className="band-espresso pearl-grid-dark py-16 sm:py-20">
        <Container>
          <SectionHead
            title={h.buying.title}
            sub={h.buying.sub}
            tone="espresso"
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {h.buying.items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={(i % 2) * 70}>
                <article className="card-espresso flex h-full flex-col gap-3 p-6 sm:p-7">
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
              {h.buying.note}
            </p>
          </Reveal>
        </Container>
      </section>

      <PageFaq title={h.faq.title} items={h.faq.items} />

      <ClosingCta
        title={h.cta.title}
        body={h.cta.body}
        primary={h.cta.primary}
        secondary={h.cta.secondary}
        whatsappFirst
      />

      <CtaBand />
    </>
  );
}
