"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import type { SiteContent } from "@/content/types";
import { track } from "@/lib/analytics";
import { whatsappLink } from "@/lib/brand";
import { formatNumber } from "@/lib/format";
import { TRIAL_COUNTRIES, type TrialCountry } from "@/lib/trial";
import { Check } from "./icons";
import Reveal from "./Reveal";
import { Container, SectionHead } from "./Section";
import WhatsappLink from "./WhatsappLink";

/** A yearly plan charges ten months: the two free months the toggle promises. */
const MONTHS_CHARGED = 10;
const MONTHS_FREE = 2;

/**
 * Accounting plans, on /accounting-trial under the form.
 *
 * Two switches, for the two things that change the number. The country picks
 * the price list (EGP or SAR, with each country's own VAT rate and its own
 * e-invoicing system), using the same two countries as the trial form. The
 * billing switch shows a yearly price as the amount charged once a year, ten
 * months, rather than as a monthly figure with decimals in it.
 *
 * Every plan has every feature, so a card lists the e-invoicing line and the
 * limits, never a feature checklist that would suggest a tier is missing one.
 * The CTA scrolls to the form above: on this page the trial is the only
 * action, and the plan is chosen when the trial ends.
 *
 * The prices are decided in bohub-pos
 * `docs/decisions/2026-10-13-accounting-pricing.md`. Change them there first.
 */
export default function AccountingPricing({
  formId,
  copy: p,
  countries,
  whatsapp,
}: {
  formId: string;
  /** `accountingTrial.pricing`, passed down by the server page. */
  copy: SiteContent["accountingTrial"]["pricing"];
  /** The country names the trial form uses: `accountingTrial.form.countries`. */
  countries: SiteContent["accountingTrial"]["form"]["countries"];
  /** The WhatsApp link's label: `accountingTrial.outcomes.whatsapp`. */
  whatsapp: string;
}) {
  const locale = useLocale();
  const [country, setCountry] = useState<TrialCountry>("EG");
  const [yearly, setYearly] = useState(false);

  const money = (value: number) => `${formatNumber(locale, value)} ${p.currency[country]}`;

  /** `{price}`, `{saved}`, `{user}`, `{branch}`: the only tokens in this block. */
  const fill = (template: string, values: Record<string, string>) =>
    template.replace(/\{(price|saved|user|branch)\}/g, (match, key: string) =>
      key in values ? values[key] : match,
    );

  const toggle = (active: boolean) =>
    `rounded-full px-3 py-2 text-sm font-bold transition-colors sm:px-4 ${
      active ? "bg-surface text-ink shadow-[var(--shadow-warm)]" : "text-ink-dim"
    }`;

  return (
    <section id="plans" className="band-cream py-16 sm:py-20">
      <Container>
        <SectionHead kicker={p.eyebrow} title={p.title} sub={p.sub} />

        <Reveal delay={60}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label={p.countryLabel}
              className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1"
            >
              {TRIAL_COUNTRIES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setCountry(code)}
                  aria-pressed={country === code}
                  className={toggle(country === code)}
                >
                  {countries[code]}
                </button>
              ))}
            </div>

            <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1">
              <button
                type="button"
                onClick={() => setYearly(false)}
                aria-pressed={!yearly}
                className={toggle(!yearly)}
              >
                {p.monthly}
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                aria-pressed={yearly}
                className={`flex items-center gap-2 ${toggle(yearly)}`}
              >
                {p.yearly}
                <span className="whitespace-nowrap rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand">
                  {p.save}
                </span>
              </button>
            </div>
          </div>
        </Reveal>

        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {p.plans.map((plan, i) => {
            const monthly = plan.price[country];
            const shown = yearly ? monthly * MONTHS_CHARGED : monthly;

            return (
              <Reveal as="li" key={plan.id} delay={(i % 3) * 60}>
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
                      {formatNumber(locale, shown)}
                    </span>
                    <span className="pb-1 text-sm text-ink-dim">
                      {p.currency[country]}
                      {yearly ? p.perYear : p.perMonth}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-dim">{p.vat[country]}</p>

                  {yearly ? (
                    <p className="mt-4 rounded-xl border border-line bg-surface-2 px-3.5 py-3 text-xs leading-relaxed text-mint">
                      {fill(p.yearlySaving, { saved: money(monthly * MONTHS_FREE) })}
                    </p>
                  ) : null}

                  <ul className="mt-6 flex flex-1 flex-col gap-2.5 border-t border-line pt-5">
                    <li className="flex items-start gap-2.5">
                      <Check width={16} height={16} className="mt-0.5 shrink-0 text-mint" />
                      <span className="text-sm font-semibold text-ink">
                        {plan.einvoicing[country]}
                      </span>
                    </li>
                    {plan.limits.map((limit) => (
                      <li key={limit} className="flex items-start gap-2.5">
                        <Check width={16} height={16} className="mt-0.5 shrink-0 text-mint" />
                        <span className="text-sm text-ink-2">{limit}</span>
                      </li>
                    ))}
                  </ul>

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
                        country,
                        billing: yearly ? "yearly" : "monthly",
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
              <span>{p.einvoicingIncluded[country]}</span>
            </p>

            <div className="grid gap-4 lg:grid-cols-2 lg:items-center">
              <div className="card-flat p-5">
                <h3 className="font-display text-base text-ink">{p.withPos.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-dim">
                  {fill(p.withPos.body, { price: money(p.withPos.price[country]) })}
                </p>
              </div>

              <div className="flex max-w-2xl flex-col gap-2 text-xs leading-relaxed text-ink-dim">
                <p>{p.noSetupFee}</p>
                <p>
                  {fill(p.extras, {
                    user: money(p.extrasPrice.user[country]),
                    branch: money(p.extrasPrice.branch[country]),
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
      </Container>
    </section>
  );
}
