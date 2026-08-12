"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { getContent } from "@/content";
import { whatsappLink } from "@/lib/brand";
import { Whatsapp } from "./icons";

/**
 * Lead form that composes a WhatsApp message instead of posting anywhere.
 *
 * Deliberate: WhatsApp is how this market actually replies, and routing the
 * lead through the visitor's own client means the site stores no personal data
 * at all — nothing to leak, nothing to disclose, and no backend endpoint to
 * stand up before launch. Swap `onSubmit` for a POST to /api/leads when a CRM
 * exists.
 */
export default function ContactForm() {
  const locale = useLocale();
  const c = getContent(locale);
  const f = c.contact.form;

  const [values, setValues] = useState({
    name: "",
    restaurant: "",
    branches: "",
    phone: "",
    message: "",
  });

  const set = (key: keyof typeof values) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const lines = [
      c.contact.waTemplate,
      "",
      `${f.name}: ${values.name}`,
      `${f.restaurant}: ${values.restaurant}`,
      `${f.branches}: ${values.branches}`,
      `${f.phone}: ${values.phone}`,
      values.message ? `${f.message}: ${values.message}` : "",
    ].filter(Boolean);
    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} className="card flex flex-col gap-4 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={f.name} value={values.name} onChange={set("name")} required />
        <Input
          label={f.restaurant}
          value={values.restaurant}
          onChange={set("restaurant")}
          required
        />
        <Input
          label={f.branches}
          value={values.branches}
          onChange={set("branches")}
          type="number"
          min={1}
        />
        <Input
          label={f.phone}
          value={values.phone}
          onChange={set("phone")}
          type="tel"
          required
        />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-2">{f.message}</span>
        <textarea
          rows={4}
          value={values.message}
          onChange={set("message")}
          placeholder={f.messagePlaceholder}
          className="resize-y rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-dim/70 focus:border-caramel"
        />
      </label>

      <button type="submit" className="btn btn-primary mt-1">
        <Whatsapp width={18} height={18} />
        {f.submit}
      </button>
      <p className="text-xs leading-relaxed text-ink-dim">{f.hint}</p>
    </form>
  );
}

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-2">{label}</span>
      <input
        {...props}
        className="rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-dim/70 focus:border-caramel"
      />
    </label>
  );
}
