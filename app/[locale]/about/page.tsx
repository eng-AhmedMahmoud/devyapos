import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { brand } from "@/lib/brand";
import { buildMetadata } from "@/lib/meta";
import CtaBand from "@/components/CtaBand";
import { Arrow, Icon } from "@/components/icons";
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
      <PageHero badge={a.badge} title={a.title} sub={a.sub} />

      {/* Story — long-form prose, single column, deliberately unadorned. */}
      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2 className="text-2xl font-bold text-ink sm:text-3xl">
                {a.storyTitle}
              </h2>
            </Reveal>
            <div className="mt-6 flex flex-col gap-5">
              {a.story.map((p, i) => (
                <Reveal key={i} delay={i * 60}>
                  <p className="leading-loose text-pretty text-ink-2">{p}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={240}>
              <a
                href={brand.flagship.url}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-700"
              >
                {brand.flagship.name[locale === "ar" ? "ar" : "en"]}
                <Arrow width={16} height={16} className="flip-rtl" />
              </a>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Principles — the engineering decisions, framed as owner-facing promises. */}
      <section className="bg-surface-2 py-16 sm:py-20">
        <Container>
          <SectionHead
            title={a.principlesTitle}
            sub={a.principlesSub}
            align="start"
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {a.principles.map((p, i) => (
              <Reveal as="li" key={p.title} delay={(i % 3) * 70}>
                <article className="card lift flex h-full flex-col gap-3 p-6">
                  <span
                    className="icon-tile"
                    style={{ ["--tile" as string]: "var(--brand)" }}
                  >
                    <Icon name={p.icon} />
                  </span>
                  <h3 className="text-base font-semibold text-ink">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-dim">{p.body}</p>
                </article>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Numbers band — the dark interruption, same rhythm as the home page. */}
      <section className="dot-grid-dark bg-dark py-16 sm:py-20">
        <Container>
          <SectionHead title={a.numbersTitle} tone="dark" />
          <dl className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3">
            {a.numbers.map((n, i) => (
              <Reveal key={n.label} delay={(i % 3) * 60}>
                <div className="card-dark px-5 py-6 text-center">
                  <dt className="sr-only">{n.label}</dt>
                  <dd>
                    <span className="font-display block text-3xl font-bold text-brand-300">
                      {n.value}
                    </span>
                    <span className="mt-1.5 block text-xs text-dark-ink-dim">
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
      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <SectionHead title={a.timelineTitle} align="start" />
          <ol className="relative mt-10 flex max-w-2xl flex-col gap-8">
            <span
              aria-hidden="true"
              className="absolute inset-y-4 start-[1.4rem] w-px bg-line"
            />
            {a.timeline.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 80}>
                <div className="relative flex items-start gap-5">
                  <span className="font-display relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">
                    {s.n}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-dim">
                      {s.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Plans, restated on the about page — this is where a buyer who read the
          story is warmest, and they should not have to navigate to find price. */}
      <section className="bg-surface-2 py-16 sm:py-20">
        <Container>
          <SectionHead
            eyebrow={c.pricing.eyebrow}
            title={a.plansTitle}
            sub={a.plansSub}
          />
        </Container>
        <div className="mt-2">
          <Pricing compact />
        </div>
        <Container>
          <Reveal delay={120}>
            <div className="mt-10 flex justify-center">
              <Link href="/pricing" className="btn btn-ghost bg-surface">
                {c.pricing.compareLink}
                <Arrow width={16} height={16} className="flip-rtl" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Closing invitation, phrased as a demo rather than a purchase. */}
      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="card mx-auto flex max-w-3xl flex-col items-center gap-4 p-8 text-center sm:p-10">
              <h2 className="text-2xl font-bold text-balance text-ink">
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
