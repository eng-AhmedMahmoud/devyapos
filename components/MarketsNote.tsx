import type { SiteContent } from "@/content/types";

/**
 * Where the price lists apply, under the currency switch on /pricing, /about
 * and /accounting-trial.
 *
 * Only Egypt and Saudi Arabia are live, so EGP and SAR are the only lists a
 * visitor can pick (`PLAN_CURRENCIES` in `lib/plans.ts`; the UAE and Global
 * lists are commented out there as PLANNED). The markets that are coming are
 * named here behind a "Coming soon" badge, muted and as plain text: nothing to
 * select and no price, so the page never sells what the product does not yet
 * run. The words are `pricing.markets`; the hidden punctuation keeps the three
 * parts apart for a screen reader, which would otherwise read them as one run.
 */
export default function MarketsNote({
  copy,
  className = "",
}: {
  copy: SiteContent["pricing"]["markets"];
  className?: string;
}) {
  return (
    <p
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-dim ${className}`}
    >
      <span className="inline-flex items-center gap-2 font-bold text-ink">
        <span className="pearl" aria-hidden="true" />
        {copy.live}
        <span className="sr-only">. </span>
      </span>
      <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="whitespace-nowrap rounded-full border border-line bg-surface-2 px-2 py-0.5 font-bold">
          {copy.soon}
          <span className="sr-only">: </span>
        </span>
        <span>{copy.planned}</span>
      </span>
    </p>
  );
}
