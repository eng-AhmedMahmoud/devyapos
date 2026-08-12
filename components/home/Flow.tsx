import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";

/**
 * The pipeline: one order crossing four surfaces.
 *
 * Stated as a rail rather than a paragraph, because "these things are actually
 * connected" is a claim about topology and a topology is worth drawing. The
 * rail is a dotted background on a flex row, so it reverses correctly in RTL
 * without a direction-specific rule.
 */
export default async function Flow() {
  const locale = await getLocale();
  const c = getContent(locale);

  const tones = [
    "var(--brand)",
    "var(--caramel)",
    "var(--gold)",
    "var(--mint)",
  ];

  return (
    <section className="band-cream py-20 sm:py-24">
      <Container>
        <SectionHead
          kicker={c.bridge.eyebrow}
          title={c.bridge.title}
          sub={c.bridge.sub}
          align="center"
          className="mx-auto items-center text-center"
        />

        <Reveal delay={120}>
          <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {c.bridge.chips.map((stage, i) => (
              <li key={stage} className="relative flex flex-col items-center text-center">
                {/* Rail segment to the next stage; the last stage has none. */}
                {i < c.bridge.chips.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="flow-rail absolute top-7 hidden h-0.5 lg:block"
                    style={{ insetInlineStart: "60%", width: "80%" }}
                  />
                ) : null}

                <span
                  className="relative z-10 grid h-14 w-14 place-items-center rounded-full border border-line bg-surface"
                  style={{ ["--tile" as string]: tones[i] }}
                >
                  <span
                    className="font-display grid h-10 w-10 place-items-center rounded-full text-base"
                    style={{
                      background: `color-mix(in srgb, ${tones[i]} 16%, transparent)`,
                      color: tones[i],
                    }}
                  >
                    {i + 1}
                  </span>
                </span>
                <span className="mt-4 text-sm font-bold text-ink">{stage}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}
