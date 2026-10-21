/**
 * Locale-aware number formatting, and reading such numbers back.
 *
 * `ar-EG` renders Arabic-Indic digits (١٩٩), which is what the market reads and
 * what the incumbent's pricing card shows. Everything here is deterministic for
 * a given locale so server and client render identically.
 */
const cache = new Map<string, Intl.NumberFormat>();

function nf(locale: string, options: Intl.NumberFormatOptions) {
  const key = `${locale}:${JSON.stringify(options)}`;
  let fmt = cache.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", options);
    cache.set(key, fmt);
  }
  return fmt;
}

export function formatNumber(locale: string, value: number) {
  return nf(locale, { maximumFractionDigits: 0 }).format(value);
}

/** Rounds to whole pounds — cents never appear in marketing figures. */
export function formatEgp(locale: string, value: number) {
  return nf(locale, { maximumFractionDigits: 0 }).format(Math.round(value));
}

export function formatPercent(locale: string, value: number) {
  return nf(locale, { maximumFractionDigits: 0 }).format(value);
}

/**
 * The reverse of `ar-EG` formatting: Arabic-Indic (U+0660–U+0669) and
 * Extended Arabic-Indic (U+06F0–U+06F9) digits → ASCII. Everything else is
 * left as it was.
 *
 * An Arabic keyboard on an Egyptian phone types ٠١٠٥٥…, and a number typed
 * that way is a real number, not a typo, so every validator folds before it
 * reads digits. The one copy: the lead form, the trial form and the store's
 * claim route (bohub-pos ops-store, same rule) must never disagree on what a
 * digit is.
 */
export function foldDigits(value: string): string {
  return value.replace(/[٠-٩۰-۹]/g, (ch) => {
    const code = ch.charCodeAt(0);
    return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
  });
}

/**
 * A calendar date (`YYYY-MM-DD`) as the page's language writes it: "4 September
 * 2026", "٤ سبتمبر ٢٠٢٦". Formatted in UTC because a date-only ISO string parses
 * as UTC midnight, and any zone west of it would print the day before.
 */
export function formatDate(locale: string, iso: string) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
