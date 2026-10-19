"use client";

import { useEffect, useRef, useState } from "react";
import { CONSENT_OPEN_EVENT, type ConsentCategory, type ConsentChoices } from "@/lib/consent/core";
import { consent } from "@/lib/consent/config";
import { useConsent } from "@/lib/consent/react";
import type { ConsentCopy } from "@/lib/consent/copy";
import "./consent.css";

/**
 * The banner and the preferences panel — one design on every Devya and Moving
 * site (docs/compliance/consent-design.md). Styling comes from the `--consent-*`
 * tokens each site maps onto its own palette; markup, behaviour and copy match.
 *
 * - The banner shows only while there is no valid answer on this device.
 *   It does not block the page: nothing optional runs before the answer, so
 *   there is nothing to protect the visitor from while they read.
 * - "Reject all", "Customize" and "Accept all" are the same component, the
 *   same size and the same weight, on the first layer (EDPB cookie-banner
 *   taskforce, 2023). Nothing is pre-ticked.
 * - The panel is a native modal <dialog>: focus is trapped, Esc closes it,
 *   the page behind is inert. It opens from the banner, from "Cookie
 *   settings" in every footer, and from the cookie policy — the withdrawal
 *   path is as short as the consent path (Art. 7(3)).
 */
export default function ConsentManager({
  copy,
  policyHref,
}: {
  copy: ConsentCopy;
  /** The cookie policy, locale included. Omitted until the site publishes one. */
  policyHref?: string;
}) {
  const snapshot = useConsent();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bannerRef = useRef<HTMLElement>(null);
  const categories = consent.config.categories;
  const [draft, setDraft] = useState<ConsentChoices>(() => noChoices());

  useEffect(() => {
    const open = () => {
      const current = consent.read();
      setDraft(current.status === "set" ? { ...current.record.choices } : noChoices());
      const dialog = dialogRef.current;
      if (dialog && !dialog.open) dialog.showModal();
    };
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  // A site with no optional category has nothing to ask: no banner, and the
  // footer link still opens the panel to say what the site stores and why.
  const hasOptional = categories.length > 0;
  const showBanner = hasOptional && snapshot.status === "unset";

  // Publishes the banner's height as `--consent-h` while it is up, so fixed
  // corner buttons can sit above it.
  useEffect(() => {
    const el = bannerRef.current;
    if (!showBanner || !el) return;
    const root = document.documentElement;
    const publish = () => root.style.setProperty("--consent-h", `${el.offsetHeight}px`);
    publish();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(publish);
    observer?.observe(el);
    return () => {
      observer?.disconnect();
      root.style.removeProperty("--consent-h");
    };
  }, [showBanner]);

  const close = () => dialogRef.current?.close();
  const acceptAll = () => {
    close();
    consent.acceptAll();
  };
  const rejectAll = () => {
    close();
    consent.rejectAll();
  };
  const save = () => {
    close();
    consent.save(draft);
  };

  return (
    <>
      {showBanner ? (
        <section
          ref={bannerRef}
          className="consent-banner"
          aria-labelledby="consent-banner-title"
          data-consent="banner"
        >
          <div className="consent-card">
            <div className="consent-text">
              <h2 id="consent-banner-title" className="consent-title">
                {copy.bannerTitle}
              </h2>
              <p className="consent-body">
                {copy.bannerBody}
                {policyHref ? (
                  <>
                    {" "}
                    <a href={policyHref} className="consent-link">
                      {copy.policyLink}
                    </a>
                  </>
                ) : null}
              </p>
            </div>
            <div className="consent-actions">
              <button type="button" className="consent-btn" onClick={rejectAll} data-consent="reject">
                {copy.rejectAll}
              </button>
              <button type="button" className="consent-btn" onClick={consent.openPreferences} data-consent="customize">
                {copy.customize}
              </button>
              <button type="button" className="consent-btn" onClick={acceptAll} data-consent="accept">
                {copy.acceptAll}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <dialog
        ref={dialogRef}
        className="consent-panel"
        aria-labelledby="consent-panel-title"
        data-consent="panel"
      >
        <div className="consent-panel-head">
          <h2 id="consent-panel-title" className="consent-title">
            {copy.panelTitle}
          </h2>
          <button type="button" className="consent-close" onClick={close} aria-label={copy.close}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <p className="consent-body">
          {hasOptional ? copy.panelIntro : copy.noOptional}
          {policyHref ? (
            <>
              {" "}
              <a href={policyHref} className="consent-link">
                {copy.policyLink}
              </a>
            </>
          ) : null}
        </p>

        <ul className="consent-list">
          <li className="consent-item">
            <div className="consent-item-head">
              <span className="consent-item-title">{copy.necessary.title}</span>
              <span className="consent-always">{copy.alwaysOn}</span>
            </div>
            <p className="consent-item-body">{copy.necessary.body}</p>
            {copy.necessary.vendors ? <p className="consent-vendors">{copy.necessary.vendors}</p> : null}
          </li>
          {categories.map((key: ConsentCategory) => {
            const c = copy.categories[key];
            if (!c) return null;
            const id = `consent-${key}`;
            return (
              <li key={key} className="consent-item">
                <div className="consent-item-head">
                  <label htmlFor={id} className="consent-item-title">
                    {c.title}
                  </label>
                  <input
                    id={id}
                    type="checkbox"
                    role="switch"
                    className="consent-switch"
                    checked={draft[key]}
                    onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.checked }))}
                    data-consent={`toggle-${key}`}
                  />
                </div>
                <p className="consent-item-body">{c.body}</p>
                {c.vendors ? <p className="consent-vendors">{c.vendors}</p> : null}
              </li>
            );
          })}
        </ul>

        {hasOptional ? (
          <div className="consent-actions">
            <button type="button" className="consent-btn" onClick={rejectAll} data-consent="panel-reject">
              {copy.rejectAll}
            </button>
            <button type="button" className="consent-btn" onClick={save} data-consent="save">
              {copy.save}
            </button>
            <button type="button" className="consent-btn" onClick={acceptAll} data-consent="panel-accept">
              {copy.acceptAll}
            </button>
          </div>
        ) : (
          <div className="consent-actions">
            <button type="button" className="consent-btn" onClick={close} data-consent="panel-close">
              {copy.close}
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}

function noChoices(): ConsentChoices {
  return { preferences: false, analytics: false, marketing: false };
}

/** "Cookie settings" — the withdrawal entry point in every footer. */
export function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" className={className} onClick={consent.openPreferences} data-consent="open">
      {label}
    </button>
  );
}
