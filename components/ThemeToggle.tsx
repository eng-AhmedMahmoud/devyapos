"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

export const THEME_KEY = "sufra-theme";

/**
 * Inlined in <head> so the stored theme is applied before first paint.
 *
 * Without this the page would render in the OS theme and then snap to the
 * stored one on hydration — a full-page flash on every navigation. Kept as a
 * string constant so the script and the component below can never drift on the
 * storage key or the attribute they agree on.
 */
export const themeBootScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)});if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;

/** Theme lives on the document element, so it is read through the store API. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  window.addEventListener("storage", onChange);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onChange);
  };
}

function isDark() {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr) return attr === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const t = useTranslations("a11y");
  // Server snapshot is `false`: the markup is theme-agnostic (both glyphs ship,
  // CSS picks one), so the initial value only matters for the aria label.
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  function toggle() {
    const next = isDark() ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private mode / storage disabled — the theme still applies for this page.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? t("themeLight") : t("themeDark")}
      title={dark ? t("themeLight") : t("themeDark")}
      className={`grid h-9 w-9 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-caramel hover:text-caramel ${className}`}
    >
      {/* Sun and moon both render; the stylesheet hides the wrong one, so the
          icon is correct even before hydration. */}
      <svg
        viewBox="0 0 24 24"
        width={17}
        height={17}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        aria-hidden="true"
        className="hidden dark:block"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        width={17}
        height={17}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="block dark:hidden"
      >
        <path d="M20 13.4A8.2 8.2 0 0 1 10.6 4a8.4 8.4 0 1 0 9.4 9.4Z" />
      </svg>
    </button>
  );
}
