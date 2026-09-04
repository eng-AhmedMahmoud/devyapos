import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { brand, mailtoLink, telLink } from "@/lib/brand";
import { pageJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/meta";
import CtaBand from "@/components/CtaBand";
import { Arrow, Icon } from "@/components/icons";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import Pricing from "@/components/Pricing";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale, "about", "/about");
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getContent(locale);
  const a = c.about;

  return (
    <>
      <JsonLd data={pageJsonLd(locale, "/about")} />
      <PageHero badge={a.badge} title={a.title} sub={a.sub} />

      {/* Story — long-form prose, single column, deliberately unadorned. */}
      <section className="bg-bg py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,16rem)_1fr]">
            <Reveal>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                {a.storyTitle}
              </h2>
            </Reveal>
            <div className="flex max-w-2xl flex-col gap-5">
              {a.story.map((p, i) => (
                <Reveal key={i} delay={i * 60}>
                  <p className="leading-loose text-pretty text-ink-2">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Principles — engineering decisions, framed as owner-facing promises. */}
      <section className="band-cream py-16 sm:py-20">
        <Container>
          <SectionHead title={a.principlesTitle} sub={a.principlesSub} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {a.principles.map((p, i) => (
              <Reveal as="li" key={p.title} delay={(i % 3) * 70}>
                <article className="card lift flex h-full flex-col gap-3 p-6">
                  <span
                    className="icon-tile"
                    style={{
                      ["--tile" as string]: [
                        "var(--brand)",
                        "var(--caramel)",
                        "var(--gold)",
                        "var(--mint)",
                        "var(--pink)",
                        "var(--brand-hover)",
                      ][i % 6],
                    }}
                  >
                    <Icon name={p.icon} />
                  </span>
                  <h3 className="font-display text-base text-ink">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-dim">{p.body}</p>
                </article>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Numbers — the espresso interruption, same rhythm as the home page. */}
      <section className="band-espresso pearl-grid-dark py-16 sm:py-20">
        <Container>
          <SectionHead title={a.numbersTitle} tone="espresso" />
          <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {a.numbers.map((n, i) => (
              <Reveal key={n.label} delay={(i % 3) * 60}>
                <div className="card-espresso px-5 py-6 text-center">
                  <dt className="sr-only">{n.label}</dt>
                  <dd>
                    <span className="font-display block text-3xl text-gold">
                      {n.value}
                    </span>
                    <span className="mt-1.5 block text-xs text-on-espresso-dim">
                      {n.label}
                    </span>
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      {/* Timeline */}
      <section className="bg-bg py-16 sm:py-20">
        <Container>
          <SectionHead title={a.timelineTitle} />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {a.timeline.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 80}>
                <article className="card lift relative h-full overflow-hidden p-7">
                  <span
                    aria-hidden="true"
                    className="font-display pointer-events-none absolute top-1 text-6xl text-line-soft select-none"
                    style={{ insetInlineEnd: "0.75rem" }}
                  >
                    {s.n}
                  </span>
                  <span className="pearl pearl-lg" aria-hidden="true" />
                  <h3 className="font-display relative mt-4 text-lg text-ink">
                    {s.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-ink-dim">
                    {s.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Plans restated — a buyer who read the story is warmest here, and
          should not have to navigate away to find the price. */}
      <section className="band-cream py-16 sm:py-20">
        <Container>
          <SectionHead
            kicker={c.pricing.eyebrow}
            title={a.plansTitle}
            sub={a.plansSub}
          />
        </Container>
        <div className="mt-8">
          <Pricing compact />
        </div>
        <Container>
          <Reveal delay={120}>
            <div className="mt-10">
              <Link href="/pricing" className="btn btn-ghost bg-surface">
                {c.pricing.compareLink}
                <Arrow width={16} height={16} className="flip-rtl" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Builder credit — who stands behind the product, stated plainly.
          A restaurant buying an operating system wants to know the studio
          exists and can be reached, so the contact routes sit right here. */}
      <section className="band-espresso pearl-grid-dark py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center">
              <div>
                <span className="kicker text-gold">
                  <span className="pearl" aria-hidden="true" />
                  {a.builtByTitle}
                </span>
                <h2 className="font-display mt-5 text-2xl text-balance text-on-espresso sm:text-3xl">
                  {brand.parent.name}
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-on-espresso-dim">
                  {a.builtByBody}
                </p>
                <a
                  href={brand.parent.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gold transition-colors hover:text-on-espresso"
                >
                  {a.builtByCta}
                  <Arrow width={16} height={16} className="flip-rtl" />
                </a>
              </div>

              <dl className="card-espresso flex flex-col gap-3 p-6 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-on-espresso-dim">
                    {c.contact.channels.items[1].title}
                  </dt>
                  <dd>
                    <a
                      href={telLink}
                      dir="ltr"
                      className="font-bold text-gold transition-colors hover:text-on-espresso"
                    >
                      {brand.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-on-espresso-dim">
                    {c.contact.channels.items[2].title}
                  </dt>
                  <dd>
                    <a
                      href={mailtoLink(c.meta.contact.title)}
                      dir="ltr"
                      className="font-bold text-gold transition-colors hover:text-on-espresso"
                    >
                      {brand.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Closing invitation, phrased as a demo rather than a purchase. */}
      <section className="bg-bg py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="card flex flex-col items-start gap-4 p-8 sm:p-10">
              <h2 className="font-display max-w-xl text-2xl text-balance text-ink">
                {a.ctaTitle}
              </h2>
              <p className="max-w-xl leading-relaxed text-ink-dim">{a.ctaBody}</p>
              <Link href="/contact" className="btn btn-primary mt-2">
                {c.cta.secondary}
                <Arrow width={18} height={18} className="flip-rtl" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
