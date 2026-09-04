"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { getContent } from "@/content";
import { Check } from "./icons";
import Reveal from "./Reveal";
import { Container, SectionHead } from "./Section";

/**
 * Segment tabs, above the plans.
 *
 * A restaurant owner reads a price against the job they are hiring the system
 * for, and "QSR" and "cloud kitchen" are hiring it for different jobs. The tabs
 * let the visitor self-select before a number appears, so the number lands on a
 * reader who has already decided which half of the product they care about.
 *
 * The price is identical in every tab — there is deliberately no `price` on
 * `PricingSegment`. A tabbed pricing page normally implies tiered billing, so
 * `segments.note` says out loud that it does not, and it renders on every tab
 * rather than only the first.
 *
 * Kept out of `Pricing` because `Pricing` is also embedded on /about, where a
 * reader who has just finished the company story does not need to re-qualify
 * themselves before seeing the plans.
 */
export default function PricingSegments() {
  const locale = useLocale();
  const c = getContent(locale);
  const s = c.pricing.segments;
  const [activeId, setActiveId] = useState(s.items[0].id);
  const active = s.items.find((i) => i.id === activeId) ?? s.items[0];

  return (
    <section className="band-cream py-16 sm:py-20">
      <Container>
        <SectionHead kicker={s.eyebrow} title={s.title} sub={s.sub} />

        <Reveal delay={60}>
          <div
            role="tablist"
            aria-label={s.title}
            className="mt-8 flex flex-wrap gap-2"
          >
            {s.items.map((item) => {
              const selected = item.id === active.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`segment-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`segment-panel-${item.id}`}
                  onClick={() => setActiveId(item.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                    selected
                      ? "border-brand bg-brand text-on-brand"
                      : "border-line bg-surface text-ink-dim hover:text-ink"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div
            role="tabpanel"
            id={`segment-panel-${active.id}`}
            aria-labelledby={`segment-tab-${active.id}`}
            tabIndex={0}
            className="card mt-5 grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start"
          >
            <div>
              <h3 className="font-display text-xl text-balance text-ink">
                {active.headline}
              </h3>
              <p className="mt-3 leading-relaxed text-pretty text-ink-dim">
                {active.body}
              </p>
            </div>
            <ul className="flex flex-col gap-2.5 border-t border-line pt-5 lg:border-t-0 lg:border-s lg:pt-0 lg:ps-7">
              {active.points.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <Check
                    width={16}
                    height={16}
                    className="mt-0.5 shrink-0 text-mint"
                  />
                  <span className="text-sm text-ink-2">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* One price, four framings — stated wherever the tabs are, because a
            tab strip above a price grid otherwise reads as four price lists. */}
        <Reveal delay={160}>
          <p className="mt-5 max-w-3xl text-xs leading-relaxed text-ink-dim">
            {s.note}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
