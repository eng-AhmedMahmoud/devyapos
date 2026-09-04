"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { formatEgp } from "@/lib/format";
import { Check } from "./icons";
import Reveal from "./Reveal";
import { Container, SectionHead } from "./Section";

/** Yearly billing discount applied to the monthly per-branch price. */
const YEARLY_RATE = 0.7;
const MONTHS = 12;

/**
 * Pricing.
 *
 * Three tiers. Two priced, one quoted: the ladder makes the middle tier the
 * obvious pick rather than the only one, and the per-branch unit matches how
 * this market already reasons about cost.
 *
 * (An earlier draft had a permanently free fourth tier. It was dropped; this
 * comment claimed four for a while after the data said three.)
 *
 * The yearly toggle used to show a discounted *monthly* figure and stop there,
 * which left the visitor to work out what actually gets charged. Every priced
 * card now states the twelve-month total and the saving underneath it —
 * ambiguity about the number on the invoice is the cheapest trust to lose.
 */
export default function Pricing({ compact = false }: { compact?: boolean }) {
  const locale = useLocale();
  const c = getContent(locale);
  const [yearly, setYearly] = useState(false);

  /** `{total}`/`{saved}` are the only tokens in `pricing.annual`. */
  const fill = (template: string, values: Record<string, string>) =>
    template.replace(/\{(total|saved)\}/g, (match, key: string) =>
      key in values ? values[key] : match,
    );

  return (
    <section id="pricing" className={compact ? "py-2" : "bg-bg py-20 sm:py-24"}>
      <Container>
        {!compact ? (
          <SectionHead
            kicker={c.pricing.eyebrow}
            title={c.pricing.title}
            sub={c.pricing.sub}
          />
        ) : null}

        <Reveal delay={60}>
          <div className={compact ? "flex justify-center" : "mt-8 flex"}>
            <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface-2 p-1">
              <button
                type="button"
                onClick={() => setYearly(false)}
                aria-pressed={!yearly}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  !yearly
                    ? "bg-surface text-ink shadow-[var(--shadow-warm)]"
                    : "text-ink-dim"
                }`}
              >
                {c.pricing.monthly}
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                aria-pressed={yearly}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  yearly
                    ? "bg-surface text-ink shadow-[var(--shadow-warm)]"
                    : "text-ink-dim"
                }`}
              >
                {c.pricing.yearly}
                <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand">
                  {c.pricing.save}
                </span>
              </button>
            </div>
          </div>
        </Reveal>

        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {c.pricing.plans.map((plan, i) => {
            const monthly =
              plan.price === null
                ? null
                : yearly
                  ? Math.round(plan.price * YEARLY_RATE)
                  : plan.price;

            // What the card is actually asking for, and what the monthly plan
            // would have cost over the same twelve months. Derived from the
            // rounded monthly figure the card prints, so the three numbers
            // reconcile exactly rather than to within a pound.
            const annualTotal = monthly === null ? null : monthly * MONTHS;
            const annualSaved =
              plan.price === null || annualTotal === null
                ? null
                : plan.price * MONTHS - annualTotal;

            return (
              <Reveal as="li" key={plan.id} delay={(i % 4) * 60}>
                <article
                  className={`card relative flex h-full flex-col p-6 ${
                    plan.featured
                      ? "border-brand shadow-[var(--shadow-lift)]"
                      : ""
                  }`}
                >
                  {plan.badge ? (
                    <span className="absolute -top-3 inline-flex rounded-full bg-brand px-3 py-1 text-xs font-bold text-on-brand">
                      {plan.badge}
                    </span>
                  ) : null}

                  <h3 className="font-display text-lg text-ink">{plan.name}</h3>
                  <p className="mt-1.5 text-sm text-ink-dim">{plan.tagline}</p>

                  <div className="mt-6 flex items-end gap-2">
                    {monthly === null || monthly === 0 ? (
                      <span className="font-display text-3xl text-ink">
                        {plan.priceLabel}
                      </span>
                    ) : (
                      <>
                        <span className="font-display text-[2.5rem] leading-none text-ink">
                          {formatEgp(locale, monthly)}
                        </span>
                        <span className="pb-1 text-sm text-ink-dim">
                          {c.pricing.currency}
                          {c.pricing.per}
                        </span>
                      </>
                    )}
                  </div>
                  <p
                    className={`mt-1 text-xs ${
                      monthly !== null && monthly > 0
                        ? "text-ink-dim"
                        : "text-transparent select-none"
                    }`}
                  >
                    {c.pricing.perBranch}
                  </p>

                  {/* The amount that leaves the bank account. Only on the
                      yearly toggle, and only where there is a price to
                      multiply — Enterprise is quoted, not billed. */}
                  {yearly && annualTotal !== null && annualSaved !== null ? (
                    <div className="mt-4 rounded-xl border border-line bg-surface-2 px-3.5 py-3">
                      <p className="text-xs font-bold text-ink-2">
                        {c.pricing.annual.label}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-2">
                        {fill(c.pricing.annual.total, {
                          total: formatEgp(locale, annualTotal),
                        })}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-mint">
                        {fill(c.pricing.annual.saving, {
                          saved: formatEgp(locale, annualSaved),
                        })}
                      </p>
                    </div>
                  ) : null}

                  <ul className="mt-6 flex flex-1 flex-col gap-2.5 border-t border-line pt-5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check
                          width={16}
                          height={16}
                          className="mt-0.5 shrink-0 text-mint"
                        />
                        <span className="text-sm text-ink-2">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    onClick={() =>
                      // `plan` is the stable id, not the label: the Arabic
                      // card says "النمو" and the English one "Growth", and
                      // one funnel split in two by locale answers nothing.
                      // The rendered name rides along for readability.
                      track("pricing_cta_click", {
                        locale,
                        plan: plan.id,
                        planName: plan.name,
                        billing: yearly ? "yearly" : "monthly",
                      })
                    }
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
          <div className="mt-8 flex flex-col gap-3">
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-sm font-bold text-brand">
              <span className="pearl" aria-hidden="true" />
              {c.pricing.founding}
            </p>
            {yearly ? (
              <p className="max-w-2xl text-xs leading-relaxed text-ink-dim">
                {c.pricing.annual.note}
              </p>
            ) : null}
            <p className="max-w-2xl text-xs leading-relaxed text-ink-dim">
              {c.pricing.note}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
