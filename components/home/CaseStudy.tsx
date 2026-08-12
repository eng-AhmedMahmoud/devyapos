import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { brand } from "@/lib/brand";
import { Arrow } from "@/components/icons";
import Reveal from "@/components/Reveal";
import { Container } from "@/components/Section";

/**
 * Authority band, on espresso.
 *
 * This occupies the slot most competitors fill with invented testimonials.
 * Every number here is verifiable from the deployment the platform was built
 * on, so it does the same trust work without asking anyone to believe a
 * stranger.
 */
export default async function CaseStudy() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section className="band-espresso pearl-grid-dark py-20 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <Reveal>
          <div>
            <span className="kicker text-gold">
              <span className="pearl" aria-hidden="true" />
              {c.caseStudy.eyebrow}
            </span>
            <h2 className="font-display mt-5 text-3xl text-balance text-on-espresso sm:text-[2.4rem]">
              {c.caseStudy.title}
            </h2>
            <p className="mt-5 leading-relaxed text-on-espresso-dim">
              {c.caseStudy.body}
            </p>
            <a
              href={brand.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-gold transition-colors hover:text-on-espresso"
            >
              {c.caseStudy.link}
              <Arrow width={16} height={16} className="flip-rtl" />
            </a>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <dl className="grid grid-cols-2 gap-4">
            {c.caseStudy.stats.map((s) => (
              <div key={s.label} className="card-espresso px-5 py-6 text-center">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="font-display block text-4xl text-gold">
                    {s.value}
                  </span>
                  <span className="mt-1.5 block text-xs text-on-espresso-dim">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
