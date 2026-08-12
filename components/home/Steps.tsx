import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { Arrow } from "@/components/icons";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";

/**
 * Three steps — cognitive fluency. The claim being made is that adoption is
 * cheap, so the section itself has to *look* cheap to consume: three numbered
 * rows on a single spine, no more.
 */
export default async function Steps() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section id="how" className="bg-surface-2 py-20 sm:py-24">
      <Container>
        <SectionHead
          eyebrow={c.steps.eyebrow}
          title={c.steps.title}
          sub={c.steps.sub}
        />

        <ol className="relative mx-auto mt-12 flex max-w-2xl flex-col gap-8">
          {/* The spine sits behind the numbered discs, inset from the edge. */}
          <span
            aria-hidden="true"
            className="absolute inset-y-4 start-[1.4rem] w-px bg-line"
          />
          {c.steps.items.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 90}>
              <div className="relative flex items-start gap-5">
                <span className="font-display relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">
                  {s.n}
                </span>
                <div className="pt-1.5">
                  <h3 className="text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-dim">
                    {s.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={180}>
          <div className="mt-12 flex justify-center">
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
