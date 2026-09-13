"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import {
  CONSENT_OPEN_EVENT,
  acceptAll,
  readConsent,
  rejectAll,
  writeConsent,
  type ConsentState,
} from "@/lib/consent";
import { useConsent } from "./useConsent";

/**
 * The cookie consent banner and its preferences panel.
 *
 * Behaviour that keeps the site privacy-preserving by default:
 *   - The banner shows until the visitor makes an explicit choice. Until then
 *     nothing non-essential runs (see `ConsentedAnalytics`, `lib/analytics.ts`).
 *   - "Accept all" and "Reject all" are equally prominent, one-click buttons —
 *     rejecting is never harder than accepting.
 *   - "Customize" opens per-category toggles (analytics, marketing) that start
 *     OFF; strictly-necessary is shown as always-on and cannot be toggled.
 *   - The panel can be reopened any time from the footer's "Cookie settings"
 *     control, which dispatches {@link CONSENT_OPEN_EVENT}. That is the
 *     standing route to change or withdraw a prior choice.
 *
 * Rendered only after mount, so the server and first client paint agree (both
 * render nothing) and there is no hydration mismatch on the stored choice.
 */
export default function CookieConsent() {
  const locale = useLocale();
  const cc = getContent(locale).consent;
  const { decided } = useConsent();

  const [mounted, setMounted] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [draft, setDraft] = useState<ConsentState>({
    analytics: false,
    marketing: false,
  });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const open = () => {
      // Seed the toggles from any prior decision so the panel reflects reality.
      setDraft(readConsent());
      setPanelOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  // Escape closes the panel; focus moves into it when it opens.
  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanelOpen(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [panelOpen]);

  if (!mounted) return null;

  const showBanner = !decided && !panelOpen;

  function onAcceptAll() {
    acceptAll();
    setPanelOpen(false);
  }
  function onRejectAll() {
    rejectAll();
    setPanelOpen(false);
  }
  function onSave() {
    writeConsent(draft);
    setPanelOpen(false);
  }
  function openPanel() {
    setDraft(readConsent());
    setPanelOpen(true);
  }

  return (
    <>
      {showBanner ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={cc.banner.title}
          className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4"
        >
          <div className="card mx-auto flex w-full max-w-4xl flex-col gap-3 p-5 shadow-lift sm:p-6">
            <div className="flex flex-col gap-1.5">
              <h2 className="font-display text-base text-ink sm:text-lg">
                {cc.banner.title}
              </h2>
              <p className="text-sm leading-relaxed text-ink-dim">
                {cc.banner.body}{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-2 hover:text-caramel"
                >
                  {cc.banner.privacyLink}
                </Link>
                {" · "}
                <Link
                  href="/cookies"
                  className="underline underline-offset-2 hover:text-caramel"
                >
                  {cc.banner.cookiesLink}
                </Link>
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={onAcceptAll}
                className="btn btn-primary"
              >
                {cc.banner.acceptAll}
              </button>
              <button
                type="button"
                onClick={onRejectAll}
                className="btn btn-ghost bg-surface"
              >
                {cc.banner.rejectAll}
              </button>
              <button
                type="button"
                onClick={openPanel}
                className="btn btn-ghost sm:ms-auto"
              >
                {cc.banner.customize}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {panelOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-espresso/60 p-3 sm:items-center sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPanelOpen(false);
          }}
        >
          <div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-panel-title"
            className="card flex w-full max-w-lg flex-col gap-4 p-6 shadow-lift outline-none sm:p-7"
          >
            <div className="flex flex-col gap-1.5">
              <h2
                id="cookie-panel-title"
                className="font-display text-lg text-ink"
              >
                {cc.panel.title}
              </h2>
              <p className="text-sm leading-relaxed text-ink-dim">
                {cc.panel.intro}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {/* Strictly necessary — always on, not toggleable. */}
              <div className="rounded-xl border border-line bg-surface-2 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-ink">
                    {cc.panel.categories.necessary.title}
                  </h3>
                  <span className="rounded-full bg-mint/15 px-2.5 py-0.5 text-xs font-bold text-mint">
                    {cc.panel.on}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-dim">
                  {cc.panel.categories.necessary.body}
                </p>
              </div>

              <Toggle
                title={cc.panel.categories.analytics.title}
                body={cc.panel.categories.analytics.body}
                checked={draft.analytics}
                onChange={(v) => setDraft((d) => ({ ...d, analytics: v }))}
              />
              <Toggle
                title={cc.panel.categories.marketing.title}
                body={cc.panel.categories.marketing.body}
                checked={draft.marketing}
                onChange={(v) => setDraft((d) => ({ ...d, marketing: v }))}
              />
            </div>

            <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button type="button" onClick={onSave} className="btn btn-primary">
                {cc.panel.save}
              </button>
              <button
                type="button"
                onClick={onAcceptAll}
                className="btn btn-ghost bg-surface"
              >
                {cc.panel.acceptAll}
              </button>
              <button
                type="button"
                onClick={onRejectAll}
                className="btn btn-ghost bg-surface"
              >
                {cc.panel.rejectAll}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** One opt-in category, rendered as a labelled switch that starts OFF. */
function Toggle({
  title,
  body,
  checked,
  onChange,
}: {
  title: string;
  body: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-line bg-surface-2 p-4">
      <span className="flex flex-col gap-1.5">
        <span className="text-sm font-bold text-ink">{title}</span>
        <span className="text-xs leading-relaxed text-ink-dim">{body}</span>
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="h-6 w-11 rounded-full bg-line transition-colors peer-checked:bg-mint peer-focus-visible:ring-2 peer-focus-visible:ring-caramel"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0.5 start-0.5 h-5 w-5 rounded-full bg-surface transition-transform peer-checked:translate-x-5 rtl:peer-checked:-translate-x-5"
        />
      </span>
    </label>
  );
}
