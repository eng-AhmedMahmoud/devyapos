"use client";

import { useState, useSyncExternalStore } from "react";
import { useLocale } from "next-intl";
import type { SiteContent } from "@/content/types";
import {
  ACCOUNTING_EXTRAS,
  EINVOICING_SYSTEM,
  accountingPlan,
  bestAccountingOffer,
} from "@/lib/accounting-plans";
import { track } from "@/lib/analytics";
import { whatsappLink } from "@/lib/brand";
import { formatCairoDate, formatNumber } from "@/lib/format";
import {
  DEFAULT_CURRENCY,
  PLAN_CURRENCIES,
  discounted,
  offerPercent,
  openOffers,
  type BillingInterval,
  type PlanCurrency,
} from "@/lib/plans";
import AccountingAi from "./AccountingAi";
import { Check } from "./icons";
import PricingToggle from "./PricingToggle";
import Reveal from "./Reveal";
import { Container, SectionHead } from "./Section";
import WhatsappLink from "./WhatsappLink";

/**
 * The words this block shares with the POS price list (`pricing`): the two
 * switches, the currency units and the offers. Both products run the same
 * offers on the same terms, so they are worded once.
 */
export type SharedPricingCopy = Pick<
  SiteContent["pricing"],
  | "billing"
  | "monthly"
  | "yearly"
  | "save"
  | "currencyLabel"
  | "currencyNames"
  | "currencies"
  | "per"
  | "perYear"
  | "offers"
>;

/**
 * The clock the offers are judged by, read once and kept so every render
 * agrees — the same rule as `components/Pricing.tsx`.
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
 * Accounting plans, on /accounting-trial under the form.
 *
 * Four cards, as the product sells them since 2026-10-27 (bohub-pos
 * `accounting-app/lib/plans.ts`, mirrored in `lib/accounting-plans.ts`): Free,
 * a taster a trial drops to when it ends; Starter, Business and Professional,
 * priced per company; Enterprise, quoted, as the line under the grid. Laid out
 * like the POS price list on /pricing — a billing switch and a currency
 * switch, the open offers in a band above the grid, the trial on every paid
 * card — so the two products read as one family.
 *
 * Every paid plan has every feature, so a card lists the e-invoicing line and
 * the caps, never a feature checklist that would suggest a tier is missing
 * one. The e-invoicing line names the system the chosen price list's country
 * files with (`EINVOICING_SYSTEM`). Every button scrolls to the form above: on
 * this page the trial is the only action, and the plan is chosen when the
 * trial ends.
 *
 * Whether an offer is open is decided in the browser from the dates in
 * `lib/plans.ts`; the server renders with the build's clock (`builtAt`) and
 * hydration reads the same value, so the HTML matches.
 */
export default function AccountingPricing({
  formId,
  copy: p,
  shared,
  builtAt,
  whatsapp,
}: {
  formId: string;
  /** `accountingTrial.pricing`, passed down by the server page. */
  copy: SiteContent["accountingTrial"]["pricing"];
  /** The POS price list's switch and offer words, passed down by the server page. */
  shared: SharedPricingCopy;
  /** `Date.now()` when the server page was rendered. */
  builtAt: number;
  /** The WhatsApp link's label: `accountingTrial.outcomes.whatsapp`. */
  whatsapp: string;
}) {
  const locale = useLocale();
  const [interval, setBilling] = useState<BillingInterval>("monthly");
  const [currency, setCurrency] = useState<PlanCurrency>(
    DEFAULT_CURRENCY[locale === "ar" ? "ar" : "en"],
  );
  const now = useSyncExternalStore(subscribe, clientNow, () => builtAt);
  const open = openOffers(now);
  const yearly = interval === "yearly";
  const unit = shared.currencies[currency];
  const system = EINVOICING_SYSTEM[currency];
  const money = (value: number) => `${formatNumber(locale, value)} ${unit}`;
  const offerName = (code: string) =>
    shared.offers.items.find((item) => item.code === code)?.name ?? code;

  return (
    <section id="plans" className="band-cream py-16 sm:py-20">
      <Container>
        <SectionHead kicker={p.eyebrow} title={p.title} sub={p.sub} />

        <Reveal delay={60}>
          <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-4">
            <PricingToggle<BillingInterval>
              label={shared.billing}
              options={[
                { value: "monthly", label: shared.monthly },
                { value: "yearly", label: shared.yearly, hint: shared.save },
              ]}
              value={interval}
              onChange={setBilling}
            />
            <PricingToggle<PlanCurrency>
              label={shared.currencyLabel}
              options={PLAN_CURRENCIES.map((code) => ({
                value: code,
                label: shared.currencyNames[code],
              }))}
              value={currency}
              onChange={setCurrency}
            />
          </div>
        </Reveal>

        {open.length > 0 ? (
          <aside
            aria-label={shared.offers.label}
            className="mt-8 flex flex-col gap-3 border-y border-line-strong bg-surface px-5 py-4"
          >
            {open.map((offer) => {
              const words = shared.offers.items.find((item) => item.code === offer.code);
              if (!words) return null;
              return (
                <p key={offer.code} className="text-sm leading-relaxed text-ink">
                  <span className="me-3 inline-block bg-saffron px-2 py-0.5 text-xs font-bold text-on-saffron">
                    {words.name}
                  </span>
                  {words.body}{" "}
                  {fill(shared.offers.ends, { date: formatCairoDate(locale, offer.endsAt) })}
                </p>
              );
            })}
            <p className="text-xs leading-relaxed text-ink-dim">{shared.offers.how}</p>
          </aside>
        ) : null}

        <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {p.plans.map((plan, i) => {
            const numbers = accountingPlan(plan.id);
            const pair = numbers.prices?.[currency] ?? null;
            const price = pair ? (yearly ? pair[1] : pair[0]) : 0;
            const paid = pair !== null && pair[0] > 0;
            const offer = paid ? bestAccountingOffer(plan.id, interval, now) : null;
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
                    <span className="font-display text-[2.5rem] leading-none text-ink">
                      {formatNumber(locale, price)}
                    </span>
                    <span className="pb-1 text-sm text-ink-dim">
                      {unit}
                      {yearly ? shared.perYear : shared.per}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-dim">
                    {paid ? `${p.perCompany} · ${p.vat[currency]}` : p.freeNote}
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
                        ? fill(p.billedYearly, { saved: money(pair[0] * 12 - pair[1]) })
                        : fill(p.orYearly, { amount: money(pair[1]) })}
                    </p>
                  ) : null}

                  {/* The first period under the open offer worth most on this
                      interval — the product's own rule (`bestOffer`). */}
                  {offer ? (
                    <p className="mt-3 flex items-start gap-2 bg-brand-soft px-3 py-2.5 text-xs leading-relaxed font-bold text-ink">
                      <span className="pearl mt-1 shrink-0" aria-hidden="true" />
                      <span>
                        {fill(yearly ? shared.offers.firstYear : shared.offers.firstMonths, {
                          name: offerName(offer.code),
                          percent: formatNumber(locale, percent),
                          amount: money(discounted(price, percent)),
                          months: formatNumber(locale, offer.monthlyCycles),
                        })}
                      </span>
                    </p>
                  ) : null}

                  {paid && numbers.trialDays > 0 ? (
                    <p className="mt-3 text-sm font-semibold text-ink">{p.trial}</p>
                  ) : null}

                  <ul className="mt-6 flex flex-1 flex-col gap-2.5 border-t border-line pt-5">
                    {plan.einvoicing ? (
                      <li className="flex items-start gap-2.5">
                        <Check width={16} height={16} className="mt-0.5 shrink-0 text-mint" />
                        <span className="text-sm font-semibold text-ink">
                          {plan.einvoicing[system]}
                        </span>
                      </li>
                    ) : null}
                    {plan.limits.map((limit) => (
                      <li key={limit} className="flex items-start gap-2.5">
                        <Check width={16} height={16} className="mt-0.5 shrink-0 text-mint" />
                        <span className="text-sm text-ink-2">{limit}</span>
                      </li>
                    ))}
                    {paid ? (
                      <li className="flex items-start gap-2.5">
                        <Check width={16} height={16} className="mt-0.5 shrink-0 text-mint" />
                        <span className="text-sm text-ink-2">{p.unlimited}</span>
                      </li>
                    ) : null}
                  </ul>

                  {plan.excludes ? (
                    <p className="mt-5 text-xs leading-relaxed text-ink-dim">{plan.excludes}</p>
                  ) : null}

                  <a
                    href={`#${formId}`}
                    onClick={() =>
                      // The pricing CTA event, told apart from the POS page's
                      // by `product`; `plan` is the stable id, as there.
                      track("pricing_cta_click", {
                        locale,
                        product: "accounting",
                        plan: plan.id,
                        planName: plan.name,
                        billing: interval,
                        currency,
                      })
                    }
                    className={`btn mt-7 w-full ${plan.featured ? "btn-primary" : "btn-ghost"}`}
                  >
                    {p.cta}
                  </a>
                </article>
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={140}>
          <div className="mt-8 flex flex-col gap-4">
            {/* Rounded, not a full pill: this line wraps to three rows at 320px. */}
            <p className="inline-flex w-fit max-w-full items-start gap-2 rounded-2xl bg-brand-soft px-4 py-2.5 text-sm font-bold text-brand">
              <span className="pearl mt-1.5 shrink-0" aria-hidden="true" />
              <span>{p.einvoicingIncluded[system]}</span>
            </p>

            <div className="grid gap-4 lg:grid-cols-2 lg:items-center">
              <div className="card-flat p-5">
                <h3 className="font-display text-base text-ink">{p.withPos.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-dim">{p.withPos.body}</p>
              </div>

              <div className="flex max-w-2xl flex-col gap-2 text-xs leading-relaxed text-ink-dim">
                <p>{p.noSetupFee}</p>
                <p>
                  {fill(p.extras, {
                    user: money(ACCOUNTING_EXTRAS.user[currency]),
                    branch: money(ACCOUNTING_EXTRAS.branch[currency]),
                  })}
                </p>
                <p>
                  {p.enterprise}{" "}
                  <WhatsappLink
                    href={whatsappLink(p.enterpriseWa, "quote")}
                    place="accounting_pricing"
                    className="font-bold text-brand underline-offset-4 hover:underline"
                  >
                    {whatsapp}
                  </WhatsappLink>
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <AccountingAi
          copy={p.ai}
          plans={p.plans}
          shared={shared}
          locale={locale}
          currency={currency}
          onCurrency={setCurrency}
        />
      </Container>
    </section>
  );
}
