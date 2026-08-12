"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { Arrow } from "@/components/icons";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";
import { formatEgp, formatNumber } from "@/lib/format";

/** Growth plan, EGP per branch per month — the figure the payback is costed at. */
const PLAN_PRICE = 399;
/** Deliberately conservative share of aggregator orders assumed to move over. */
const SHIFT_RATE = 0.3;

/**
 * Commission calculator — the strongest conversion lever on this page.
 *
 * An owner who drags a slider and watches six figures of annual commission
 * appear has made the argument themselves, and the subscription stops being a
 * cost and becomes a rounding error against it. Every assumption is printed
 * under the result so the number survives scrutiny.
 */
export default function RoiCalculator() {
  const locale = useLocale();
  const c = getContent(locale);

  const [orders, setOrders] = useState(600);
  const [aov, setAov] = useState(180);
  const [commission, setCommission] = useState(22);
  const [branches, setBranches] = useState(2);

  const result = useMemo(() => {
    const paid = orders * aov * (commission / 100) * 12;
    const recovered = paid * SHIFT_RATE;
    const cost = PLAN_PRICE * 12 * branches;
    const net = recovered - cost;
    // Days of recovered commission needed to cover a year of subscription.
    const paybackDays = recovered > 0 ? Math.ceil(cost / (recovered / 365)) : 0;
    return { paid, recovered, cost, net, paybackDays };
  }, [orders, aov, commission, branches]);

  return (
    <section id="roi" className="bg-bg py-20 sm:py-24">
      <Container>
        <SectionHead kicker={c.roi.eyebrow} title={c.roi.title} sub={c.roi.sub} />

        <Reveal delay={100}>
          <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_1fr]">
            {/* Inputs */}
            <div className="card flex flex-col gap-6 p-6 sm:p-8">
              <Field
                label={c.roi.fields.orders}
                hint={c.roi.hints.orders}
                value={orders}
                onChange={setOrders}
                min={50}
                max={5000}
                step={50}
                locale={locale}
              />
              <Field
                label={c.roi.fields.aov}
                hint={c.roi.hints.aov}
                value={aov}
                onChange={setAov}
                min={50}
                max={800}
                step={10}
                locale={locale}
              />
              <Field
                label={c.roi.fields.commission}
                hint={c.roi.hints.commission}
                value={commission}
                onChange={setCommission}
                min={5}
                max={35}
                step={1}
                locale={locale}
              />
              <Field
                label={c.roi.fields.branches}
                hint={c.roi.hints.branches}
                value={branches}
                onChange={setBranches}
                min={1}
                max={30}
                step={1}
                locale={locale}
              />
            </div>

            {/* Results — the headline number sits on the espresso card so it
                carries the weight of the section on its own. */}
            <div className="flex flex-col gap-4">
              <div className="band-espresso pearl-grid-dark rounded-3xl p-6 sm:p-8">
                <p className="text-sm text-on-espresso-dim">
                  {c.roi.results.paid}
                </p>
                <p className="font-display mt-2 text-4xl text-gold sm:text-5xl">
                  {formatEgp(locale, result.paid)}{" "}
                  <span className="text-xl">{c.pricing.currency}</span>
                </p>
                <dl className="mt-6 grid gap-4 border-t border-espresso-line pt-5 sm:grid-cols-2">
                  <Metric
                    label={c.roi.results.recovered}
                    value={`${formatEgp(locale, result.recovered)} ${c.pricing.currency}`}
                  />
                  <Metric
                    label={c.roi.results.cost}
                    value={`${formatEgp(locale, result.cost)} ${c.pricing.currency}`}
                  />
                  <Metric
                    label={c.roi.results.net}
                    value={`${formatEgp(locale, result.net)} ${c.pricing.currency}`}
                    tone={result.net >= 0 ? "good" : "bad"}
                  />
                  <Metric
                    label={c.roi.results.payback}
                    value={
                      result.paybackDays > 0
                        ? `${formatNumber(locale, result.paybackDays)} ${c.roi.results.paybackUnit}`
                        : "—"
                    }
                  />
                </dl>
              </div>

              <p className="text-xs leading-relaxed text-ink-dim">
                {c.roi.assumption}
              </p>
              <p className="text-xs text-ink-dim opacity-75">{c.roi.note}</p>

              <Link href="/contact" className="btn btn-primary mt-auto self-start">
                {c.roi.cta}
                <Arrow width={16} height={16} className="flip-rtl" />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step,
  locale,
}: {
  label: string;
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
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
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
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "bad";
}) {
  return (
    <div>
      <dt className="text-xs text-on-espresso-dim">{label}</dt>
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
