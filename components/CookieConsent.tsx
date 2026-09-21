"use client";

import { useLocale } from "next-intl";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { writeConsent } from "@/lib/consent";
import { useConsent } from "./useConsent";

/**
 * The consent banner.
 *
 * Shown only while the choice is unanswered, and it is the only thing standing
 * between a visitor and the analytics mount — see `lib/consent.ts` for what is
 * gated. Reject and Accept are the same size and the same weight on purpose:
 * a refusal that is visually harder to find than the acceptance is not a free
 * choice, and regulators have said so explicitly.
 *
 * It sits `fixed` at the bottom rather than blocking the page. Nothing here
 * runs before the answer, so there is nothing to protect the visitor from
 * while they read it, and a modal that holds a marketing site hostage over
 * two counters is disproportionate.
 */
export default function CookieConsent() {
  const locale = useLocale();
  const c = getContent(locale);
  const consent = useConsent();

  if (consent !== "unset") return null;

  const t = c.consent;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t.title}
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 rounded-2xl border border-line bg-surface/95 p-5 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <div className="flex-1">
          <p className="font-display text-base text-ink">{t.title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
            {t.body}{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-caramel"
            >
              {t.policyLink}
            </Link>
          </p>
        </div>

        {/* `shrink-0` so the two buttons never wrap to one-per-line on the
            narrow Arabic measure, where the label words are longer. */}
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => writeConsent("denied")}
            className="btn btn-ghost flex-1 sm:flex-none"
          >
            {t.reject}
          </button>
          <button
            type="button"
            onClick={() => writeConsent("granted")}
            className="btn btn-primary flex-1 sm:flex-none"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
