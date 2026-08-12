/**
 * Locale-aware number formatting.
 *
 * `ar-EG` renders Arabic-Indic digits (٣٩٩), which is what the market reads and
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
