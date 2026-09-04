import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Arrow, Check } from "./icons";
import Reveal from "./Reveal";
import { Container, SectionHead } from "./Section";

/**
 * External C4 model of the platform. Kept here rather than in `lib/brand.ts`
 * because this is the only label on the site that fits it ("see the system
 * architecture"); the page it opens is product-branded and names no client.
 */
const ARCHITECTURE_URL = "https://bohub-c4.vercel.app";

/**
 * The anchor deployment — the site's one piece of hard proof, and for a long
 * time the only block in the content tree that nothing rendered.
 *
 * It sits directly under the hero on purpose: a visitor who has just read a
 * promise should meet the evidence before the argument, not three sections
 * after it.
 *
 * The chain is anonymous by agreement (see `caseStudy` in `content/types.ts`).
 * Nothing here may identify them — no logo, no name, no photograph, and no
 * quote they did not give us. The numbers are the whole exhibit, and
 * `anonymity` is rendered alongside them so the omission reads as a choice
 * rather than as a missing asset.
 */
export default async function CaseStudy() {
  const locale = await getLocale();
  const c = getContent(locale);
  const s = c.caseStudy;

  return (
    <section id="proof" className="band-cream py-20 sm:py-24">
      <Container>
        <SectionHead kicker={s.eyebrow} title={s.title} sub={s.body} />

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* The numbers, as one block — a deployment reads as a deployment
              only when the menu size is next to the branch count. */}
          <Reveal>
            <div className="card p-6 sm:p-7">
              <h3 className="font-display text-base text-ink">{s.statsTitle}</h3>
              <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-7">
                {s.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      {/* Values arrive pre-localised from the content tree —
                          Arabic carries its own Arabic-Indic digits. */}
                      <span className="font-display block text-[2.25rem] leading-none text-brand">
                        {stat.value}
                      </span>
                      <span className="mt-2 block text-xs leading-relaxed text-ink-dim">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <ul className="grid gap-4 sm:grid-cols-2">
            {s.facts.map((fact, i) => (
              <Reveal as="li" key={fact.title} delay={(i % 2) * 70}>
                <article className="card lift flex h-full flex-col gap-2.5 p-6">
                  <span className="flex items-center gap-2.5">
                    <Check
                      width={16}
                      height={16}
                      className="shrink-0 text-mint"
                    />
                    <h3 className="font-display text-base text-ink">
                      {fact.title}
                    </h3>
                  </span>
                  <p className="text-sm leading-relaxed text-ink-dim">
                    {fact.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={140}>
          <div className="mt-9 flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-xs leading-relaxed text-ink-dim">
              {s.anonymity}
            </p>
            <a
              href={ARCHITECTURE_URL}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost shrink-0 bg-surface"
            >
              {s.link}
              <Arrow width={16} height={16} className="flip-rtl" />
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
