import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { Arrow } from "@/components/icons";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";

/**
 * Three steps — the adoption-cost argument.
 *
 * Cards with an oversized ghost numeral rather than a vertical timeline: the
 * claim is "this is short", and three things side by side read as shorter than
 * three things stacked down a spine.
 */
export default async function Steps() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section id="how" className="bg-bg py-20 sm:py-24">
      <Container>
        <SectionHead
          kicker={c.steps.eyebrow}
          title={c.steps.title}
          sub={c.steps.sub}
        />

        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {c.steps.items.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 90}>
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
                <p className="relative mt-2.5 text-sm leading-relaxed text-ink-dim">
                  {s.body}
                </p>
              </article>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={180}>
          <div className="mt-10">
            <Link href="/contact" className="btn btn-primary">
              {c.steps.cta}
              <Arrow width={18} height={18} className="flip-rtl" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
