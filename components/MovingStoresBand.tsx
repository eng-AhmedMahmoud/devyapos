import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { brand } from "@/lib/brand";
import { Check } from "./icons";
import Reveal from "./Reveal";
import { Container, SectionHead } from "./Section";

/**
 * Moving Stores, sold where a POS buyer is already deciding.
 *
 * POS-first vendors sell "online" as the add-on (docs/business/market-research.md
 * §6), and the POS ↔ Stores link for restaurants is built and live, but until
 * 2026-10-22 this site never mentioned the store. The copy (`movingStores`)
 * describes the link exactly as built — menu, prices and branches from the
 * till, web orders on the kitchen display, one sign-in — and nothing it does
 * not do. The address comes from `lib/brand.ts`.
 */
export default async function MovingStoresBand() {
  const locale = await getLocale();
  const s = getContent(locale).movingStores;

  return (
    <section className="bg-surface-2 py-16 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-6">
          <SectionHead kicker={s.eyebrow} title={s.title} sub={s.body} />
          <Reveal delay={60}>
            <a
              href={brand.stores.url}
              target="_blank"
              rel="noopener"
              className="btn btn-primary inline-flex min-h-11 w-fit items-center"
            >
              {s.cta}
            </a>
          </Reveal>
        </div>
        <Reveal delay={90}>
          <ul className="flex flex-col gap-3">
            {s.points.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <Check
                  width={18}
                  height={18}
                  className="sl-tick mt-0.5 shrink-0 text-mint"
                />
                <span className="text-ink-2">{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-ink-dim">{s.note}</p>
        </Reveal>
      </Container>
    </section>
  );
}
