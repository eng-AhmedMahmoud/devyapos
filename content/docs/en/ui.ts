import type { DocsUi } from "../types";

/* Follows content/docs/ar/ui.ts key for key. */
export const ui: DocsUi = {
  name: "Help centre",
  breadcrumb: "Breadcrumb",
  eyebrow: "Help centre",
  title: "How can we help today?",
  subtitle:
    "Guides written from inside Moving POS itself, step by step with screenshots — for the owner setting the restaurant up, and for the cashier and the branch team on a working day.",
  search: {
    label: "Search the help centre",
    placeholder: "Search: add a product, open a shift, connect Paymob…",
    submit: "Search",
    loading: "Loading the index…",
    empty: "No results. Try a shorter word, or the screen's name as the app shows it.",
    hint: "↑ ↓ to move · Enter to open · Esc to close",
    resultsCount: {
      zero: "No results for “{query}”",
      one: "1 result for “{query}”",
      two: "{count} results for “{query}”",
      few: "{count} results for “{query}”",
      many: "{count} results for “{query}”",
      other: "{count} results for “{query}”",
    },
    noQuery: "Type what you are looking for in the box above.",
  },
  groups: {
    setup: {
      title: "Set up your restaurant",
      body: "For the owner: the account, the menu, staff and permissions, payments, printers and branches.",
    },
    daily: {
      title: "The working day",
      body: "For the cashier and the branch team: a shift from opening to close, orders from the till and the site, the kitchen and the stock.",
    },
    grow: {
      title: "Numbers and connections",
      body: "Reports, the AI assistant, loyalty points, and the other systems Moving POS connects to.",
    },
  },
  surfaces: {
    "pos-admin": "Back office",
    "pos-register": "Register",
    "pos-ordering": "Ordering site",
  },
  startHere: "Start here",
  startAll: "All getting-started guides",
  popular: "Most read",
  articles: "All articles",
  articleCount: {
    zero: "No articles",
    one: "1 article",
    two: "{count} articles",
    few: "{count} articles",
    many: "{count} articles",
    other: "{count} articles",
  },
  browse: "Browse topics",
  onThisPage: "On this page",
  before: "Before you start",
  reviewed: "Checked against the product on",
  related: "Related articles",
  previous: "Previous",
  next: "Next",
  stepLabel: "Step",
  figure: "Fig.",
  callout: { note: "Note", tip: "Tip", warning: "Warning" },
  shotPending: "Screenshot on its way",
  shotPendingBody: "A capture of the {surface} appears here once it is taken.",
  help: {
    title: "Still need a hand?",
    body: "Message us on WhatsApp and the team that built Moving POS answers.",
    whatsapp: "Message us on WhatsApp",
    whatsappText: "Hello, I need help from the help centre",
    privacyNote: "WhatsApp messages reach us through Meta. How we handle them: [privacy policy](/privacy).",
  },
  searchPage: { title: "Search results" },
};
