import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { brand } from "@/lib/brand";
import { Arrow, Check } from "@/components/icons";
import Reveal from "@/components/Reveal";
import { Container } from "@/components/Section";

/**
 * Hero — asymmetric split rather than a centred stack: the argument runs down
 * the reading edge, and the order-flow card sits opposite it so the visitor
 * sees the product doing something before they have read a feature list.
 */
export default async function Hero() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section className="hero-wash relative overflow-hidden py-16 sm:py-24">
      {/* Soft brand blobs behind the visual column. */}
      <span
        aria-hidden="true"
        className="blob -top-24 h-80 w-80 bg-caramel"
        style={{ insetInlineEnd: "-4rem" }}
      />
      <span
        aria-hidden="true"
        className="blob bottom-0 h-64 w-64 bg-pink"
        style={{ insetInlineStart: "-3rem", animationDelay: "-7s" }}
      />

      <Container className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal immediate>
            <span className="kicker">
              <span className="pearl" aria-hidden="true" />
              {c.hero.badge}
            </span>
          </Reveal>

          <Reveal immediate delay={60}>
            <h1 className="font-display mt-5 text-[2.6rem] text-balance text-ink sm:text-6xl">
              {c.hero.line1}{" "}
              <span className="text-caramel-grad">{c.hero.line2}</span>
            </h1>
          </Reveal>

          <Reveal immediate delay={120}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-ink-dim sm:text-lg">
              {c.hero.sub}
            </p>
          </Reveal>

          <Reveal immediate delay={180}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn btn-primary">
                {c.hero.ctaPrimary}
                <Arrow width={18} height={18} className="flip-rtl" />
              </Link>
              <a
                href={brand.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost"
              >
                {c.hero.ctaSecondary}
              </a>
            </div>
          </Reveal>

          <Reveal immediate delay={240}>
            <p className="mt-5 flex items-center gap-2 text-sm text-ink-dim">
              <Check width={16} height={16} className="shrink-0 text-mint" />
              {c.hero.trust}
            </p>
          </Reveal>

          <Reveal immediate delay={300}>
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-line pt-7">
              {c.hero.stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="font-display block text-3xl text-brand">
                      {s.value}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-dim">
                      {s.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal immediate delay={220}>
          <OrderFlowCard locale={locale} />
        </Reveal>
      </Container>
    </section>
  );
}

/**
 * The hero visual: one order walking the four surfaces it touches. It is the
 * thesis of the whole site rendered as a component, and it is CSS rather than a
 * screenshot so it never goes stale and costs no image request.
 */
function OrderFlowCard({ locale }: { locale: string }) {
  const c = getContent(locale);
  const stages = c.bridge.chips;

  return (
    <div className="card relative p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
        <span className="font-display text-sm text-ink">B01-014</span>
        <span className="flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
          <span className="pulse-ring h-1.5 w-1.5 rounded-full bg-brand" />
          {stages[0]}
        </span>
      </div>

      <ol className="mt-5 flex flex-col gap-4">
        {stages.map((stage, i) => (
          <li key={stage} className="flex items-center gap-4">
            <span
              className="icon-tile h-9 w-9 shrink-0 text-sm font-bold"
              style={{
                ["--tile" as string]: [
                  "var(--brand)",
                  "var(--caramel)",
                  "var(--gold)",
                  "var(--mint)",
                ][i],
              }}
            >
              {i + 1}
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-ink">
                {stage}
              </span>
              <span className="mt-1.5 block h-1.5 rounded-full bg-surface-2">
                <span
                  className="block h-1.5 rounded-full bg-caramel/60"
                  style={{ width: `${100 - i * 18}%` }}
                />
              </span>
            </span>
            <Check width={16} height={16} className="shrink-0 text-mint" />
          </li>
        ))}
      </ol>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-surface-2 px-4 py-3">
        <span className="text-xs text-ink-dim">{c.caseStudy.eyebrow}</span>
        <span className="flex items-center gap-1.5" aria-hidden="true">
          <span className="pearl" />
          <span className="pearl" />
          <span className="pearl pearl-lg" />
        </span>
      </div>
    </div>
  );
}
