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
 * The incumbent argues retention in the abstract. A restaurant owner who drags
 * a slider and watches six figures of annual commission appear has done the
 * arguing themselves, and the subscription price stops being a cost and starts
 * being a rounding error against it. Every assumption is printed under the
 * result so the number survives scrutiny.
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
    <section id="roi" className="dot-grid-dark bg-dark py-20 sm:py-24">
      <Container>
        <SectionHead
          eyebrow={c.roi.eyebrow}
          title={c.roi.title}
          sub={c.roi.sub}
          tone="dark"
        />

        <Reveal delay={100}>
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            {/* Inputs */}
            <div className="card-dark flex flex-col gap-6 p-6 sm:p-8">
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

            {/* Results */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-brand/40 bg-brand/10 p-6">
                <p className="text-sm text-dark-ink-dim">{c.roi.results.paid}</p>
                <p className="font-display mt-1 text-4xl font-bold text-brand-300">
                  {formatEgp(locale, result.paid)}{" "}
                  <span className="text-xl">{c.pricing.currency}</span>
                </p>
              </div>

              <div className="card-dark grid gap-4 p-6 sm:grid-cols-2">
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
              </div>

              <p className="text-xs leading-relaxed text-dark-ink-dim">
                {c.roi.assumption}
              </p>
              <p className="text-xs text-dark-ink-dim opacity-70">{c.roi.note}</p>

              <Link
                href="/contact"
                className="btn btn-on-dark mt-auto self-start"
              >
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
        <label htmlFor={id} className="text-sm font-medium text-dark-ink">
          {label}
        </label>
        <span className="font-display text-sm font-bold text-brand-300">
          {formatNumber(locale, value)}{" "}
          <span className="font-normal text-dark-ink-dim">{hint}</span>
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
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-dark-line accent-[var(--brand)]"
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
      <p className="text-xs text-dark-ink-dim">{label}</p>
      <p
        className={`font-display mt-1 text-lg font-bold ${
          tone === "good"
            ? "text-emerald"
            : tone === "bad"
              ? "text-rose"
              : "text-dark-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
