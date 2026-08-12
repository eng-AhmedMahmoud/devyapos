"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { formatEgp } from "@/lib/format";
import { Check } from "./icons";
import Reveal from "./Reveal";
import { Container, SectionHead } from "./Section";

/** Yearly billing discount applied to the monthly per-branch price. */
const YEARLY_RATE = 0.7;

/**
 * Pricing.
 *
 * Four tiers instead of the single plan the incumbent sells: a permanently free
 * entry point removes the first objection outright, and the paid ladder makes
 * the middle tier the obvious pick rather than the only one. The per-branch
 * unit matches how this market already reasons about cost.
 */
export default function Pricing({ compact = false }: { compact?: boolean }) {
  const locale = useLocale();
  const c = getContent(locale);
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className={compact ? "py-4" : "bg-surface py-20 sm:py-24"}>
      <Container>
        {!compact ? (
          <SectionHead
            eyebrow={c.pricing.eyebrow}
            title={c.pricing.title}
            sub={c.pricing.sub}
          />
        ) : null}

        <Reveal delay={60}>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface-2 p-1">
              <button
                type="button"
                onClick={() => setYearly(false)}
                aria-pressed={!yearly}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  !yearly ? "bg-surface text-ink shadow-sm" : "text-ink-dim"
                }`}
              >
                {c.pricing.monthly}
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                aria-pressed={yearly}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  yearly ? "bg-surface text-ink shadow-sm" : "text-ink-dim"
                }`}
              >
                {c.pricing.yearly}
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand">
                  {c.pricing.save}
                </span>
              </button>
            </div>
          </div>
        </Reveal>

        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {c.pricing.plans.map((plan, i) => {
            const monthly =
              plan.price === null
                ? null
                : yearly
                  ? Math.round(plan.price * YEARLY_RATE)
                  : plan.price;

            return (
              <Reveal as="li" key={plan.id} delay={(i % 4) * 60}>
                <article
                  className={`card flex h-full flex-col p-6 ${
                    plan.featured
                      ? "border-brand ring-1 ring-brand/30"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-ink">{plan.name}</h3>
                    {plan.badge ? (
                      <span className="rounded-full bg-brand px-2.5 py-1 text-xs font-semibold text-white">
                        {plan.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-sm text-ink-dim">{plan.tagline}</p>

                  <div className="mt-6 flex items-end gap-2">
                    {monthly === null || monthly === 0 ? (
                      <span className="font-display text-3xl font-bold text-ink">
                        {plan.priceLabel}
                      </span>
                    ) : (
                      <>
                        <span className="font-display text-4xl font-bold text-ink">
                          {formatEgp(locale, monthly)}
                        </span>
                        <span className="pb-1.5 text-sm text-ink-dim">
                          {c.pricing.currency}
                          {c.pricing.per}
                        </span>
                      </>
                    )}
                  </div>
                  {monthly !== null && monthly > 0 ? (
                    <p className="mt-1 text-xs text-ink-dim">
                      {c.pricing.perBranch}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-transparent select-none">—</p>
                  )}

                  <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check
                          width={16}
                          height={16}
                          className="mt-0.5 shrink-0 text-brand"
                        />
                        <span className="text-sm text-ink-2">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className={`btn mt-7 w-full ${
                      plan.featured ? "btn-primary" : "btn-ghost"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={140}>
          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <p className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand">
              {c.pricing.founding}
            </p>
            <p className="max-w-2xl text-xs leading-relaxed text-ink-dim">
              {c.pricing.note}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
