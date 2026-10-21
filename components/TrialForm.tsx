"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import type { SiteContent } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { whatsappLink } from "@/lib/brand";
import {
  claimTrial,
  TRIAL_CLAIM_URL,
  TRIAL_COUNTRIES,
  TRIAL_LIMITS,
  validateTrial,
  type ClaimResult,
  type TrialCountry,
  type TrialErrors,
  type TrialField,
  type TrialValues,
} from "@/lib/trial";
import Field from "./form/Field";
import { Arrow, Check, Whatsapp } from "./icons";

/**
 * The accounting trial sign-up.
 *
 * It posts from the browser to Devya's control plane (`lib/trial.ts`), which
 * either hands back an empty accounting system of the visitor's own — its
 * address and its setup token, shown here ONCE and never stored anywhere on
 * this side — or says why not. Every "why not" still ends with a person: a
 * full pool keeps the sign-up for sales, and every other failure offers
 * WhatsApp.
 */

/**
 * The copy this form reads, passed down by its page (a server component) so the
 * browser receives one locale's strings, not both content trees.
 */
export type TrialFormCopy = Pick<SiteContent["accountingTrial"], "form" | "result" | "outcomes">;

const FIELD_ORDER: TrialField[] = ["name", "company", "email", "phone", "country"];

type Outcome = Exclude<ClaimResult, { kind: "claimed" } | { kind: "invalid" }>;

export default function TrialForm({ copy }: { copy: TrialFormCopy }) {
  const locale = useLocale();
  const f = copy.form;

  const [values, setValues] = useState<TrialValues>({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "EG",
  });
  const [errors, setErrors] = useState<TrialErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [claimed, setClaimed] = useState<Extract<ClaimResult, { kind: "claimed" }> | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  /** Honeypot. Off-screen, out of the tab order, never filled by a person. */
  const [website, setWebsite] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    track("trial_form_view", { locale });
  }, [locale]);

  const fieldId = (name: string) => `trial-${name}`;
  const errorId = (name: string) => `trial-${name}-error`;

  const labels: Record<TrialField, string> = {
    name: f.name,
    company: f.company,
    email: f.email,
    phone: f.phone,
    country: f.country,
  };

  function message(field: TrialField, code: TrialErrors[TrialField]): string | undefined {
    if (!code) return undefined;
    if (code === "invalid") {
      if (field === "email") return f.errors.invalidEmail;
      if (field === "phone") return f.errors.invalidPhone[values.country];
      return f.errors.invalid;
    }
    return f.errors[code];
  }

  const set = (key: keyof TrialValues) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setOutcome(null);

    const check = validateTrial(values);
    if (Object.keys(check).length > 0) {
      setErrors(check);
      track("trial_form_error", { locale, reason: "client_validation" });
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setErrors({});
    setSubmitting(true);
    track("trial_form_submit", { locale, country: values.country });
    const result = await claimTrial(values, locale, website);
    setSubmitting(false);

    if (result.kind === "claimed") {
      track("trial_claimed", { locale, country: values.country });
      setClaimed(result);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    track("trial_form_error", { locale, reason: result.kind });
    if (result.kind === "invalid") {
      setErrors(result.fields);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setOutcome(result);
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  if (claimed) {
    return <ClaimedCard result={claimed} country={values.country} copy={copy.result} />;
  }

  if (!TRIAL_CLAIM_URL) {
    return <OutcomeCard outcome={{ kind: "closed" }} copy={copy.outcomes} />;
  }

  const listed = FIELD_ORDER.filter((key) => errors[key]);

  return (
    <form onSubmit={onSubmit} noValidate className="card flex flex-col gap-5 p-6 sm:p-8">
      <div>
        <h2 className="font-display text-xl text-ink sm:text-2xl">{f.title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-dim">{f.sub}</p>
      </div>

      {/* Focus target after a failed submit; announced for anyone who never
          moved focus. A claim-route outcome renders here too, above the form
          that produced it. */}
      <div ref={summaryRef} tabIndex={-1} role="alert" aria-live="assertive" className="outline-none">
        {listed.length > 0 ? (
          <div className="rounded-xl border border-danger/40 bg-danger/8 p-4">
            <p className="text-sm font-bold text-danger">{f.errorTitle}</p>
            <p className="mt-1 text-sm text-ink-2">{f.errorSummary}</p>
            <ul className="mt-2 flex flex-col gap-1">
              {listed.map((key) => (
                <li key={key} className="text-sm text-ink-2">
                  <a href={`#${fieldId(key)}`} className="underline underline-offset-2">
                    {labels[key]}
                  </a>
                  {" — "}
                  {message(key, errors[key])}
                </li>
              ))}
            </ul>
          </div>
        ) : outcome ? (
          <OutcomeCard outcome={outcome} copy={copy.outcomes} inline />
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id={fieldId("name")}
          errorId={errorId("name")}
          label={f.name}
          value={values.name}
          onValue={set("name")}
          error={message("name", errors.name)}
          disabled={submitting}
          required
          autoComplete="name"
          maxLength={TRIAL_LIMITS.name.max}
        />
        <Field
          id={fieldId("company")}
          errorId={errorId("company")}
          label={f.company}
          value={values.company}
          onValue={set("company")}
          error={message("company", errors.company)}
          disabled={submitting}
          required
          autoComplete="organization"
          maxLength={TRIAL_LIMITS.company.max}
        />
        <Field
          id={fieldId("email")}
          errorId={errorId("email")}
          label={f.email}
          value={values.email}
          onValue={set("email")}
          error={message("email", errors.email)}
          disabled={submitting}
          required
          type="email"
          inputMode="email"
          autoComplete="email"
          dir="ltr"
          maxLength={TRIAL_LIMITS.email.max}
        />
        <Field
          id={fieldId("phone")}
          errorId={errorId("phone")}
          label={f.phone}
          value={values.phone}
          onValue={set("phone")}
          error={message("phone", errors.phone)}
          disabled={submitting}
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          placeholder={f.phonePlaceholder[values.country]}
          maxLength={20}
        />
      </div>

      <fieldset className="flex flex-col gap-2" id={fieldId("country")}>
        <legend className="mb-1.5 text-sm font-medium text-ink-2">{f.country}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {TRIAL_COUNTRIES.map((country: TrialCountry) => {
            const active = values.country === country;
            return (
              <label
                key={country}
                className={`flex cursor-pointer flex-col gap-1 rounded-xl border px-4 py-3 transition-colors ${
                  active ? "border-caramel bg-brand-soft" : "border-line bg-surface-2 hover:border-caramel"
                } ${submitting ? "pointer-events-none opacity-60" : ""}`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="country"
                    value={country}
                    checked={active}
                    disabled={submitting}
                    onChange={() => set("country")(country)}
                    className="accent-[var(--brand)]"
                  />
                  <span className="text-sm font-semibold text-ink">{f.countries[country]}</span>
                </span>
                <span className="text-xs leading-relaxed text-ink-dim">{f.countryNote[country]}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Honeypot — off-screen rather than display:none, which some bots skip. */}
      <div aria-hidden="true" className="h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor={fieldId("website")}>Website</label>
        <input
          id={fieldId("website")}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary w-full sm:w-auto sm:self-start" disabled={submitting}>
        {submitting ? f.sending : f.submit}
        {submitting ? null : <Arrow width={18} height={18} className="flip-rtl" />}
      </button>

      <p className="text-xs leading-relaxed text-ink-dim">
        {f.privacy}{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-caramel">
          {f.privacyLink}
        </Link>
      </p>
    </form>
  );
}

/**
 * The link and the token, once. Each value is its own element — LTR-isolated,
 * selectable as a whole, copied by its button — because the token is typed
 * into a wizard next, and a token copied with a stray RTL mark or half a line
 * is a support call.
 */
function ClaimedCard({
  result,
  country,
  copy: r,
}: {
  result: Extract<ClaimResult, { kind: "claimed" }>;
  country: TrialCountry;
  copy: TrialFormCopy["result"];
}) {
  const locale = useLocale();
  const [tokenCopied, setTokenCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // Leaving before the token is copied loses it for good: the browser asks
  // first. Once it has been copied, the page lets go.
  useEffect(() => {
    if (tokenCopied) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [tokenCopied]);

  const date = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: country === "SA" ? "Asia/Riyadh" : "Africa/Cairo",
  }).format(new Date(result.expiresAt));

  return (
    <div className="card flex flex-col gap-6 p-6 sm:p-8" role="status" aria-live="polite">
      <div className="flex items-start gap-3">
        <span className="icon-tile shrink-0" style={{ ["--tile" as string]: "var(--mint)" }}>
          <Check width={20} height={20} />
        </span>
        <div className="min-w-0">
          <h2 ref={headingRef} tabIndex={-1} className="font-display text-xl text-ink outline-none sm:text-2xl">
            {r.title}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-dim">{r.sub}</p>
        </div>
      </div>

      <CopyValue label={r.linkLabel} value={result.url} href={result.url} copy={r.copy} copied={r.copied} />
      <CopyValue
        label={r.tokenLabel}
        value={result.setupToken}
        copy={r.copy}
        copied={r.copied}
        onCopied={() => setTokenCopied(true)}
        note={r.tokenWarning}
      />

      <p className="text-sm text-ink-2">{r.expires.replace("{date}", date)}</p>

      <a
        href={result.setupUrl}
        target="_blank"
        rel="noreferrer"
        className="btn btn-primary w-full sm:w-auto sm:self-start"
      >
        {r.open}
        <Arrow width={18} height={18} className="flip-rtl" />
      </a>

      <div>
        <h3 className="text-sm font-bold text-ink">{r.stepsTitle}</h3>
        <ol className="mt-2 flex flex-col gap-2">
          {r.steps.map((step, i) => (
            <li key={step} className="flex items-start gap-3 text-sm leading-relaxed text-ink-dim">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                {new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(i + 1)}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function CopyValue({
  label,
  value,
  href,
  copy,
  copied,
  onCopied,
  note,
}: {
  label: string;
  value: string;
  href?: string;
  copy: string;
  copied: string;
  onCopied?: () => void;
  note?: string;
}) {
  const [done, setDone] = useState(false);
  const valueRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(() => setDone(false), 2000);
    return () => window.clearTimeout(timer);
  }, [done]);

  async function onCopy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch {
      // No clipboard permission (an old browser, an embedded view): select the
      // value so the visitor's own copy takes exactly it.
      const node = valueRef.current;
      const selection = window.getSelection();
      if (node && selection) {
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
        ok = document.execCommand?.("copy") ?? false;
      }
    }
    if (ok) {
      setDone(true);
      onCopied?.();
    }
  }

  const valueClass =
    "copy-value block min-w-0 flex-1 rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 font-mono text-sm text-ink";

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-2">{label}</span>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        {href ? (
          <a ref={valueRef as React.RefObject<HTMLAnchorElement>} href={href} target="_blank" rel="noreferrer" dir="ltr" className={`${valueClass} underline-offset-2 hover:underline`}>
            {value}
          </a>
        ) : (
          <code ref={valueRef} dir="ltr" className={valueClass}>
            {value}
          </code>
        )}
        <button type="button" onClick={onCopy} className="btn btn-ghost shrink-0 !py-2.5" aria-live="polite">
          {done ? <Check width={16} height={16} /> : null}
          {done ? copied : copy}
        </button>
      </div>
      {note ? <p className="text-xs font-semibold leading-relaxed text-caramel">{note}</p> : null}
    </div>
  );
}

function OutcomeCard({
  outcome,
  copy: o,
  inline = false,
}: {
  outcome: Outcome;
  copy: TrialFormCopy["outcomes"];
  inline?: boolean;
}) {
  const locale = useLocale();
  const copy: Record<Outcome["kind"], { title: string; body: string }> = {
    pool_empty: { title: o.poolEmptyTitle, body: o.poolEmptyBody },
    already_has_trial: { title: o.alreadyTitle, body: o.alreadyBody },
    rate_limited: { title: o.rateLimitedTitle, body: o.rateLimitedBody },
    closed: { title: o.closedTitle, body: o.closedBody },
    error: { title: o.errorTitle, body: o.errorBody },
  };
  const { title, body } = copy[outcome.kind];
  // A full pool is not a failure — the sign-up was kept and sales will call.
  const calm = outcome.kind === "pool_empty";

  return (
    <div
      className={`flex flex-col items-start gap-3 ${
        inline
          ? `rounded-xl border p-4 ${calm ? "border-line bg-brand-soft" : "border-danger/40 bg-danger/8"}`
          : "card p-6 sm:p-8"
      }`}
    >
      <p className={`font-bold text-ink ${inline ? "text-sm" : "font-display text-xl"}`}>{title}</p>
      <p className="text-sm leading-relaxed text-ink-2">{body}</p>
      <a
        href={whatsappLink(o.waTemplate, "trial")}
        target="_blank"
        rel="noreferrer"
        onClick={() => track("whatsapp_click", { locale, place: "accounting_trial" })}
        className="btn btn-ghost !py-2.5 text-sm"
      >
        <Whatsapp width={18} height={18} />
        {o.whatsapp}
      </a>
    </div>
  );
}
