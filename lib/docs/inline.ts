/**
 * The three inline marks the help centre's prose may carry (content/docs/types.ts):
 *
 *   **Label**               a UI label, as the screen shows it
 *   `value`                 a literal — a URL, a code, a number — set as one LTR run
 *   [text](href)            a link: "/docs/<category>/<slug>" or an https URL
 *
 * Anything else is text. Marks do not nest; an unclosed one is left as typed.
 */
export type InlineToken =
  | { k: "text"; v: string }
  | { k: "ui"; v: string }
  | { k: "code"; v: string }
  | { k: "link"; v: string; href: string };

const MARK = /\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function parseInline(text: string): InlineToken[] {
  const out: InlineToken[] = [];
  let last = 0;
  for (const m of text.matchAll(MARK)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ k: "text", v: text.slice(last, at) });
    if (m[1] !== undefined) out.push({ k: "ui", v: m[1] });
    else if (m[2] !== undefined) out.push({ k: "code", v: m[2] });
    else out.push({ k: "link", v: m[3], href: m[4] });
    last = at + m[0].length;
  }
  if (last < text.length) out.push({ k: "text", v: text.slice(last) });
  return out;
}

/** The words of a marked-up string, marks removed — for the search index and meta tags. */
export function plainText(text: string): string {
  return parseInline(text)
    .map((t) => t.v)
    .join("");
}

/** Every link target in a marked-up string. */
export function inlineLinks(text: string): string[] {
  return parseInline(text).flatMap((t) => (t.k === "link" ? [t.href] : []));
}
