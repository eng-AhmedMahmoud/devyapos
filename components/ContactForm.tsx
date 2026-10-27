"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import type { SiteContent } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { captureFirstTouch, readAttribution, track } from "@/lib/analytics";
import { brand, whatsappLink } from "@/lib/brand";
import {
  LEAD_LIMITS,
  validateLead,
  type LeadErrorCode,
  type LeadErrors,
  type LeadField,
} from "@/lib/leads";
import Field from "./form/Field";
import { Whatsapp } from "./icons";

/**
 * The lead form.
 *
 * It posts to `/api/lead`, which is the only path that produces a record we
 * own. WhatsApp is kept as a deliberate second route — it is how this market
 * actually replies — but it is no longer the submit button, because a lead that
 * exists only inside someone's WhatsApp thread is a lead nobody can count,
 * dedupe, or attribute to the campaign that paid for it.
 *
 * Validation runs twice: here for the inline hints, and again in the route
 * handler, which is the one that matters. Both call `validateLead`, so the two
 * cannot drift apart.
 */

/**
 * The copy this form reads, passed down by its page (a server component) so the
 * browser receives one locale's strings, not both content trees.
 */
export type ContactFormCopy = Pick<SiteContent["contact"], "badge" | "form" | "waTemplate">;

type Values = Record<"name" | "restaurant" | "branches" | "phone" | "message", string>;

const EMPTY: Values = {
  name: "",
  restaurant: "",
  branches: "",
  phone: "",
  message: "",
};

type Status = "idle" | "submitting" | "success" | "error";

/** Field order for the error summary, so it reads like the form. */
const FIELD_ORDER: LeadField[] = [
  "name",
  "restaurant",
  "branches",
  "phone",
  "message",
];

export default function ContactForm({
  copy,
  planNames = {},
}: {
  copy: ContactFormCopy;
  /** Plan id → name, for `/contact?plan=<id>` from a pricing card. */
  planNames?: Record<string, string>;
}) {
  const locale = useLocale();
  const f = copy.form;
  // Status and field-error copy used to be hardcoded here in both locales
  // because the form gained a backend before the copy existed. It lives in the
  // content tree now, keyed the same way, so a translator changes it in one
  // place and `LeadErrorCode` still indexes it.
  const t = f.status;
  const fieldError: Record<LeadErrorCode, string> = f.errors;

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  /** Honeypot. Never shown, never filled by a person. */
  const [company, setCompany] = useState("");

  const summaryRef = useRef<HTMLDivElement>(null);
  // A plain prefix rather than `useId()`: there is only ever one lead form on a
  // page, and `useId` emits non-ASCII delimiters that make the error-summary
  // fragment links (`href="#lead-phone"`) needlessly fragile.
  const fieldId = (name: string) => `lead-${name}`;
  const errorId = (name: string) => `lead-${name}-error`;

  const labels: Record<LeadField, string> = {
    name: f.name,
    restaurant: f.restaurant,
    branches: f.branches,
    phone: f.phone,
    message: f.message,
  };

  // First touch is recorded here as well as on landing: someone who arrives on
  // /contact directly from an ad has their UTMs only in this page's URL. Only
  // with "marketing" consent — `captureFirstTouch` returns null without it.
  useEffect(() => {
    captureFirstTouch();
    track("lead_form_view", { locale });
  }, [locale]);

  /**
   * A pricing card links here as `/contact?plan=<id>`: the plan travels as the
   * first line of what is sent. Read from the URL at send time, never into the
   * rendered form, so the prerendered page and the browser's first render agree.
   */
  function planLine(): string {
    const id = new URLSearchParams(window.location.search).get("plan");
    const name = id ? planNames[id] : undefined;
    return name ? f.planInterest.replace("{plan}", name) : "";
  }

  /** The visitor's message with the plan line in front of it, when there is one. */
  function messageWithPlan(): string {
    return [planLine(), values.message].filter(Boolean).join("\n");
  }

  const set = (key: keyof Values) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    // Clear a field's error as soon as it is touched — re-validating on every
    // keystroke turns a half-typed phone number into a running complaint.
    setErrors((e) => (e[key as LeadField] ? { ...e, [key]: undefined } : e));
  };

  /** The filled form as plain text — the WhatsApp and email routes share it. */
  function compose() {
    return [
      copy.waTemplate,
      "",
      `${f.name}: ${values.name}`,
      `${f.restaurant}: ${values.restaurant}`,
      values.branches ? `${f.branches}: ${values.branches}` : "",
      `${f.phone}: ${values.phone}`,
      messageWithPlan() ? `${f.message}: ${messageWithPlan()}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    setFormError(null);
    // Validated as sent, plan line included, so the server never refuses what passed here.
    const check = validateLead({ ...values, message: messageWithPlan(), locale });
    if (!check.ok) {
      setErrors(check.errors);
      setStatus("error");
      track("lead_form_error", { locale, reason: "client_validation" });
      // Move focus to the summary so a screen reader lands on the problem list
      // instead of announcing nothing and leaving the user on the button.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setErrors({});
    setStatus("submitting");
    track("lead_form_submit", { locale, branches: check.lead.branches ?? 0 });

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          message: messageWithPlan(),
          locale,
          company,
          attribution: readAttribution(),
        }),
      });
      const data: {
        ok?: boolean;
        error?: string;
        fields?: LeadErrors;
      } = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setStatus("success");
        setValues(EMPTY);
        track("lead_form_success", {
          locale,
          source: readAttribution()?.source ?? "direct",
        });
        return;
      }

      // The server re-ran the same validator, so its field codes render through
      // exactly the same strings the inline hints use.
      if (data.error === "validation_failed" && data.fields) {
        setErrors(data.fields);
      } else {
        setFormError(
          data.error === "rate_limited" ? t.rateLimited : t.errorBody,
        );
      }
      setStatus("error");
      track("lead_form_error", { locale, reason: data.error ?? `http_${res.status}` });
      requestAnimationFrame(() => summaryRef.current?.focus());
    } catch {
      setFormError(t.errorBody);
      setStatus("error");
      track("lead_form_error", { locale, reason: "network" });
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  }

  /** Secondary route: hand the filled form to WhatsApp. */
  function onWhatsapp() {
    track("whatsapp_click", { locale, place: "contact_form" });
    window.open(whatsappLink(compose(), "form"), "_blank", "noopener,noreferrer");
  }

  /**
   * Tertiary route. Native validation only fires for the submit button, so this
   * checks the form itself first — otherwise a half-filled draft lands in the
   * inbox.
   */
  function onEmail(e: React.MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.form;
    if (form && !form.reportValidity()) return;
    track("email_click", { locale, place: "contact_form" });
    const subject = `${copy.badge} — ${values.restaurant || values.name}`;
    window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(compose())}`;
  }

  const submitting = status === "submitting";
  const listed = FIELD_ORDER.filter((k) => errors[k]);

  if (status === "success") {
    return (
      <div
        className="card flex flex-col items-start gap-3 p-6 sm:p-8"
        role="status"
        aria-live="polite"
      >
        <span className="icon-tile" style={{ ["--tile" as string]: "var(--mint)" }}>
          <Whatsapp width={18} height={18} />
        </span>
        <h3 className="font-display text-lg text-ink">{t.successTitle}</h3>
        <p className="text-sm leading-relaxed text-ink-dim">{t.successBody}</p>
        <button type="button" onClick={onWhatsapp} className="btn btn-ghost mt-2">
          <Whatsapp width={18} height={18} />
          {f.submit}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card flex flex-col gap-4 p-6 sm:p-8">
      {/*
        Error summary. `tabIndex={-1}` makes it a focus target after a failed
        submit; `aria-live` announces late server-side failures for anyone who
        never moved focus.
      */}
      <div
        ref={summaryRef}
        tabIndex={-1}
        role="alert"
        aria-live="assertive"
        className={
          listed.length > 0 || formError
            ? "rounded-xl border border-danger/40 bg-danger/8 p-4 outline-none"
            : "sr-only"
        }
      >
        {listed.length > 0 || formError ? (
          <>
            <p className="text-sm font-bold text-danger">{t.errorTitle}</p>
            {formError ? (
              <p className="mt-1 text-sm text-ink-2">{formError}</p>
            ) : null}
            {listed.length > 0 ? (
              <>
                <p className="mt-1 text-sm text-ink-2">{t.errorSummary}</p>
                <ul className="mt-2 flex flex-col gap-1">
                  {listed.map((key) => (
                    <li key={key} className="text-sm text-ink-2">
                      <a href={`#${fieldId(key)}`} className="underline underline-offset-2">
                        {labels[key]}
                      </a>
                      {" — "}
                      {fieldError[errors[key] as LeadErrorCode]}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id={fieldId("name")}
          errorId={errorId("name")}
          label={f.name}
          value={values.name}
          onValue={set("name")}
          error={errors.name ? fieldError[errors.name] : undefined}
          disabled={submitting}
          required
          autoComplete="name"
          maxLength={LEAD_LIMITS.name}
        />
        <Field
          id={fieldId("restaurant")}
          errorId={errorId("restaurant")}
          label={f.restaurant}
          value={values.restaurant}
          onValue={set("restaurant")}
          error={errors.restaurant ? fieldError[errors.restaurant] : undefined}
          disabled={submitting}
          required
          autoComplete="organization"
          maxLength={LEAD_LIMITS.restaurant}
        />
        <Field
          id={fieldId("phone")}
          errorId={errorId("phone")}
          label={f.phone}
          value={values.phone}
          onValue={set("phone")}
          error={errors.phone ? fieldError[errors.phone] : undefined}
          disabled={submitting}
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          maxLength={20}
        />
        {/*
          Branches is the one qualification signal on the form: a single-branch
          owner and a six-branch chain are different conversations. Optional, and
          labelled as such, so it stays a hint rather than a hurdle.
        */}
        <Field
          id={fieldId("branches")}
          errorId={errorId("branches")}
          label={f.branches}
          hint={t.optional}
          value={values.branches}
          onValue={set("branches")}
          error={errors.branches ? fieldError[errors.branches] : undefined}
          disabled={submitting}
          type="number"
          inputMode="numeric"
          min={1}
          max={LEAD_LIMITS.branches}
          dir="ltr"
        />
      </div>

      <label className="flex flex-col gap-1.5" htmlFor={fieldId("message")}>
        <span className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-ink-2">{f.message}</span>
          <span className="text-xs text-ink-dim">({t.optional})</span>
        </span>
        <textarea
          id={fieldId("message")}
          rows={4}
          value={values.message}
          onChange={(e) => set("message")(e.target.value)}
          placeholder={f.messagePlaceholder}
          disabled={submitting}
          maxLength={LEAD_LIMITS.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? errorId("message") : undefined}
          className="resize-y rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-dim/70 focus:border-caramel disabled:opacity-60"
        />
        {errors.message ? (
          <span id={errorId("message")} className="text-xs text-danger">
            {fieldError[errors.message]}
          </span>
        ) : null}
      </label>

      {/*
        Honeypot. Off-screen rather than `display:none` — some bots skip hidden
        inputs but happily fill a positioned one. Hidden from assistive tech and
        removed from the tab order, so no human ever reaches it.
      */}
      <div aria-hidden="true" className="h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor={fieldId("company")}>Company</label>
        <input
          id={fieldId("company")}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="mt-1 flex flex-col gap-3 sm:flex-row">
        {/* `cta.secondary` ("Book a 15-min demo") used to sit here, which
            described neither the button nor what pressing it does. */}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? t.sending : f.submitLead}
        </button>
        <button
          type="button"
          onClick={onWhatsapp}
          className="btn btn-ghost"
          disabled={submitting}
        >
          <Whatsapp width={18} height={18} />
          {f.submit}
        </button>
      </div>

      <p className="text-xs leading-relaxed text-ink-dim">
        {f.hint}{" "}
        <button
          type="button"
          onClick={onEmail}
          disabled={submitting}
          className="underline underline-offset-2 hover:text-caramel"
        >
          {f.submitEmail}
        </button>
      </p>

      {/* The collection notice. It sits under the buttons rather than behind a
          checkbox on purpose: this form exists to answer a sales enquiry, so
          the lawful basis is the enquiry itself — a tick-box would imply the
          details get used for something else if you tick it, which they do
          not. The link is what makes the full policy one click away. */}
      <p className="text-xs leading-relaxed text-ink-dim">
        {f.privacy}{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-2 hover:text-caramel"
        >
          {f.privacyLink}
        </Link>
      </p>
    </form>
  );
}
