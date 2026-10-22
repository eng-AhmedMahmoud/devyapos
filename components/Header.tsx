"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { SiteContent } from "@/content/types";
import { brandName } from "@/lib/brand";
import { Arrow, Close, Menu } from "./icons";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/** 12px of travel is enough to mean "the page has moved under the bar". */
function isScrolled() {
  return window.scrollY > 12;
}

/**
 * Sticky glass header — translucent at rest, then a hairline border and a soft
 * shadow once the page scrolls. Sticky rather than fixed so the hero does not
 * need to reserve height for it.
 *
 * `nav` comes from the layout (a server component): this is on every page, so
 * reading the content module here put both locales' whole copy in the shared
 * client chunk.
 */
export default function Header({ nav }: { nav: Pick<SiteContent["nav"], "links" | "cta"> }) {
  const locale = useLocale();
  const t = useTranslations("a11y");
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  // Scroll position is external state, read through the store API rather than
  // mirrored into React state from an effect.
  const scrolled = useSyncExternalStore(subscribeToScroll, isScrolled, () => false);

  // Lock the page while the drawer covers it.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const other = locale === "ar" ? "en" : "ar";

  return (
    <>
      <header className="site-header" data-scrolled={scrolled}>
        {/* A phone's bar is the logo, the CTA and the menu button. The theme
            toggle joins the language switch in the drawer below sm, and below
            340px the CTA goes too (the drawer and every hero carry it): at
            320px the full bar ran 27–34px past the screen. The 20px gutter
            stays, so the logo lines up with the page under it. */}
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-2 px-5 sm:h-[4.5rem] sm:gap-4 sm:px-8">
          {/* The accessible name starts with the words the logo shows, so a
              voice user who says what they see hits it (WCAG 2.5.3). */}
          <Link href="/" aria-label={`${brandName(locale)} — ${t("home")}`} className="shrink-0">
            <Logo locale={locale} />
          </Link>

          {/* Numbered, as Moving Stores' bar is: the index is decoration, the
              label is the link's name. */}
          <nav className="hidden items-center gap-6 md:flex">
            {nav.links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className="nav-link"
                data-active={pathname === l.href}
              >
                <span className="t-index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="hidden sm:inline-flex">
              <ThemeToggle />
            </span>
            <Link
              href={pathname}
              locale={other}
              className="hidden rounded-xl px-2 py-1.5 text-sm font-semibold text-ink-2 transition-colors hover:bg-line hover:text-ink sm:inline-flex"
            >
              {t("switchLanguage")}
            </Link>
            {/* "Log in" used to sit here pointing at /contact — a link that
                names a thing the site does not have, and hands you a contact
                form when you click it. There is no customer login on this
                domain; the product signs in elsewhere. Removed rather than
                relabelled, because the CTA beside it already covers the only
                action a visitor can actually take. */}
            {/* Wrapped, because .btn is unlayered CSS and beats a utility's
                display; the padding overrides need their ! for the same reason. */}
            <span className="max-[339px]:hidden">
              <Link
                href="/contact"
                className="btn btn-primary btn-sm max-sm:whitespace-nowrap max-sm:!px-3"
              >
                {nav.cta}
                <Arrow width={16} height={16} className="flip-rtl hidden sm:block" />
              </Link>
            </span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t("openMenu")}
              className="grid h-10 w-10 place-items-center rounded-xl text-ink-2 transition-colors hover:bg-line md:hidden"
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`nav-scrim md:hidden ${open ? "is-open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`nav-drawer bg-surface shadow-2xl md:hidden ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-line px-5">
          <Logo locale={locale} />
          <span className="ms-auto">
            <ThemeToggle />
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("closeMenu")}
            className="grid h-10 w-10 place-items-center rounded-xl text-ink-2 transition-colors hover:bg-line"
            tabIndex={open ? 0 : -1}
          >
            <Close />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {nav.links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="flex items-baseline gap-3 rounded-xl border-b border-line px-3 py-3 text-base font-semibold text-ink-2 transition-colors hover:bg-brand-soft hover:text-brand"
            >
              <span className="t-index text-xs text-ink-dim" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              {l.label}
            </Link>
          ))}
          <Link
            href={pathname}
            locale={other}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="rounded-xl px-3 py-3 text-base font-semibold text-ink-2 transition-colors hover:bg-brand-soft hover:text-brand"
          >
            {t("switchLanguage")}
          </Link>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="btn btn-primary mt-3"
          >
            {nav.cta}
            <Arrow width={16} height={16} className="flip-rtl" />
          </Link>
        </nav>
      </aside>
    </>
  );
}
