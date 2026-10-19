/**
 * Consent core — the one consent design shared by the Devya and Moving sites
 * (docs/compliance/consent-design.md). Framework-free on purpose: the React
 * bindings sit in `./react.ts`, and the same file is copied verbatim into each
 * site, so a fix here is a fix everywhere. Keep site specifics in the config.
 *
 * The rule it enforces (ePrivacy Art. 5(3), GDPR Art. 4(11), 6(1)(a), 7):
 * nothing outside "strictly necessary" may read or write the visitor's device,
 * or call a third party, until they opt in to that category — and a refusal,
 * a partial choice and a later withdrawal are each one click, the same size
 * as the acceptance.
 */

export const CONSENT_CATEGORIES = ["preferences", "analytics", "marketing"] as const;
export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number];
export type ConsentChoices = Record<ConsentCategory, boolean>;

/** What the visitor pressed — kept in the record and the receipt. */
export type ConsentAction = "accept_all" | "reject_all" | "save";

/** One stored answer. Holds no personal data: `id` is random, not a visitor ID. */
export interface ConsentRecord {
  v: 2;
  id: string;
  /** ISO 8601, when the choice was made. */
  at: string;
  /** The cookie-policy version the visitor answered. A new version asks again. */
  policy: string;
  choices: ConsentChoices;
  action: ConsentAction;
}

/**
 * `pending` — the server render and the hydrating render: we cannot know yet,
 *             so nothing optional runs and no banner shows (no flash for a
 *             visitor who has already answered).
 * `unset`   — no valid answer on this device: the banner shows.
 * `set`     — an answer: categories run exactly as it says.
 */
export type ConsentSnapshot =
  | { status: "pending" }
  | { status: "unset" }
  | { status: "set"; record: ConsentRecord };

export interface ConsentConfig {
  /** localStorage key, site-prefixed and versioned, e.g. "moving.consent.v2". */
  storageKey: string;
  /** Bump when the vendor list or the cookie policy changes meaningfully. */
  policyVersion: string;
  /** An answer older than this is asked again (CNIL: about 6 months). */
  maxAgeDays: number;
  /** The optional categories this site really uses, in panel order. */
  categories: readonly ConsentCategory[];
  /** Same-origin endpoint that keeps the consent receipt (Art. 7(1)). */
  receiptUrl?: string;
  /** Older consent keys to delete — a new design never inherits an old yes. */
  legacyKeys?: readonly string[];
  /**
   * What each category leaves on the device, cleared when it is withdrawn.
   * Strings match a cookie/storage name exactly or as a prefix ending in `*`.
   */
  cleanup?: Partial<Record<ConsentCategory, { cookies?: readonly string[]; storage?: readonly string[] }>>;
}

export const CONSENT_CHANGE_EVENT = "consent:change";
export const CONSENT_OPEN_EVENT = "consent:open";

const PENDING: ConsentSnapshot = { status: "pending" };
const UNSET: ConsentSnapshot = { status: "unset" };
const DAY_MS = 86_400_000;

export interface ConsentApi {
  readonly config: ConsentConfig;
  read(): ConsentSnapshot;
  serverSnapshot(): ConsentSnapshot;
  subscribe(onChange: () => void): () => void;
  allows(snapshot: ConsentSnapshot, category: ConsentCategory): boolean;
  acceptAll(): void;
  rejectAll(): void;
  save(choices: Partial<ConsentChoices>): void;
  /** Opens the preferences panel from anywhere (footer link, policy page). */
  openPreferences(): void;
}

export function createConsent(config: ConsentConfig): ConsentApi {
  // The snapshot must be referentially stable between reads of the same raw
  // value, or useSyncExternalStore re-renders forever.
  let cachedRaw: string | null | undefined;
  let cachedSnapshot: ConsentSnapshot = UNSET;
  // Used when storage throws (private mode, blocked): the answer still holds
  // for this page view, and nothing optional runs on the next one.
  let memoryRaw: string | null = null;
  let migrated = false;

  function getRaw(): string | null {
    try {
      return window.localStorage.getItem(config.storageKey) ?? memoryRaw;
    } catch {
      return memoryRaw;
    }
  }

  function parse(raw: string | null): ConsentSnapshot {
    if (!raw) return UNSET;
    try {
      const r = JSON.parse(raw) as Partial<ConsentRecord>;
      if (r.v !== 2 || typeof r.id !== "string" || typeof r.at !== "string") return UNSET;
      if (r.policy !== config.policyVersion) return UNSET;
      const at = Date.parse(r.at);
      if (!Number.isFinite(at) || Date.now() - at > config.maxAgeDays * DAY_MS) return UNSET;
      const c = (r.choices ?? {}) as Partial<ConsentChoices>;
      const choices = Object.fromEntries(
        CONSENT_CATEGORIES.map((k) => [k, config.categories.includes(k) && c[k] === true]),
      ) as ConsentChoices;
      return {
        status: "set",
        record: { v: 2, id: r.id, at: r.at, policy: r.policy, choices, action: r.action ?? "save" },
      };
    } catch {
      return UNSET;
    }
  }

  function dropLegacy() {
    if (migrated) return;
    migrated = true;
    for (const key of config.legacyKeys ?? []) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        /* nothing to clean */
      }
    }
  }

  function read(): ConsentSnapshot {
    if (typeof window === "undefined") return PENDING;
    dropLegacy();
    const raw = getRaw();
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedSnapshot = parse(raw);
    }
    return cachedSnapshot;
  }

  function allows(snapshot: ConsentSnapshot, category: ConsentCategory): boolean {
    return snapshot.status === "set" && snapshot.record.choices[category] === true;
  }

  function write(choices: ConsentChoices, action: ConsentAction) {
    const before = read();
    const record: ConsentRecord = {
      v: 2,
      id: randomId(),
      at: new Date().toISOString(),
      policy: config.policyVersion,
      choices,
      action,
    };
    const raw = JSON.stringify(record);
    memoryRaw = raw;
    try {
      window.localStorage.setItem(config.storageKey, raw);
    } catch {
      /* kept in memory for this page view */
    }
    sendReceipt(record);
    const revoked = CONSENT_CATEGORIES.filter((k) => allows(before, k) && !choices[k]);
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT));
    if (revoked.length > 0) {
      clearCategories(revoked);
      // A script that already ran cannot be unloaded; a reload is the only
      // way a withdrawal takes effect at once rather than on the next visit.
      window.location.reload();
    }
  }

  function sendReceipt(record: ConsentRecord) {
    if (!config.receiptUrl) return;
    const body = JSON.stringify({
      id: record.id,
      at: record.at,
      policy: record.policy,
      choices: record.choices,
      action: record.action,
      locale: document.documentElement.lang || null,
    });
    try {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon?.(config.receiptUrl, blob)) return;
    } catch {
      /* fall through to fetch */
    }
    void fetch(config.receiptUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => {
      /* the device record still stands; the receipt is best effort */
    });
  }

  function clearCategories(categories: readonly ConsentCategory[]) {
    for (const category of categories) {
      const rule = config.cleanup?.[category];
      if (!rule) continue;
      for (const name of cookieNames()) {
        if (matches(rule.cookies, name)) expireCookie(name);
      }
      for (const store of [safeStorage("localStorage"), safeStorage("sessionStorage")]) {
        if (!store) continue;
        for (const key of Object.keys(store)) {
          if (matches(rule.storage, key)) store.removeItem(key);
        }
      }
    }
  }

  return {
    config,
    read,
    serverSnapshot: () => PENDING,
    subscribe(onChange) {
      const onStorage = (e: StorageEvent) => {
        if (e.key === null || e.key === config.storageKey) onChange();
      };
      window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
      window.addEventListener("storage", onStorage);
      return () => {
        window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
        window.removeEventListener("storage", onStorage);
      };
    },
    allows,
    acceptAll: () => write(all(config, true), "accept_all"),
    rejectAll: () => write(all(config, false), "reject_all"),
    save: (choices) =>
      write(
        Object.fromEntries(
          CONSENT_CATEGORIES.map((k) => [k, config.categories.includes(k) && choices[k] === true]),
        ) as ConsentChoices,
        "save",
      ),
    openPreferences: () => window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT)),
  };
}

function all(config: ConsentConfig, value: boolean): ConsentChoices {
  return Object.fromEntries(
    CONSENT_CATEGORIES.map((k) => [k, value && config.categories.includes(k)]),
  ) as ConsentChoices;
}

function randomId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
}

function matches(patterns: readonly string[] | undefined, name: string): boolean {
  return (patterns ?? []).some((p) =>
    p.endsWith("*") ? name.startsWith(p.slice(0, -1)) : name === p,
  );
}

function cookieNames(): string[] {
  return document.cookie
    .split(";")
    .map((c) => c.split("=")[0]?.trim() ?? "")
    .filter(Boolean);
}

/** Expires a cookie on this host and on every parent domain it could sit on. */
function expireCookie(name: string) {
  const parts = window.location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i += 1) domains.push(`; domain=.${parts.slice(i).join(".")}`);
  for (const domain of domains) {
    document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
  }
}

function safeStorage(kind: "localStorage" | "sessionStorage"): Storage | null {
  try {
    return window[kind];
  } catch {
    return null;
  }
}
