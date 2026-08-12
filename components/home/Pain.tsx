import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Icon } from "@/components/icons";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";

/**
 * Problem agitation, on the dark band.
 *
 * This is the psychological load-bearing section: before any feature is named,
 * the visitor has to recognise their own week in it. Each card is one concrete
 * loss (commission, reconciliation, paper tickets, unknown cost) rather than an
 * abstract benefit.
 */
export default async function Pain() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section className="dot-grid-dark relative overflow-hidden bg-dark py-20 sm:py-24">
      <Container className="relative">
        <SectionHead
          eyebrow={c.pain.eyebrow}
          title={c.pain.title}
          sub={c.pain.sub}
          tone="dark"
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {c.pain.items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 70}>
              <div className="card-dark flex h-full items-start gap-4 p-5 sm:p-6">
                <span
                  className="icon-tile shrink-0"
                  style={{ ["--tile" as string]: "var(--brand)" }}
                >
                  <Icon name={item.icon} />
                </span>
                <div>
                  <h3 className="font-semibold text-dark-ink">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-dark-ink-dim">
                    {item.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
