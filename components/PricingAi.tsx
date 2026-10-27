"use client";

import type { SiteContent } from "@/content/types";
import { formatNumber } from "@/lib/format";
import {
  AI_PACKS,
  AI_TIERS,
  PLAN_CURRENCIES,
  planNumbers,
  type PlanCurrency,
} from "@/lib/plans";
import PricingToggle from "./PricingToggle";
import Reveal from "./Reveal";
import { SectionHead } from "./Section";

/**
 * AI credits, under the plan grid (`/pricing#ai-credits`).
 *
 * Short on purpose: what a credit is, what each plan already includes, and
 * the two ways to buy more — a monthly tier or a one-off pack — priced in the
 * currency the visitor picked above. It carries the same currency switch
 * again (one state, owned by `Pricing`), because a visitor who scrolled down
 * here from the add-on link should not have to scroll back up to change it.
 *
 * The figures are bohub-pos `packages/shared/src/ai-credits.ts`, mirrored in
 * `lib/plans.ts`; the tables print numbers only, so no Arabic count has to
 * agree with a noun.
 */
export default function PricingAi({
  copy,
  plans,
  locale,
  currency,
  onCurrency,
}: {
  /** `pricing` from the page's content tree. */
  copy: Pick<SiteContent["pricing"], "ai" | "currencies" | "currencyLabel" | "currencyNames">;
  plans: SiteContent["pricing"]["plans"];
  locale: string;
  currency: PlanCurrency;
  onCurrency: (currency: PlanCurrency) => void;
}) {
  const ai = copy.ai;
  const money = (value: number) => `${formatNumber(locale, value)} ${copy.currencies[currency]}`;
  const head = "border-b border-line py-2 text-xs font-bold text-ink-dim";
  const cell = "border-b border-line-soft py-2.5";

  return (
    <div id="ai-credits" className="mt-20 border-t border-line pt-14 sm:mt-24">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHead kicker={ai.eyebrow} title={ai.title} sub={ai.sub} />
        <PricingToggle
          label={copy.currencyLabel}
          options={PLAN_CURRENCIES.map((code) => ({
            value: code,
            label: copy.currencyNames[code],
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

      <div className="mt-8 grid items-start gap-4 lg:grid-cols-3">
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
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => {
                const n = planNumbers(plan.id);
                const monthly = n.aiCreditsMonthly > 0;
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Reveal>

        <Reveal as="article" delay={60} className="card p-6">
          <h3 className="font-display text-lg text-ink">{ai.tiers.title}</h3>
          <p className="mt-1.5 text-sm text-ink-dim">{ai.tiers.sub}</p>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr>
                <th scope="col" className={`${head} text-start`}>
                  {ai.tiers.tier}
                </th>
                <th scope="col" className={`${head} text-end`}>
                  {ai.tiers.credits}
                </th>
                <th scope="col" className={`${head} text-end`}>
                  {ai.tiers.price}
                </th>
              </tr>
            </thead>
            <tbody>
              {AI_TIERS.map((tier) => (
                <tr key={tier.id}>
                  <th scope="row" className={`${cell} text-start font-semibold text-ink`}>
                    {ai.tiers.names.find((t) => t.id === tier.id)?.name ?? tier.id}
                  </th>
                  <td className={`${cell} text-end text-ink-2`}>
                    {formatNumber(locale, tier.credits)}
                  </td>
                  <td className={`${cell} text-end font-semibold whitespace-nowrap text-ink`}>
                    {money(tier.price[currency])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        <Reveal as="article" delay={120} className="card p-6">
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
