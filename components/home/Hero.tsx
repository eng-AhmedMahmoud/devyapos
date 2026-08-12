import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { brand } from "@/lib/brand";
import { Arrow } from "@/components/icons";
import Reveal from "@/components/Reveal";
import { Container } from "@/components/Section";

/**
 * Hero — light wash, badge pill, two-line headline whose second line paints in
 * the brand orange, dual CTA, a risk-reversal line, then the floating stat card
 * that straddles the seam into the next (dark) band.
 */
export default async function Hero() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section className="hero-wash relative overflow-hidden pt-28 pb-24 sm:pt-36 sm:pb-32">
      <Container className="relative flex flex-col items-center text-center">
        <Reveal immediate>
          <span className="inline-flex items-center rounded-full border border-brand-100 bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand">
            {c.hero.badge}
          </span>
        </Reveal>

        <Reveal immediate delay={60}>
          <h1 className="mt-7 text-4xl leading-[1.15] font-bold tracking-tight text-balance text-ink sm:text-6xl">
            {c.hero.line1}
            <br />
            <span className="headline-accent">{c.hero.line2}</span>
          </h1>
        </Reveal>

        <Reveal immediate delay={120}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-pretty text-ink-dim sm:text-lg">
            {c.hero.sub}
          </p>
        </Reveal>

        <Reveal immediate delay={180}>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn btn-primary w-full sm:w-auto">
              {c.hero.ctaPrimary}
              <Arrow width={18} height={18} className="flip-rtl" />
            </Link>
            <a
              href={brand.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost w-full sm:w-auto"
            >
              {c.hero.ctaSecondary}
            </a>
          </div>
        </Reveal>

        <Reveal immediate delay={240}>
          <p className="mt-5 text-sm text-ink-dim">{c.hero.trust}</p>
        </Reveal>
      </Container>

      {/* Stat card — pulled below the fold seam so it overlaps the dark band. */}
      <Container className="relative mt-14 sm:mt-16">
        <Reveal immediate delay={300}>
          <div className="card mx-auto grid max-w-3xl grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0 rtl:sm:divide-x-reverse">
            {c.hero.stats.map((s) => (
              <div key={s.label} className="px-6 py-6 text-center">
                <div className="font-display text-3xl font-bold text-brand sm:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1.5 text-sm text-ink-dim">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
