import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Arrow, Check, Icon } from "@/components/icons";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";

/**
 * Before/after ledger.
 *
 * The problem and the line that cancels it sit on one row, so agitation and
 * relief land in the same eye movement instead of being separated by a scroll.
 * The "today" side is struck through — the visual promise that this column is
 * about to stop being true.
 */
export default async function Ledger() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section className="bg-bg py-20 sm:py-24">
      <Container>
        <SectionHead
          kicker={c.pain.eyebrow}
          title={c.pain.title}
          sub={c.pain.sub}
        />

        <div className="mt-12 flex flex-col gap-4">
          {/* Column labels — desktop only; on mobile each half labels itself. */}
          <div className="hidden grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 lg:grid">
            <span className="text-xs font-bold tracking-widest text-danger uppercase">
              {c.pain.beforeLabel}
            </span>
            <span className="w-5" />
            <span className="text-xs font-bold tracking-widest text-mint uppercase">
              {c.pain.afterLabel}
            </span>
          </div>

          {c.pain.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <article className="card-flat ledger-row grid gap-5 p-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6">
                <div className="ledger-problem flex items-start gap-4">
                  <span
                    className="icon-tile shrink-0"
                    style={{ ["--tile" as string]: "var(--danger)" }}
                  >
                    <Icon name={item.icon} />
                  </span>
                  <div>
                    <h3 className="ledger-strike font-semibold text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-dim">
                      {item.body}
                    </p>
                  </div>
                </div>

                <Arrow
                  width={20}
                  height={20}
                  aria-hidden="true"
                  className="ledger-arrow flip-rtl hidden shrink-0 text-caramel lg:block"
                />

                <div className="ledger-fix flex items-start gap-4 rounded-2xl bg-surface-2 p-4 lg:bg-transparent lg:p-0">
                  <Check
                    width={20}
                    height={20}
                    className="mt-0.5 shrink-0 text-mint"
                  />
                  <p className="text-sm leading-relaxed font-medium text-ink-2">
                    {item.fix}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
