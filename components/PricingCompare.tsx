"use client";

import { useId } from "react";
import type { SiteContent } from "@/content/types";
import { formatNumber } from "@/lib/format";
import { planComparison, type CompareCell } from "@/lib/plan-compare";
import type { BillingInterval, PlanCurrency } from "@/lib/plans";
import { Check, Minus } from "./icons";
import Reveal from "./Reveal";
import { SectionHead } from "./Section";

/**
 * Compare plans, under the plan cards on /pricing (`#compare-plans`).
 *
 * The four plans in one table: the price and the caps, then the features.
 * Every cell is `planComparison` (lib/plan-compare.ts), read from
 * lib/plans.ts, so the table cannot say anything the cards and the product do
 * not. The price row follows the billing and currency switches above (one
 * state, owned by `Pricing`); like the rest of the plan grid it is in the
 * prerendered HTML, at the switches' starting values.
 *
 * A real table for assistive technology: a caption, a column head per plan, a
 * row head per line, and words behind every tick and dash. On a phone it
 * scrolls sideways inside its own focusable region, never the page, with the
 * row heads held at the inline start (the right, in Arabic). The cells use
 * separate borders, because a collapsed border stays behind when its sticky
 * cell moves.
 */
export default function PricingCompare({
  copy,
  plans,
  locale,
  currency,
  interval,
}: {
  /** `pricing` from the page's content tree. */
  copy: Pick<SiteContent["pricing"], "comparePlans" | "currencies" | "per" | "perYear">;
  plans: SiteContent["pricing"]["plans"];
  locale: string;
  currency: PlanCurrency;
  interval: BillingInterval;
}) {
  const words = copy.comparePlans;
  const captionId = useId();
  const groups = planComparison(currency, interval);

  // Each border names its side's colour, so a cell that takes two rules
  // (the sticky column's and a row's) never has two colours fighting.
  const sticky = "sticky start-0 z-10 border-e border-e-line bg-surface";
  const pad = "px-4 py-3";

  function show(value: CompareCell, quoted: string | undefined) {
    switch (value.kind) {
      case "price":
        return (
          <span className="whitespace-nowrap">
            <span className="font-semibold text-ink">
              {formatNumber(locale, value.amount)} {copy.currencies[currency]}
            </span>
            <span className="text-xs text-ink-dim">
              {interval === "yearly" ? copy.perYear : copy.per}
            </span>
          </span>
        );
      case "quoted":
        return <span className="font-semibold text-ink">{quoted}</span>;
      case "count":
        return formatNumber(locale, value.value);
      case "unlimited":
        return words.unlimited;
      case "paidBranches":
        return words.paidBranches;
      case "storage":
        return (
          <span className="whitespace-nowrap">
            {formatNumber(locale, value.value)} {value.unit === "gb" ? words.gb : words.mb}
          </span>
        );
      case "days":
        return words.days.replace("{days}", formatNumber(locale, value.value));
      case "included":
        return (
          <>
            <Check width={18} height={18} className="mx-auto text-mint" />
            <span className="sr-only">{words.included}</span>
          </>
        );
      case "excluded":
        return (
          <>
            <Minus width={18} height={18} className="mx-auto text-ink-dim" />
            <span className="sr-only">{words.excluded}</span>
          </>
        );
    }
  }

  return (
    <div id="compare-plans" className="mt-20 border-t border-line pt-14 sm:mt-24">
      <SectionHead kicker={words.eyebrow} title={words.title} sub={words.sub} />

      <Reveal delay={60}>
        <div
          role="region"
          aria-labelledby={captionId}
          tabIndex={0}
          className="card relative mt-8 overflow-x-auto overscroll-x-contain p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caramel"
        >
          <table className="w-full min-w-[43rem] border-separate border-spacing-0 text-sm">
            <caption id={captionId} className="sr-only">
              {words.caption}
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className={`${sticky} ${pad} min-w-36 border-b border-b-line text-start sm:min-w-52`}
                >
                  <span className="sr-only">{words.corner}</span>
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    scope="col"
                    className={`${pad} min-w-34 text-center font-display text-base text-ink ${
                      plan.featured
                        ? "border-b-2 border-b-brand bg-brand-soft"
                        : "border-b border-b-line"
                    }`}
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            {groups.map((group, g) => (
              <tbody key={group.id}>
                {group.rows.map((row, r) => {
                  // A heavier rule where the features start, so the two halves
                  // read apart without a heading row (a header cell with no
                  // data cells of its own is what axe refuses). The last row
                  // leaves its rule to the card's own border.
                  const last = g === groups.length - 1 && r === group.rows.length - 1;
                  const rules = `${g > 0 && r === 0 ? "border-t-2 border-t-line-strong" : ""} ${
                    last ? "" : "border-b border-b-line-soft"
                  }`;
                  return (
                    <tr key={row.id}>
                      <th
                        scope="row"
                        className={`${sticky} ${pad} ${rules} text-start font-semibold text-ink`}
                      >
                        {words.rows[row.id]}
                      </th>
                      {plans.map((plan) => (
                        <td
                          key={plan.id}
                          className={`${pad} ${rules} text-center text-ink-2 ${
                            plan.featured ? "bg-brand-soft/40" : ""
                          }`}
                        >
                          {show(row.cells[plan.id], plan.priceLabel)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            ))}
          </table>
        </div>
      </Reveal>

      <p className="mt-5 max-w-3xl text-xs leading-relaxed text-ink-dim">{words.note}</p>
    </div>
  );
}
