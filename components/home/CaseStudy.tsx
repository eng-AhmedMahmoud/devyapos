import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { brand } from "@/lib/brand";
import { Arrow } from "@/components/icons";
import Reveal from "@/components/Reveal";
import { Container } from "@/components/Section";

/**
 * Authority band.
 *
 * This replaces the invented-testimonial slot most competitors run. Every
 * number here is verifiable from the deployment the platform was built on, so
 * it does the same trust work without asking anyone to believe a stranger.
 */
export default async function CaseStudy() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section className="bg-surface-2 py-20 sm:py-24">
      <Container>
        <Reveal>
          <div className="card overflow-hidden">
            <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.25fr_1fr] lg:items-center">
              <div>
                <span className="eyebrow">{c.caseStudy.eyebrow}</span>
                <h2 className="mt-4 text-2xl leading-tight font-bold text-balance text-ink sm:text-3xl">
                  {c.caseStudy.title}
                </h2>
                <p className="mt-4 leading-relaxed text-ink-dim">
                  {c.caseStudy.body}
                </p>
                <a
                  href={brand.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-700"
                >
                  {c.caseStudy.link}
                  <Arrow width={16} height={16} className="flip-rtl" />
                </a>
              </div>

              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-line">
                {c.caseStudy.stats.map((s) => (
                  <div key={s.label} className="bg-surface px-5 py-6 text-center">
                    <dt className="sr-only">{s.label}</dt>
                    <dd>
                      <span className="font-display block text-3xl font-bold text-brand">
                        {s.value}
                      </span>
                      <span className="mt-1 block text-xs text-ink-dim">
                        {s.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
