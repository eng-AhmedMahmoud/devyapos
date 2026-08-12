"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { getContent } from "@/content";
import { Check } from "@/components/icons";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";

/**
 * Product tour — a vertical rail of surfaces on the reading edge, the selected
 * screen drawn opposite it.
 *
 * Screenshots go stale the moment the UI moves, and a marketing page should not
 * ship hundreds of kilobytes of PNG to prove a layout. These mocks are CSS on
 * brand tokens, so they weigh nothing, re-tint with the theme, and stay honest
 * about what each screen actually shows.
 */
export default function Tour() {
  const locale = useLocale();
  const c = getContent(locale);
  const [active, setActive] = useState(c.tour.tabs[0].id);
  const tab = c.tour.tabs.find((t) => t.id === active) ?? c.tour.tabs[0];

  return (
    <section className="band-cream py-20 sm:py-24">
      <Container>
        <SectionHead
          kicker={c.tour.eyebrow}
          title={c.tour.title}
          sub={c.tour.sub}
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-12">
          <Reveal>
            <div
              role="tablist"
              aria-label={c.tour.title}
              aria-orientation="vertical"
              className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"
            >
              {c.tour.tabs.map((t) => {
                const on = t.id === active;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls={`tour-panel-${t.id}`}
                    id={`tour-tab-${t.id}`}
                    onClick={() => setActive(t.id)}
                    className={`flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-start text-sm font-bold transition-colors ${
                      on
                        ? "bg-surface text-brand shadow-[var(--shadow-warm)]"
                        : "text-ink-dim hover:bg-surface/60 hover:text-ink"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-6 w-1 rounded-full transition-colors ${
                        on ? "bg-caramel" : "bg-line"
                      }`}
                    />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div
              id={`tour-panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tour-tab-${tab.id}`}
              className="grid items-start gap-8 xl:grid-cols-[1fr_1.05fr]"
            >
              <div>
                <h3 className="font-display text-2xl text-ink">{tab.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-dim">{tab.body}</p>
                <ul className="mt-6 flex flex-col gap-3">
                  {tab.points.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <Check
                        width={18}
                        height={18}
                        className="mt-0.5 shrink-0 text-mint"
                      />
                      <span className="text-sm text-ink-2">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Mock id={tab.id} />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ mocks */

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="card overflow-hidden p-0">
      <div className="flex items-center gap-1.5 border-b border-line bg-surface-2 px-4 py-3">
        <span className="pearl" aria-hidden="true" />
        <span className="pearl" aria-hidden="true" />
        <span className="pearl" aria-hidden="true" />
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function Bar({ w = "100%", tone = "line" }: { w?: string; tone?: string }) {
  return (
    <span
      className={`block h-2 rounded-full ${
        tone === "brand" ? "bg-caramel/60" : "bg-line"
      }`}
      style={{ width: w }}
    />
  );
}

function Mock({ id }: { id: string }) {
  if (id === "kds") {
    return (
      <Frame>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { n: "B01-014", tone: "var(--brand)", pulse: true },
            { n: "B01-013", tone: "var(--gold)", pulse: false },
            { n: "B01-012", tone: "var(--mint)", pulse: false },
          ].map((t) => (
            <div
              key={t.n}
              className={`rounded-2xl border border-line p-3 ${
                t.pulse ? "pulse-ring" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm text-ink">{t.n}</span>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: t.tone }}
                />
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <Bar w="85%" />
                <Bar w="60%" />
                <Bar w="70%" />
              </div>
            </div>
          ))}
        </div>
      </Frame>
    );
  }

  if (id === "shop") {
    return (
      <Frame>
        <div className="mx-auto w-full max-w-[16rem] rounded-3xl border border-line p-3">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-line" />
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="h-12 w-12 shrink-0 rounded-xl bg-surface-3" />
                <span className="flex flex-1 flex-col gap-2">
                  <Bar w="70%" />
                  <Bar w="40%" tone="brand" />
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-9 rounded-full bg-brand" />
        </div>
      </Frame>
    );
  }

  if (id === "admin") {
    return (
      <Frame>
        <div className="flex gap-4">
          <div className="flex w-24 shrink-0 flex-col gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`h-6 rounded-lg ${
                  i === 1 ? "bg-brand/20" : "bg-surface-2"
                }`}
              />
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-12 rounded-xl bg-surface-2" />
              ))}
            </div>
            <div className="flex h-28 items-end gap-2 rounded-xl border border-line p-3">
              {[40, 65, 35, 80, 55, 95, 70].map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-t-md bg-caramel/70"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </Frame>
    );
  }

  // Default: the register.
  return (
    <Frame>
      <div className="flex gap-4">
        <div className="grid flex-1 grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className={`aspect-square rounded-xl ${
                i === 4
                  ? "bg-brand/15 ring-2 ring-caramel/50"
                  : "bg-surface-2"
              }`}
            />
          ))}
        </div>
        <div className="flex w-32 shrink-0 flex-col gap-2 rounded-2xl border border-line p-3">
          <Bar w="80%" />
          <Bar w="55%" />
          <Bar w="65%" />
          <span className="mt-auto block h-px w-full bg-line" />
          <Bar w="70%" tone="brand" />
          <span className="mt-1 block h-8 rounded-full bg-brand" />
        </div>
      </div>
    </Frame>
  );
}
