/**
 * The help centre's search: a small in-browser ranker over an index built
 * from the article trees at build time (app/[locale]/docs/search.json). No
 * service, no third-party script — the site stays fully static.
 *
 * Matching is by substring on normalised text, so a query word matches inside
 * a longer word ("طلب" finds "الطلبات", "ship" finds "shipping"). Every query
 * word has to match somewhere in an entry; where it matches sets the score.
 */
export interface SearchEntry {
  /** Locale-less path, e.g. "/docs/selling/take-an-order". */
  href: string;
  title: string;
  /** The category's title, shown under the result. */
  category: string;
  summary: string;
  /** Section headings and step titles. */
  heads: string;
  keywords: string;
  /** The rest of the article's words. */
  body: string;
}

export interface SearchHit {
  entry: SearchEntry;
  score: number;
}

const FIELDS = [
  ["title", 10],
  ["keywords", 6],
  ["heads", 4],
  ["category", 3],
  ["summary", 3],
  ["body", 1],
] as const satisfies readonly (readonly [keyof SearchEntry, number])[];

type Field = (typeof FIELDS)[number][0];

/**
 * Folds the spellings a reader may type into one: Latin case, Arabic-Indic
 * digits, hamza seats on alef, alef maqsura, taa marbuta, diacritics and the
 * tatweel. Punctuation becomes a space.
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ً-ٰٟـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/**
 * A query word, trimmed to the part every form of it shares: the Arabic
 * article and its prefixed forms ("ال", "وال", "بال", "لل"), the commonest
 * Arabic plural endings, and an English plural "s". Substring matching does
 * the rest.
 */
export function stem(word: string): string {
  let w = word;
  const article = w.match(/^(?:وال|بال|فال|كال|لل|ال)(.{3,})$/);
  if (article) w = article[1];
  if (/[؀-ۿ]/.test(w)) {
    if (w.length >= 5 && w.endsWith("ات")) w = w.slice(0, -2);
    else if (w.length >= 6 && /(?:ين|ون)$/.test(w)) w = w.slice(0, -2);
  } else if (w.length >= 5 && w.endsWith("s") && !/(?:ss|us|is)$/.test(w)) {
    w = w.slice(0, -1);
  }
  return w;
}

export function queryTerms(query: string): string[] {
  const words = normalize(query).split(" ").filter((w) => w.length >= 2);
  return [...new Set(words.map(stem))];
}

/** An entry with its fields normalised once, so typing never re-normalises the index. */
export type PreparedEntry = { entry: SearchEntry; text: Record<Field, string> };

export function prepare(index: SearchEntry[]): PreparedEntry[] {
  return index.map((entry) => ({
    entry,
    text: Object.fromEntries(
      FIELDS.map(([f]) => [f, ` ${normalize(entry[f])} `]),
    ) as Record<Field, string>,
  }));
}

export function search(
  index: PreparedEntry[],
  query: string,
  limit = 8,
): SearchHit[] {
  const terms = queryTerms(query);
  if (terms.length === 0) return [];
  const phrase = normalize(query);

  const hits: SearchHit[] = [];
  for (const { entry, text } of index) {
    let score = 0;
    let matchedAll = true;
    for (const term of terms) {
      let best = 0;
      for (const [field, weight] of FIELDS) {
        const t = text[field];
        // A match at the start of a word counts more than one inside it, so
        // every occurrence is looked at, not only the first.
        for (let at = t.indexOf(term); at !== -1; at = t.indexOf(term, at + 1)) {
          const atWordStart = t[at - 1] === " ";
          best = Math.max(best, weight * (atWordStart ? 1.5 : 1));
          if (atWordStart) break;
        }
      }
      if (best === 0) {
        matchedAll = false;
        break;
      }
      score += best;
    }
    if (!matchedAll) continue;
    if (phrase.includes(" ") && text.title.includes(phrase)) score += 15;
    hits.push({ entry, score });
  }
  return hits
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, limit);
}
