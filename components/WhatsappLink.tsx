"use client";

import { useLocale } from "next-intl";
import { track } from "@/lib/analytics";

/**
 * A WhatsApp hand-off that reports itself.
 *
 * WhatsApp is the second-highest-intent action on this site after the lead
 * form, and it leaves no trace on our side once the tab opens — so the click
 * is the only signal we ever get. `place` names the surface it fired from
 * ("cta_band", "contact_channel"), which is what makes the event answer "which
 * block sold this" rather than just "someone clicked WhatsApp today".
 *
 * A client component so that server-rendered blocks (CtaBand, the contact
 * channel cards) can keep their WhatsApp links without becoming client
 * components themselves.
 */
export default function WhatsappLink({
  href,
  place,
  className,
  children,
}: {
  href: string;
  place: string;
  className?: string;
  children: React.ReactNode;
}) {
  const locale = useLocale();

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={() => track("whatsapp_click", { locale, place })}
    >
      {children}
    </a>
  );
}
