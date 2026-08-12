import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Arrow } from "@/components/icons";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";

/**
 * The bridge: one sentence that reframes every pain above as a single flow.
 * Deliberately short — it is the pivot between "this is my problem" and
 * "here is the machine", and anything longer dilutes it.
 */
export default async function Bridge() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section className="bg-surface py-20 sm:py-24">
      <Container>
        <SectionHead
          eyebrow={c.bridge.eyebrow}
          title={c.bridge.title}
          sub={c.bridge.sub}
        />
        <Reveal delay={120}>
          <ol className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
            {c.bridge.chips.map((chip, i) => (
              <li key={chip} className="flex items-center gap-3">
                <span className="rounded-full border border-line bg-surface-2 px-4 py-2 text-sm font-medium text-ink-2">
                  {chip}
                </span>
                {i < c.bridge.chips.length - 1 ? (
                  <Arrow
                    width={16}
                    height={16}
                    className="flip-rtl text-brand-300"
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}
