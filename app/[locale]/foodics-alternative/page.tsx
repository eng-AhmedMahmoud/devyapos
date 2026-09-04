import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { pageJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/meta";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";
import ClosingCta from "@/components/pages/ClosingCta";

const PATH = "/foodics-alternative";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale, "foodicsAlternative", PATH);
}

/**
 * The named comparison.
 *
 * `disclaimer` sits directly under the hero and `facts.source` directly under
 * the rows: the figures are someone else's published prices, and the two lines
 * that date and hedge them travel with them or the table stops being honest.
 *
 * `pickThem` and `pickUs` are rendered identically — same band weight, same
 * card, same heading scale. A "reasons to buy the competitor" section styled
 * quieter than its neighbour is a straw man with extra steps.
 */
export default async function FoodicsAlternativePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getContent(locale);
  const f = c.foodicsAlternative;

  return (
    <>
      <JsonLd data={pageJsonLd(locale, PATH)} />

      <PageHero badge={f.badge} title={f.title} sub={f.sub} />

      {/* Trademark and sourcing note, before any claim is made. */}
      <section className="bg-bg pt-12 sm:pt-14">
        <Container>
          <Reveal>
            <p className="card-flat max-w-3xl p-5 text-xs leading-relaxed text-ink-dim">
              {f.disclaimer}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* The framing: two different bets, not a good product and a bad one. */}
      <section className="bg-bg py-14 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,18rem)_1fr]">
            <Reveal>
              <h2 className="font-display text-2xl text-balance text-ink sm:text-3xl">
                {f.positioning.title}
              </h2>
            </Reveal>
            <div className="flex max-w-2xl flex-col gap-6">
              <Reveal>
                <p className="leading-loose text-pretty text-ink-2">
                  {f.positioning.body}
                </p>
              </Reveal>
              <ul className="flex flex-col gap-4">
                {f.positioning.points.map((point, i) => (
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

      {/* The numbers, in the same row shape /pricing uses for the market
          anchor — one comparison language across the site. */}
      <section className="band-cream py-16 sm:py-20">
        <Container>
          <SectionHead title={f.facts.title} sub={f.facts.sub} />
          <Reveal delay={90}>
            <ul className="mt-9 flex flex-col gap-3">
              {f.facts.rows.map((row) => (
                <li
                  key={row.label}
                  className={`
                    flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-2xl
                    border p-5
                    ${
                      row.ours
                        ? "border-brand/50 bg-brand-soft"
                        : "border-line bg-surface"
                    }
                  `}
                >
                  <span
                    className={`font-display text-base ${
                      row.ours ? "text-brand" : "text-ink"
                    }`}
                  >
                    {row.label}
                  </span>
                  <span
                    className={`font-display ms-auto text-xl ${
                      row.ours ? "text-brand" : "text-ink-dim"
                    }`}
                  >
                    {row.value}
                  </span>
                  {/* Its own line: the caveat is what keeps the row honest. */}
                  <span className="w-full text-xs leading-relaxed text-ink-dim">
                    {row.note}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 max-w-3xl text-xs leading-relaxed text-ink-dim">
              {f.facts.source}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Reasons to buy the other product. */}
      <section className="bg-bg py-16 sm:py-20">
        <Container>
          <SectionHead title={f.pickThem.title} sub={f.pickThem.sub} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {f.pickThem.items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={(i % 3) * 70}>
                <article className="card lift flex h-full flex-col gap-3 p-6">
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

      {/* Reasons to buy this one. Same treatment, deliberately. */}
      <section className="band-cream py-16 sm:py-20">
        <Container>
          <SectionHead title={f.pickUs.title} sub={f.pickUs.sub} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {f.pickUs.items.map((item, i) => (
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

      <ClosingCta
        title={f.cta.title}
        body={f.cta.body}
        primary={f.cta.primary}
        secondary={f.cta.secondary}
        note={f.cta.note}
      />

      <CtaBand />
    </>
  );
}
