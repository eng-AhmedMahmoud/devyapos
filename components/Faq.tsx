import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Chevron } from "./icons";
import Reveal from "./Reveal";
import { Container, SectionHead } from "./Section";

/**
 * FAQ on <details>/<summary> — open state, keyboard support and in-page find
 * all come from the browser, and the answers stay in the HTML for crawlers
 * (these are the queries this site should rank for).
 *
 * Two columns on desktop: eight questions in one stack reads as a wall of
 * objections, which is the opposite of what this section is for.
 */
export default async function Faq() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section id="faq" className="band-cream py-20 sm:py-24">
      <Container>
        <SectionHead kicker={c.faq.eyebrow} title={c.faq.title} sub={c.faq.sub} />

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {c.faq.items.map((item, i) => (
            <Reveal key={item.q} delay={(i % 4) * 50}>
              <details className="card-flat group h-full overflow-hidden p-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-start font-semibold text-ink marker:content-none">
                  {item.q}
                  <Chevron
                    width={20}
                    height={20}
                    className="shrink-0 text-caramel transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="border-t border-line px-5 py-4 text-sm leading-relaxed text-ink-dim">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
