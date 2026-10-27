import type { IconName } from "@/components/docs/DocIcon";
import type { ShotId, SurfaceName } from "./shots";

/**
 * The help centre's copy, typed like the rest of the site's (content/types.ts):
 * Arabic and English are two trees of the same shape — same categories, same
 * article slugs, same blocks in the same order, same screenshot ids — and
 * tests/help-centre.test.ts fails the moment they drift.
 *
 * The model is the one the Moving family's umbrella help centre uses
 * (movingsystems.tech/docs, the moving-landing repo); this site keeps only its
 * Moving POS guides and groups them by who reads them instead of by product.
 *
 * Nothing here may describe a feature the product code does not ship. Each
 * article carries a comment above it in the Arabic tree naming the paths in
 * `~/Projects/bohub-pos` it was checked against; `reviewed` is the day that
 * check ran.
 *
 * Inline text is plain prose with three marks, parsed by lib/docs/inline.ts:
 *   **Label**                 a UI label, set the way the screen shows it
 *   `value`                   a literal (a URL, a code, a number) — one LTR run
 *   [text](/docs/cat/slug)    a link to another article (or an https URL)
 */

/**
 * Who a category is for, which is how the front page and the sidebar group
 * them: the owner setting the restaurant up, the people running a shift, and
 * the owner reading the numbers and connecting the rest.
 */
export type DocGroup = "setup" | "daily" | "grow";

/**
 * A screenshot slot. The id keys the capture manifest (content/docs/shots.ts).
 * More than one article may show the same slot — a role journey reuses a task
 * article's screen — each with its own alt and caption.
 */
export interface DocShot {
  id: ShotId;
  /** What the screen shows, for a reader who cannot see it. */
  alt: string;
  /** The line under the figure. */
  caption: string;
}

export interface DocStep {
  title: string;
  body?: string;
  shot?: DocShot;
}

export type DocBlock =
  | { t: "p"; text: string }
  /** A section of the article; its id anchors the "on this page" list. */
  | { t: "h2"; id: string; text: string }
  | { t: "h3"; text: string }
  | { t: "steps"; items: DocStep[] }
  | { t: "list"; items: string[] }
  | { t: "callout"; tone: "note" | "tip" | "warning"; text: string }
  | { t: "shot"; shot: DocShot }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "qa"; items: { q: string; a: string }[] };

export interface DocArticle {
  /** URL segment, shared by both locales: lowercase kebab-case, Latin. */
  slug: string;
  title: string;
  /** One or two sentences: what the article answers. Also the meta description. */
  summary: string;
  /** Extra words a reader might search with (synonyms, the other script's names). */
  keywords: string[];
  /** ISO date the article was last checked against the product code. */
  reviewed: string;
  /** "Before you start": what has to be true first. Empty when nothing is. */
  before: string[];
  body: DocBlock[];
  /** Other articles, as "category/slug". */
  related: string[];
}

export interface DocCategory {
  /** URL segment, shared by both locales. */
  id: string;
  group: DocGroup;
  icon: IconName;
  title: string;
  description: string;
  articles: DocArticle[];
}

/**
 * A count phrase in CLDR plural forms — Arabic needs all six. "{count}" is
 * replaced; `other` is the fallback (lib/docs/plural.ts).
 */
export type Plural = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

/** The help centre's own words: the chrome around the articles. */
export interface DocsUi {
  /** The name of the section, in the nav, the breadcrumbs and the titles. */
  name: string;
  /** Accessible name of the breadcrumb trail. */
  breadcrumb: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  search: {
    label: string;
    placeholder: string;
    submit: string;
    loading: string;
    empty: string;
    hint: string;
    /** "{query}" is replaced too. */
    resultsCount: Plural;
    noQuery: string;
  };
  groups: Record<DocGroup, { title: string; body: string }>;
  /** The app a screenshot was taken in, printed on the figure's frame. */
  surfaces: Record<SurfaceName, string>;
  startHere: string;
  /** The link beside "Start here", to the first category. */
  startAll: string;
  popular: string;
  articles: string;
  articleCount: Plural;
  browse: string;
  onThisPage: string;
  before: string;
  reviewed: string;
  related: string;
  previous: string;
  next: string;
  stepLabel: string;
  figure: string;
  callout: Record<"note" | "tip" | "warning", string>;
  shotPending: string;
  shotPendingBody: string;
  help: {
    title: string;
    body: string;
    whatsapp: string;
    whatsappText: string;
    /** The just-in-time notice under the button: the chat goes through Meta. */
    privacyNote: string;
  };
  searchPage: { title: string };
}

export interface DocsContent {
  ui: DocsUi;
  /** The numbered "Start here" track on the front page, as "category/slug" (01–05). */
  startHere: string[];
  /** Articles offered under the search box, as "category/slug". */
  popular: string[];
  /** In reading order: getting started first, the FAQ last. */
  categories: DocCategory[];
}
