"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { getContent } from "@/content";
import { Arrow, Close, Menu } from "./icons";
import Logo from "./Logo";

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/** 12px of travel is enough to mean "the hero is no longer under the bar". */
function isScrolled() {
  return window.scrollY > 12;
}

/**
 * Fixed header: transparent over the hero, then a blurred white bar with a
 * hairline border once the page scrolls — the same behaviour the category
 * leader trained this market on.
 */
export default function Header() {
  const locale = useLocale();
  const t = useTranslations("a11y");
  const pathname = usePathname();
  const c = getContent(locale);

  const [open, setOpen] = useState(false);

  // Scroll position is external state, so it is read through the store API
  // rather than mirrored into React state from an effect. The server snapshot
  // is `false` so SSR always renders the transparent-over-hero variant.
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
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:h-[4.5rem] sm:px-8">
          <Link href="/" aria-label={t("home")} className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {c.nav.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="nav-link"
                data-active={pathname === l.href}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={pathname}
              locale={other}
              className="hidden rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:border-brand-300 hover:text-brand sm:inline-flex"
            >
              {t("switchLanguage")}
            </Link>
            <Link
              href="/contact"
              className="hidden text-sm font-medium text-ink-2 transition-colors hover:text-brand sm:inline-flex"
            >
              {c.nav.login}
            </Link>
            <Link href="/contact" className="btn btn-primary !px-4 !py-2.5 text-sm">
              {c.nav.cta}
              <Arrow width={16} height={16} className="flip-rtl" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t("openMenu")}
              className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink-2 md:hidden"
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
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("closeMenu")}
            className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink-2"
            tabIndex={open ? 0 : -1}
          >
            <Close />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {c.nav.links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="rounded-lg px-3 py-3 text-base font-medium text-ink-2 transition-colors hover:bg-brand-50 hover:text-brand"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={pathname}
            locale={other}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="rounded-lg px-3 py-3 text-base font-medium text-ink-2 transition-colors hover:bg-brand-50 hover:text-brand"
          >
            {t("switchLanguage")}
          </Link>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="btn btn-primary mt-3"
          >
            {c.nav.cta}
            <Arrow width={16} height={16} className="flip-rtl" />
          </Link>
        </nav>
      </aside>
    </>
  );
}
