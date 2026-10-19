import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_CHANGE_EVENT, CONSENT_OPEN_EVENT, createConsent, type ConsentConfig } from "@/lib/consent/core";

/*
 * The shared consent core (docs/compliance/consent-design.md), exercised on a
 * minimal fake browser so it runs in vitest's node environment. Copied with
 * the core to every site; keep it identical there too.
 */

class MemoryStorage {
  private map = new Map<string, string>();
  getItem(k: string) {
    return this.map.has(k) ? (this.map.get(k) as string) : null;
  }
  setItem(k: string, v: string) {
    this.map.set(k, String(v));
  }
  removeItem(k: string) {
    this.map.delete(k);
  }
  keys() {
    return [...this.map.keys()];
  }
}

let local: MemoryStorage;
let cookies: Map<string, string>;
let events: string[];
let beacons: { url: string; body: string }[];
let reloads: number;

function proxyStorage(store: MemoryStorage) {
  return new Proxy(store, {
    ownKeys: () => store.keys(),
    getOwnPropertyDescriptor: (_t, k) =>
      store.keys().includes(String(k)) ? { enumerable: true, configurable: true, value: store.getItem(String(k)) } : undefined,
  });
}

beforeEach(() => {
  local = new MemoryStorage();
  cookies = new Map([["_ga", "1"], ["_ga_ABC", "2"], ["keep", "3"]]);
  events = [];
  beacons = [];
  reloads = 0;
  const listeners = new Map<string, Set<(e: Event) => void>>();
  vi.stubGlobal("window", {
    localStorage: proxyStorage(local),
    sessionStorage: proxyStorage(new MemoryStorage()),
    location: { hostname: "www.example.com", reload: () => (reloads += 1) },
    addEventListener: (t: string, f: (e: Event) => void) => {
      if (!listeners.has(t)) listeners.set(t, new Set());
      listeners.get(t)!.add(f);
    },
    removeEventListener: (t: string, f: (e: Event) => void) => listeners.get(t)?.delete(f),
    dispatchEvent: (e: Event) => {
      events.push(e.type);
      listeners.get(e.type)?.forEach((f) => f(e));
      return true;
    },
  });
  vi.stubGlobal("document", {
    documentElement: { lang: "ar" },
    get cookie() {
      return [...cookies.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
    },
    set cookie(v: string) {
      const [pair] = v.split(";");
      const [name] = pair.split("=");
      if (/Max-Age=0/.test(v)) cookies.delete(name.trim());
    },
  });
  vi.stubGlobal("navigator", {
    sendBeacon: (url: string, blob: Blob) => {
      void blob.text().then((body) => beacons.push({ url, body }));
      return true;
    },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const config: ConsentConfig = {
  storageKey: "test.consent.v2",
  policyVersion: "2026-10-19",
  maxAgeDays: 180,
  categories: ["analytics", "marketing"],
  receiptUrl: "/api/consent",
  legacyKeys: ["old.consent"],
  cleanup: { analytics: { cookies: ["_ga*"] } },
};

describe("consent core", () => {
  it("is pending on the server and unset on a first visit", () => {
    const c = createConsent(config);
    expect(c.serverSnapshot()).toEqual({ status: "pending" });
    expect(c.read()).toEqual({ status: "unset" });
  });

  it("allows nothing until the visitor opts in", () => {
    const c = createConsent(config);
    for (const k of ["preferences", "analytics", "marketing"] as const) {
      expect(c.allows(c.read(), k)).toBe(false);
      expect(c.allows(c.serverSnapshot(), k)).toBe(false);
    }
  });

  it("accept all grants only the categories the site uses", () => {
    const c = createConsent(config);
    c.acceptAll();
    const s = c.read();
    expect(s.status).toBe("set");
    if (s.status !== "set") return;
    expect(s.record.choices).toEqual({ preferences: false, analytics: true, marketing: true });
    expect(s.record.action).toBe("accept_all");
    expect(s.record.policy).toBe("2026-10-19");
    expect(events).toContain(CONSENT_CHANGE_EVENT);
  });

  it("reject all stores a refusal, so the banner does not come back", () => {
    const c = createConsent(config);
    c.rejectAll();
    const s = c.read();
    expect(s.status).toBe("set");
    if (s.status === "set") expect(Object.values(s.record.choices).some(Boolean)).toBe(false);
  });

  it("save keeps a partial choice and ignores categories the site does not use", () => {
    const c = createConsent(config);
    c.save({ analytics: true, preferences: true });
    const s = c.read();
    if (s.status !== "set") throw new Error("expected a record");
    expect(s.record.choices).toEqual({ preferences: false, analytics: true, marketing: false });
  });

  it("returns the same snapshot object until the stored value changes", () => {
    const c = createConsent(config);
    c.acceptAll();
    expect(c.read()).toBe(c.read());
  });

  it("asks again after maxAgeDays or a new policy version", () => {
    const c = createConsent(config);
    c.acceptAll();
    const raw = JSON.parse(local.getItem(config.storageKey)!);
    local.setItem(config.storageKey, JSON.stringify({ ...raw, at: new Date(Date.now() - 181 * 86_400_000).toISOString() }));
    expect(c.read().status).toBe("unset");
    local.setItem(config.storageKey, JSON.stringify({ ...raw, policy: "2025-01-01" }));
    expect(createConsent(config).read().status).toBe("unset");
  });

  it("never inherits a legacy yes", () => {
    local.setItem("old.consent", "granted");
    const c = createConsent(config);
    expect(c.read().status).toBe("unset");
    expect(local.getItem("old.consent")).toBeNull();
  });

  it("treats garbage as no answer", () => {
    local.setItem(config.storageKey, "{not json");
    expect(createConsent(config).read().status).toBe("unset");
  });

  it("sends a receipt with no personal data", async () => {
    const c = createConsent(config);
    c.save({ analytics: true });
    await new Promise((r) => setTimeout(r, 0));
    expect(beacons).toHaveLength(1);
    expect(beacons[0].url).toBe("/api/consent");
    const body = JSON.parse(beacons[0].body);
    expect(Object.keys(body).sort()).toEqual(["action", "at", "choices", "id", "locale", "policy"]);
    expect(body.locale).toBe("ar");
  });

  it("withdrawal clears the category's cookies and reloads", () => {
    const c = createConsent(config);
    c.acceptAll();
    expect(reloads).toBe(0);
    c.save({ analytics: false, marketing: true });
    expect(cookies.has("_ga")).toBe(false);
    expect(cookies.has("_ga_ABC")).toBe(false);
    expect(cookies.has("keep")).toBe(true);
    expect(reloads).toBe(1);
  });

  it("granting more never reloads", () => {
    const c = createConsent(config);
    c.rejectAll();
    c.acceptAll();
    expect(reloads).toBe(0);
  });

  it("openPreferences asks the panel to open", () => {
    createConsent(config).openPreferences();
    expect(events).toContain(CONSENT_OPEN_EVENT);
  });

  it("a site with no optional category grants nothing even on accept", () => {
    const c = createConsent({ ...config, categories: [] });
    c.acceptAll();
    const s = c.read();
    if (s.status !== "set") throw new Error("expected a record");
    expect(Object.values(s.record.choices).some(Boolean)).toBe(false);
  });
});
