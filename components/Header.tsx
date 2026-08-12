"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { getContent } from "@/content";
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
 */
export default function Header() {
  const locale = useLocale();
  const t = useTranslations("a11y");
  const pathname = usePathname();
  const c = getContent(locale);

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

          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle />
            <Link
              href={pathname}
              locale={other}
              className="hidden rounded-full border border-line px-3 py-1.5 text-xs font-bold text-ink-2 transition-colors hover:border-caramel hover:text-caramel sm:inline-flex"
            >
              {t("switchLanguage")}
            </Link>
            <Link
              href="/contact"
              className="hidden text-sm font-semibold text-ink-2 transition-colors hover:text-brand lg:inline-flex"
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
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-2 md:hidden"
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
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-2"
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
              className="rounded-xl px-3 py-3 text-base font-semibold text-ink-2 transition-colors hover:bg-brand-soft hover:text-brand"
            >
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
            {c.nav.cta}
            <Arrow width={16} height={16} className="flip-rtl" />
          </Link>
        </nav>
      </aside>
    </>
  );
}
