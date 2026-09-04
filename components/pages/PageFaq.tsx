import type { Faq as FaqItem } from "@/content";
import { Chevron } from "@/components/icons";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";
import type { JsonLdNode } from "@/lib/jsonld";
import { localeHref } from "@/lib/meta";

/**
 * The site FAQ accordion, pointed at one page's own questions.
 *
 * `components/Faq.tsx` renders the shared `faq` block and takes no props, so a
 * page carrying its own questions (`etaInvoicing.faq`, `hardware.faq`) cannot
 * reuse it directly. Everything visual here is copied from it verbatim — the
 * same <details>/<summary> mechanics, the same `faq-item` / `faq-answer`
 * classes, the same `items-start` grid — so the two read as one component and
 * a change to the design lands in both.
 */
export default function PageFaq({
  title,
  sub,
  items,
  band = "band-cream",
}: {
  title: string;
  sub?: string;
  items: readonly FaqItem[];
  /** Section background, so the page can keep its band rhythm. */
  band?: string;
}) {
  return (
    <section id="faq" className={`${band} py-16 sm:py-20`}>
      <Container>
        <SectionHead title={title} sub={sub} />

        <div className="mt-10 grid items-start gap-4 lg:grid-cols-2">
          {items.map((item, i) => (
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

/**
 * FAQPage markup for the items this component renders.
 *
 * `faqPageJsonLd` in `lib/jsonld.ts` always reads the shared `c.faq.items`,
 * which on these pages would describe a different set of questions than the
 * page shows — precisely the markup/page mismatch that library is written to
 * avoid. This one is handed the same array the component maps over, so the
 * visible answers and the structured ones cannot drift apart.
 */
export function pageFaqJsonLd(
  locale: string,
  path: string,
  items: readonly FaqItem[],
): JsonLdNode {
  return {
    "@type": "FAQPage",
    "@id": `${localeHref(locale, path)}#faq`,
    inLanguage: locale,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
