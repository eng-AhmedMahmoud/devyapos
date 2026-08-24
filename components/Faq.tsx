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

        {/* items-start is the whole fix. The grid previously stretched every
            card to its row height, so opening one answer grew its neighbour by
            the same amount and left a gap of dead space — the open item and an
            unrelated closed one both jumped. Each card now sizes to its own
            content, so opening one moves only what is below it in that column. */}
        <div className="mt-12 grid items-start gap-4 lg:grid-cols-2">
          {c.faq.items.map((item, i) => (
            <Reveal key={item.q} delay={(i % 4) * 50}>
              <details className="faq-item card-flat group overflow-hidden p-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-start font-semibold text-ink marker:content-none">
                  {item.q}
                  <Chevron
                    width={20}
                    height={20}
                    className="shrink-0 text-caramel transition-transform group-open:rotate-180"
                  />
                </summary>
                {/* The grid wrapper is what animates: height cannot be
                    transitioned from auto, but grid-template-rows 0fr -> 1fr
                    can, and it needs no measured pixel value. */}
                <div className="faq-answer">
                  <p className="overflow-hidden border-t border-line px-5 py-4 text-sm leading-relaxed text-ink-dim">
                    {item.a}
                  </p>
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
