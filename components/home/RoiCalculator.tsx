"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import type { SiteContent } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { Arrow } from "@/components/icons";
import InfoTip from "@/components/InfoTip";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";
import { formatEgp, formatNumber } from "@/lib/format";
import { planPrice } from "@/lib/plans";

/**
 * Counter, EGP per branch per month — the figure the payback is costed at,
 * read from the plan catalogue so the calculator cannot keep an old price.
 */
const PLAN_PRICE = planPrice("counter", "EGP", "monthly") ?? 0;
/** Deliberately conservative share of aggregator orders assumed to move over. */
const SHIFT_RATE = 0.3;

/**
 * Commission rates an Egyptian restaurant actually sees, rather than an open
 * slider. Reported ranges for the aggregators operating here sit around 15–25%,
 * varying with volume, location and whether the listing is exclusive.
 *
 * This used to be a 5–35 slider, which let a visitor land on 5% — a rate nobody
 * in this market is offered — and watch the tool report a LOSS. A wrong answer
 * that argues against the product is worse than no tool, so the input now only
 * offers rates that exist.
 */
const COMMISSION_RATES = [15, 20, 25] as const;

/**
 * Commission calculator.
 *
 * An owner who sets three numbers and watches a year of commission appear has
 * made the argument themselves. Every assumption is printed under the result,
 * and each input and output carries a tooltip, so the number survives scrutiny
 * instead of looking like marketing arithmetic.
 *
 * Two things were wrong with the earlier version and are fixed here:
 *
 *  1. `orders` was TOTAL monthly orders while cost scaled per branch, so adding
 *     a branch raised the cost and never the recovery — the model punished
 *     exactly the multi-branch chains it was meant to appeal to. Orders are now
 *     entered PER BRANCH and multiplied out, which is also how an owner thinks
 *     about their own numbers.
 *  2. It had four sliders including a commission rate that could be set to
 *     values this market does not offer. Now three inputs, and the rate is a
 *     choice between real ones.
 */
export default function RoiCalculator({
  copy,
  currency,
}: {
  /** `roi`, passed down by the server page. */
  copy: SiteContent["roi"];
  /** `pricing.currencies.EGP`, the unit after every figure: the calculator is in pounds. */
  currency: string;
}) {
  const locale = useLocale();

  const [ordersPerBranch, setOrdersPerBranch] = useState(400);
  const [aov, setAov] = useState(180);
  const [branches, setBranches] = useState(2);
  const [commission, setCommission] = useState<number>(20);

  const result = useMemo(() => {
    const monthlyOrders = ordersPerBranch * branches;
    const paid = monthlyOrders * aov * (commission / 100) * 12;
    const recovered = paid * SHIFT_RATE;
    const cost = PLAN_PRICE * 12 * branches;
    const net = recovered - cost;
    // Days of recovered commission needed to cover a year of subscription.
    // Only meaningful while the recovery actually outruns the cost.
    const paybackDays =
      net > 0 ? Math.max(1, Math.ceil(cost / (recovered / 365))) : null;
    return { monthlyOrders, paid, recovered, cost, net, paybackDays };
  }, [ordersPerBranch, aov, branches, commission]);

  return (
    <section id="roi" className="bg-bg py-20 sm:py-24">
      <Container>
        <SectionHead kicker={copy.eyebrow} title={copy.title} sub={copy.sub} />

        <Reveal delay={100}>
          <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_1fr]">
            {/* Inputs */}
            <div className="card flex flex-col gap-7 p-6 sm:p-8">
              <Slider
                label={copy.fields.orders}
                tip={copy.tips.orders}
                hint={copy.hints.orders}
                value={ordersPerBranch}
                onChange={setOrdersPerBranch}
                min={100}
                max={3000}
                step={50}
                locale={locale}
              />
              <Slider
                label={copy.fields.aov}
                tip={copy.tips.aov}
                hint={copy.hints.aov}
                value={aov}
                onChange={setAov}
                min={80}
                max={600}
                step={10}
                locale={locale}
              />
              <Slider
                label={copy.fields.branches}
                tip={copy.tips.branches}
                hint={copy.hints.branches}
                value={branches}
                onChange={setBranches}
                min={1}
                max={30}
                step={1}
                locale={locale}
              />

              {/* Rate is a choice between real rates, not a free slider. */}
              <fieldset className="flex flex-col gap-2">
                <legend className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  {copy.fields.commission}
                  <InfoTip
                    label={copy.fields.commission}
                    text={copy.tips.commission}
                  />
                </legend>
                <div className="mt-1 flex gap-2">
                  {COMMISSION_RATES.map((rate) => {
                    const active = rate === commission;
                    return (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setCommission(rate)}
                        aria-pressed={active}
                        className={`
                          flex-1 rounded-xl border px-3 py-2 text-sm font-semibold
                          transition-colors
                          ${
                            active
                              ? "border-brand bg-brand text-on-brand"
                              : "border-line text-ink-dim hover:border-brand hover:text-brand"
                          }
                        `}
                      >
                        {formatNumber(locale, rate)}%
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-ink-dim">{copy.rateNote}</p>
              </fieldset>

              {/* Restates the inputs as one sentence, so the visitor can see
                  what the tool actually believes about their restaurant. */}
              <p className="border-t border-line-soft pt-4 text-xs leading-relaxed text-ink-dim">
                {copy.summary.replace(
                  "{orders}",
                  formatNumber(locale, result.monthlyOrders),
                )}
              </p>
            </div>

            {/* Results — the headline number sits on the espresso card so it
                carries the weight of the section on its own. */}
            <div className="flex flex-col gap-4">
              <div className="band-espresso pearl-grid-dark rounded-3xl p-6 sm:p-8">
                <p className="flex items-center gap-1.5 text-sm text-on-espresso-dim">
                  {copy.results.paid}
                  <InfoTip label={copy.results.paid} text={copy.tips.paid} />
                </p>
                <p className="font-display mt-2 text-4xl text-gold sm:text-5xl">
                  {formatEgp(locale, result.paid)}{" "}
                  <span className="text-xl">{currency}</span>
                </p>
                <dl className="mt-6 grid gap-4 border-t border-espresso-line pt-5 sm:grid-cols-2">
                  <Metric
                    label={copy.results.recovered}
                    tip={copy.tips.recovered}
                    value={`${formatEgp(locale, result.recovered)} ${currency}`}
                  />
                  <Metric
                    label={copy.results.cost}
                    tip={copy.tips.cost}
                    value={`${formatEgp(locale, result.cost)} ${currency}`}
                  />
                  <Metric
                    label={copy.results.net}
                    tip={copy.tips.net}
                    value={`${formatEgp(locale, result.net)} ${currency}`}
                    tone={result.net >= 0 ? "good" : "bad"}
                  />
                  <Metric
                    label={copy.results.payback}
                    tip={copy.tips.payback}
                    /* No payback to quote when the recovery does not cover the
                       subscription — printing a day count there implied a
                       break-even that the same panel was denying. */
                    value={
                      result.paybackDays
                        ? `${formatNumber(locale, result.paybackDays)} ${copy.results.paybackUnit}`
                        : copy.results.paybackNone
                    }
                  />
                </dl>
              </div>

              <p className="text-xs leading-relaxed text-ink-dim">
                {copy.assumption}
              </p>
              <p className="text-xs text-ink-dim">{copy.note}</p>

              <Link href="/contact" className="btn btn-primary mt-auto self-start">
                {copy.cta}
                <Arrow width={16} height={16} className="flip-rtl" />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/**
 * One labelled range input with its value read out beside the label. Not the
 * forms' text `Field` (components/form/Field.tsx): a slider has no error to
 * wire and shows its value as it moves.
 */
function Slider({
  label,
  tip,
  hint,
  value,
  onChange,
  min,
  max,
  step,
  locale,
}: {
  label: string;
  tip: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  locale: string;
}) {
  const id = `roi-${label.replace(/\s+/g, "-")}`;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="flex items-center gap-1.5 text-sm font-semibold text-ink"
        >
          {label}
          <InfoTip label={label} text={tip} />
        </label>
        <span className="font-display text-base text-brand">
          {formatNumber(locale, value)}{" "}
          <span className="text-xs font-normal text-ink-dim">{hint}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-[var(--brand)]"
      />
    </div>
  );
}

function Metric({
  label,
  tip,
  value,
  tone = "neutral",
}: {
  label: string;
  tip: string;
  value: string;
  tone?: "neutral" | "good" | "bad";
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs text-on-espresso-dim">
        {label}
        <InfoTip label={label} text={tip} />
      </dt>
      <dd
        className={`font-display mt-1 text-lg ${
          tone === "good"
            ? "text-mint"
            : tone === "bad"
              ? "text-danger"
              : "text-on-espresso"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
