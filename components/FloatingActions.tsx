"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { getContent } from "@/content";
import { whatsappLink } from "@/lib/brand";
import { Arrow, Whatsapp } from "./icons";
import WhatsappLink from "./WhatsappLink";

/**
 * The two floating buttons at the inline end of every page: back to the top
 * (once the first screen is out of view) and a WhatsApp chat.
 *
 * Back to the top moves focus to the start of `<main>` as well as scrolling,
 * so a keyboard user lands where the eye does. While the consent banner is up
 * the stack rides above it: the banner publishes its height as `--consent-h`
 * (see CookieConsent), and `.fab-stack` adds it to its offset.
 */
export default function FloatingActions() {
  const locale = useLocale();
  const c = getContent(locale);
  const [away, setAway] = useState(false);

  useEffect(() => {
    const onScroll = () => setAway(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <div className="fab-stack">
      <button
        type="button"
        onClick={toTop}
        aria-label={c.floating.top}
        title={c.floating.top}
        aria-hidden={!away}
        tabIndex={away ? 0 : -1}
        className={`fab fab-top ${away ? "is-shown" : ""}`}
      >
        <Arrow width={20} height={20} className="-rotate-90" />
      </button>
      <WhatsappLink
        href={whatsappLink(c.contact.waTemplate)}
        place="floating"
        className="fab fab-whatsapp"
        label={c.floating.whatsapp}
      >
        <Whatsapp width={28} height={28} />
      </WhatsappLink>
    </div>
  );
}
