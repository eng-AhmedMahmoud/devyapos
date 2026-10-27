import type { Plural } from "@/content/docs/types";

/**
 * Picks the CLDR plural form for a count and fills it in. English only ever
 * uses "one" and "other", but both trees carry the same six keys so the
 * shape test holds; "{count}" is set with Latin digits like every number on
 * the site.
 */
export function plural(
  locale: string,
  forms: Plural,
  count: number,
  vars: Record<string, string> = {},
): string {
  const rule = new Intl.PluralRules(locale).select(count);
  const form = count === 0 && forms.zero ? forms.zero : (forms[rule] ?? forms.other);
  return Object.entries({ count: String(count), ...vars }).reduce(
    // A replacer function, so a "$&" in the reader's query stays literal.
    (s, [k, v]) => s.replaceAll(`{${k}}`, () => v),
    form,
  );
}
