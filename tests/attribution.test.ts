import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/*
 * The campaign record is the one optional thing on this site: it must not be
 * written or read without the "marketing" consent category, whoever calls it.
 */

function storage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    map,
  };
}

let local: ReturnType<typeof storage>;
let session: ReturnType<typeof storage>;

beforeEach(() => {
  vi.resetModules();
  local = storage();
  session = storage();
  vi.stubGlobal("window", {
    localStorage: local,
    sessionStorage: session,
    location: { pathname: "/ar", search: "?utm_source=meta&utm_campaign=eg", origin: "https://pos.devya.dev", hostname: "pos.devya.dev", reload: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  });
  vi.stubGlobal("document", { referrer: "https://www.facebook.com/", cookie: "", documentElement: { lang: "ar" } });
  vi.stubGlobal("navigator", { sendBeacon: () => true });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("first-touch attribution", () => {
  it("writes and reads nothing before consent", async () => {
    const { captureFirstTouch, readAttribution } = await import("@/lib/analytics");
    expect(captureFirstTouch()).toBeNull();
    expect(readAttribution()).toBeNull();
    expect(session.map.size).toBe(0);
  });

  it("writes nothing after a refusal", async () => {
    const { consent } = await import("@/lib/consent/config");
    const { captureFirstTouch } = await import("@/lib/analytics");
    consent.rejectAll();
    expect(captureFirstTouch()).toBeNull();
    expect(session.map.size).toBe(0);
  });

  it("records the campaign once marketing is allowed", async () => {
    const { consent } = await import("@/lib/consent/config");
    const { captureFirstTouch, readAttribution } = await import("@/lib/analytics");
    consent.acceptAll();
    expect(captureFirstTouch()?.source).toBe("meta");
    expect(readAttribution()?.campaign).toBe("eg");
  });
});
