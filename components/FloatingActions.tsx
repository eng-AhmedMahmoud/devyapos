"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/content/types";
import { whatsappLink } from "@/lib/brand";
import { Arrow, Chat, Whatsapp } from "./icons";
import WhatsappLink from "./WhatsappLink";

/**
 * The floating buttons at the inline end of every page: back to the top
 * (once the first screen is out of view), the Moving support assistant and a
 * WhatsApp chat. The assistant's button is only a toggle: the widget the
 * layout loads (components/SupportChat.tsx) opens its panel from any element
 * marked `data-moving-support-toggle`, and keeps `aria-expanded` in step.
 *
 * Back to the top moves focus to the start of `<main>` as well as scrolling,
 * so a keyboard user lands where the eye does. The stack is pinned to the
 * bottom inline-end corner; while the consent banner is up it rides above the
 * banner only where the banner reaches that corner — the banner publishes its
 * height as `--consent-h` (see components/consent/ConsentManager) and `.fab-stack` decides when to
 * add it (globals.css).
 */
export default function FloatingActions({
  copy,
  waTemplate,
}: {
  copy: SiteContent["floating"];
  /** The WhatsApp message the chat button opens with: `contact.waTemplate`. */
  waTemplate: string;
}) {
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
        aria-label={copy.top}
        title={copy.top}
        aria-hidden={!away}
        tabIndex={away ? 0 : -1}
        className={`fab fab-top ${away ? "is-shown" : ""}`}
      >
        <Arrow width={20} height={20} className="-rotate-90" />
      </button>
      <button
        type="button"
        data-moving-support-toggle=""
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-label={copy.chat}
        title={copy.chat}
        className="fab fab-chat"
      >
        <Chat width={22} height={22} />
      </button>
      <WhatsappLink
        href={whatsappLink(waTemplate, "float")}
        place="floating"
        className="fab fab-whatsapp"
        label={copy.whatsapp}
      >
        <Whatsapp width={26} height={26} />
      </WhatsappLink>
    </div>
  );
}
