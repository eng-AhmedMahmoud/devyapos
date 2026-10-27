"use client";

import { useState, useSyncExternalStore } from "react";
import { useLocale } from "next-intl";
import type { SiteContent } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { formatCairoDate, formatNumber } from "@/lib/format";
import {
  DEFAULT_CURRENCY,
  PLAN_CURRENCIES,
  bestOffer,
  discounted,
  offerPercent,
  openOffers,
  planNumbers,
  type BillingInterval,
  type PlanCurrency,
} from "@/lib/plans";
import { Check } from "./icons";
import PricingAi from "./PricingAi";
import PricingToggle from "./PricingToggle";
import Reveal from "./Reveal";
import { Container, SectionHead } from "./Section";

/** What the plan grid reads; the segments, the add-ons and the market anchor render elsewhere. */
export type PricingCopy = Omit<SiteContent["pricing"], "segments" | "marketAnchor" | "compareLink">;

/**
 * The clock the offers are judged by. Nothing to subscribe to: it is read
 * once, the first time the page asks, and kept, so every render agrees.
 */
const subscribe = () => () => {};
let firstRead: number | null = null;
const clientNow = () => (firstRead ??= Date.now());

/** `{name}`-style tokens; an unknown token is left as typed. */
function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? values[key] : match,
  );
}

/**
 * Pricing.
 *
 * Four plans, as the product sells them since 2026-10-27 (bohub-pos
 * `packages/shared/src/plans.ts`, mirrored in `lib/plans.ts`): Free, a taster
 * with caps; Counter and Dining room, priced per branch; Group, quoted. Laid
 * out the way Moving Stores' pricing page is — a billing switch and a
 * currency switch, the open offers in a band above the grid, the trial on
 * every paid card — in this site's own tokens and components.
 *
 * A year is ten months, so the yearly figure is the amount charged once a
 * year, with the two months it saves underneath; a monthly figure says what
 * the year would cost. An open offer adds the first period's discounted
 * figure under the price, in the chosen currency.
 *
 * The page is static, so whether an offer is open is decided here, in the
 * browser, from the dates in `lib/plans.ts`. The server renders with the
 * build's clock (`builtAt`, from the server page) and hydration reads the
 * same value, so the HTML matches; the browser's clock then takes over. A page
 * built during an offer and read after it ends drops the band on load
 * instead of selling a price nobody will honour.
 */
export default function Pricing({
  copy,
  compact = false,
  builtAt,
  withAi = false,
}: {
  /** `pricing` from the page's content tree, passed down by the server page. */
  copy: PricingCopy;
  compact?: boolean;
  /** `Date.now()` when the server page was rendered. */
  builtAt: number;
  /** Render the AI credits block under the grid (/pricing). */
  withAi?: boolean;
}) {
  const locale = useLocale();
  const [interval, setBilling] = useState<BillingInterval>("monthly");
  const [currency, setCurrency] = useState<PlanCurrency>(
    DEFAULT_CURRENCY[locale === "ar" ? "ar" : "en"],
  );
  const now = useSyncExternalStore(subscribe, clientNow, () => builtAt);
  const open = openOffers(now);
  const yearly = interval === "yearly";
  const unit = copy.currencies[currency];
  const money = (value: number) => `${formatNumber(locale, value)} ${unit}`;
  const offerName = (code: string) =>
    copy.offers.items.find((item) => item.code === code)?.name ?? code;

  const currencyToggle = (
    <PricingToggle<PlanCurrency>
      label={copy.currencyLabel}
      options={PLAN_CURRENCIES.map((code) => ({ value: code, label: copy.currencyNames[code] }))}
      value={currency}
      onChange={setCurrency}
    />
  );

  return (
    <section id="pricing" className={compact ? "py-2" : "bg-bg py-20 sm:py-24"}>
      <Container>
        {!compact ? (
          <SectionHead kicker={copy.eyebrow} title={copy.title} sub={copy.sub} />
        ) : null}

        <Reveal delay={60}>
          <div
            className={`flex flex-wrap items-end gap-x-8 gap-y-4 ${
              compact ? "justify-center" : "mt-8"
            }`}
          >
            <PricingToggle<BillingInterval>
              label={copy.billing}
              options={[
                { value: "monthly", label: copy.monthly },
                { value: "yearly", label: copy.yearly, hint: copy.save },
              ]}
              value={interval}
              onChange={setBilling}
            />
            {currencyToggle}
          </div>
        </Reveal>

        {open.length > 0 ? (
          <aside
            aria-label={copy.offers.label}
            className="mt-8 flex flex-col gap-3 border-y border-line-strong bg-surface px-5 py-4"
          >
            {open.map((offer) => {
              const words = copy.offers.items.find((item) => item.code === offer.code);
              if (!words) return null;
              return (
                <p key={offer.code} className="text-sm leading-relaxed text-ink">
                  <span className="me-3 inline-block bg-saffron px-2 py-0.5 text-xs font-bold text-on-saffron">
                    {words.name}
                  </span>
                  {words.body}{" "}
                  {fill(copy.offers.ends, { date: formatCairoDate(locale, offer.endsAt) })}
                </p>
              );
            })}
            <p className="text-xs leading-relaxed text-ink-dim">{copy.offers.how}</p>
          </aside>
        ) : null}

        <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {copy.plans.map((plan, i) => {
            const numbers = planNumbers(plan.id);
            const pair = numbers.prices?.[currency] ?? null;
            const price = pair ? (yearly ? pair[1] : pair[0]) : null;
            const paid = pair !== null && pair[0] > 0;
            const offer = paid ? bestOffer(plan.id, interval, now) : null;
            const percent = offer ? offerPercent(offer, interval) : 0;

            return (
              <Reveal as="li" key={plan.id} delay={(i % 4) * 60}>
                <article
                  className={`card relative flex h-full flex-col p-6 ${
                    plan.featured ? "border-brand shadow-[var(--shadow-lift)]" : ""
                  }`}
                >
                  {plan.badge ? (
                    <span className="absolute -top-3 inline-flex rounded-full bg-brand px-3 py-1 text-xs font-bold text-on-brand">
                      {plan.badge}
                    </span>
                  ) : null}

                  <h3 className="font-display text-lg text-ink">{plan.name}</h3>
                  <p className="mt-1.5 text-sm text-ink-dim">{plan.tagline}</p>

                  <div className="mt-6 flex flex-wrap items-end gap-x-2 gap-y-1">
                    {price === null ? (
                      <span className="font-display text-3xl text-ink">{plan.priceLabel}</span>
                    ) : (
                      <>
                        <span className="font-display text-[2.5rem] leading-none text-ink">
                          {formatNumber(locale, price)}
                        </span>
                        <span className="pb-1 text-sm text-ink-dim">
                          {unit}
                          {yearly ? copy.perYear : copy.per}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-ink-dim">
                    {price === null ? copy.quotedNote : paid ? copy.perBranch : copy.freeNote}
                  </p>

                  {/* What the other interval comes to, so the saving is in
                      view whichever one is picked. */}
                  {paid && pair ? (
                    <p
                      className={`mt-3 text-xs leading-relaxed ${
                        yearly ? "text-mint" : "text-ink-2"
                      }`}
                    >
                      {yearly
                        ? fill(copy.billedYearly, { saved: money(pair[0] * 12 - pair[1]) })
                        : fill(copy.orYearly, { amount: money(pair[1]) })}
                    </p>
                  ) : null}

                  {/* The first period under the open offer worth most on
                      this interval — the product's own rule (`bestOffer`). */}
                  {offer && price !== null ? (
                    <p className="mt-3 flex items-start gap-2 bg-brand-soft px-3 py-2.5 text-xs leading-relaxed font-bold text-ink">
                      <span className="pearl mt-1 shrink-0" aria-hidden="true" />
                      <span>
                        {fill(yearly ? copy.offers.firstYear : copy.offers.firstMonths, {
                          name: offerName(offer.code),
                          percent: formatNumber(locale, percent),
                          amount: money(discounted(price, percent)),
                          months: formatNumber(locale, offer.monthlyCycles),
                        })}
                      </span>
                    </p>
                  ) : null}

                  {paid && numbers.trialDays > 0 ? (
                    <p className="mt-3 text-sm font-semibold text-ink">{copy.trial}</p>
                  ) : null}

                  <ul className="mt-6 flex flex-col border-t border-line">
                    {plan.limits.map((limit) => (
                      <li
                        key={limit}
                        className="flex items-start gap-2.5 border-b border-line py-2.5 text-sm font-semibold text-ink"
                      >
                        <span className="pearl mt-1.5" aria-hidden="true" />
                        <span>{limit}</span>
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check
                          width={16}
                          height={16}
                          className="sl-tick mt-0.5 shrink-0 text-mint"
                        />
                        <span className="text-sm text-ink-2">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.excludes ? (
                    <p className="mt-5 text-xs leading-relaxed text-ink-dim">{plan.excludes}</p>
                  ) : null}

                  <Link
                    href={{ pathname: "/contact", query: { plan: plan.id } }}
                    onClick={() =>
                      // `plan` is the stable id, not the label: the Arabic
                      // card says "الكاونتر" and the English one "Counter", and
                      // one funnel split in two by locale answers nothing.
                      // The rendered name rides along for readability.
                      track("pricing_cta_click", {
                        locale,
                        plan: plan.id,
                        planName: plan.name,
                        billing: interval,
                        currency,
                      })
                    }
                    className={`btn mt-7 w-full ${plan.featured ? "btn-primary" : "btn-ghost"}`}
                  >
                    {plan.cta}
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={140}>
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-ink-dim">{copy.note}</p>
        </Reveal>

        {withAi ? (
          <PricingAi
            copy={copy}
            plans={copy.plans}
            locale={locale}
            currency={currency}
            onCurrency={setCurrency}
          />
        ) : null}
      </Container>
    </section>
  );
}
