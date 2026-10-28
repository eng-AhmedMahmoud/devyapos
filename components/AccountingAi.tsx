"use client";

import type { SiteContent } from "@/content/types";
import { accountingPlan } from "@/lib/accounting-plans";
import { formatNumber } from "@/lib/format";
import { AI_PACKS, PLAN_CURRENCIES, type PlanCurrency } from "@/lib/plans";
import PricingToggle from "./PricingToggle";
import Reveal from "./Reveal";
import { SectionHead } from "./Section";

/**
 * AI credits, under the accounting plans (`/accounting-trial#ai-credits`).
 *
 * The credit is the one Moving POS sells (bohub-pos decision
 * `2026-10-26-ai-credits-and-usage-limits.md`), so the packs and their prices
 * are `AI_PACKS` from `lib/plans.ts`. What is the books' own: the monthly
 * allowance per plan, and the bill captures each plan reads a month without
 * drawing a credit (`lib/accounting-plans.ts`). It repeats the currency switch
 * (one state, owned by `AccountingPricing`) so a visitor down here need not
 * scroll back up to change it, as `PricingAi` does on /pricing.
 */
export default function AccountingAi({
  copy: ai,
  plans,
  shared,
  locale,
  currency,
  onCurrency,
}: {
  /** `accountingTrial.pricing.ai`. */
  copy: SiteContent["accountingTrial"]["pricing"]["ai"];
  plans: SiteContent["accountingTrial"]["pricing"]["plans"];
  shared: Pick<SiteContent["pricing"], "currencies" | "currencyLabel" | "currencyNames">;
  locale: string;
  currency: PlanCurrency;
  onCurrency: (currency: PlanCurrency) => void;
}) {
  const money = (value: number) => `${formatNumber(locale, value)} ${shared.currencies[currency]}`;
  const head = "border-b border-line py-2 text-xs font-bold text-ink-dim";
  const cell = "border-b border-line-soft py-2.5";

  return (
    <div id="ai-credits" className="mt-20 border-t border-line pt-14 sm:mt-24">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHead kicker={ai.eyebrow} title={ai.title} sub={ai.sub} />
        <PricingToggle
          label={shared.currencyLabel}
          options={PLAN_CURRENCIES.map((code) => ({
            value: code,
            label: shared.currencyNames[code],
          }))}
          value={currency}
          onChange={onCurrency}
        />
      </div>

      <Reveal delay={60}>
        <p className="mt-8 inline-flex w-fit max-w-full items-start gap-2 bg-brand-soft px-4 py-2.5 text-sm font-bold text-ink">
          <span className="pearl mt-1.5 shrink-0" aria-hidden="true" />
          <span>{ai.credit}</span>
        </p>
      </Reveal>

      <div className="mt-8 grid items-start gap-4 lg:grid-cols-2">
        <Reveal as="article" className="card p-6">
          <h3 className="font-display text-lg text-ink">{ai.included.title}</h3>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr>
                <th scope="col" className={`${head} text-start`}>
                  {ai.included.plan}
                </th>
                <th scope="col" className={`${head} text-end`}>
                  {ai.included.credits}
                </th>
                <th scope="col" className={`${head} text-end`}>
                  {ai.included.captures}
                </th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => {
                const n = accountingPlan(plan.id);
                const monthly = n.aiCreditsMonthly > 0;
                const captures = n.limits.billCapturesPerMonth ?? 0;
                return (
                  <tr key={plan.id}>
                    <th scope="row" className={`${cell} text-start font-semibold text-ink`}>
                      {plan.name}
                    </th>
                    <td className={`${cell} text-end text-ink-2`}>
                      {formatNumber(locale, monthly ? n.aiCreditsMonthly : n.aiTrialCredits)}{" "}
                      <span className="text-xs text-ink-dim">
                        {monthly ? ai.included.monthly : ai.included.once}
                      </span>
                    </td>
                    <td className={`${cell} text-end text-ink-2`}>
                      {captures > 0 ? formatNumber(locale, captures) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Reveal>

        <Reveal as="article" delay={60} className="card p-6">
          <h3 className="font-display text-lg text-ink">{ai.packs.title}</h3>
          <p className="mt-1.5 text-sm text-ink-dim">{ai.packs.sub}</p>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr>
                <th scope="col" className={`${head} text-start`}>
                  {ai.packs.credits}
                </th>
                <th scope="col" className={`${head} text-end`}>
                  {ai.packs.price}
                </th>
              </tr>
            </thead>
            <tbody>
              {AI_PACKS.map((pack) => (
                <tr key={pack.credits}>
                  <th scope="row" className={`${cell} text-start font-semibold text-ink`}>
                    {formatNumber(locale, pack.credits)}
                  </th>
                  <td className={`${cell} text-end font-semibold whitespace-nowrap text-ink`}>
                    {money(pack.price[currency])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>

      <p className="mt-5 max-w-3xl text-xs leading-relaxed text-ink-dim">{ai.note}</p>
    </div>
  );
}
