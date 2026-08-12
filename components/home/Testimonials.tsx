import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";

/**
 * Customer quotes.
 *
 * The section renders nothing while `testimonials.items` is empty, which is the
 * intended state until real signed quotes exist. Shipping invented ones would
 * be the one thing on this page a competitor could legitimately attack — and it
 * is a claim about named people, so it does not get placeholder treatment.
 */
export default async function Testimonials() {
  const locale = await getLocale();
  const c = getContent(locale);
  if (c.testimonials.items.length === 0) return null;

  return (
    <section className="bg-surface py-20 sm:py-24">
      <Container>
        <SectionHead eyebrow={c.testimonials.eyebrow} title={c.testimonials.title} />
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {c.testimonials.items.map((t, i) => (
            <Reveal as="li" key={t.name} delay={(i % 3) * 70}>
              <figure className="card flex h-full flex-col gap-4 p-6">
                <div aria-hidden="true" className="flex gap-1 text-brand">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s}>★</span>
                  ))}
                </div>
                <blockquote className="flex-1 leading-relaxed text-ink-2">
                  “{t.quote}”
                </blockquote>
                <figcaption className="flex items-center gap-3 border-t border-line pt-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand">
                    {t.name.slice(0, 1)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">
                      {t.name}
                    </span>
                    <span className="block text-xs text-ink-dim">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
