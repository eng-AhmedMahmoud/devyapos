import { mkdtempSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { checkConfig, logConfigReport, releaseId, type ConfigReport } from "@/lib/env";

/*
 * The boot-time config check (lib/env.ts), GET /api/health and the
 * instrumentation hook that runs the check. A forward token stands in for
 * every value that must never appear in a log line or the health answer.
 */

const HIDDEN = "hidden-9f8e7d6c5b4a";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.resetModules();
});

function scratch(): string {
  return mkdtempSync(join(tmpdir(), "env-test-"));
}

describe("checkConfig", () => {
  it("accepts an environment with nothing set (development)", async () => {
    expect(await checkConfig({})).toEqual({ ok: true, problems: [], forward: "unset", outbox: "unset" });
  });

  it("accepts the production shape: an https forward and a writable outbox", async () => {
    const dir = scratch();
    const report = await checkConfig({
      NODE_ENV: "production",
      LEAD_FORWARD_URL: `https://crm.example.invalid/hook?key=${HIDDEN}`,
      LEAD_FORWARD_TOKEN: HIDDEN,
      LEAD_FORWARD_TIMEOUT_MS: "4000",
      LEAD_OUTBOX_DIR: dir,
      LEAD_OUTBOX_RETENTION_DAYS: " 365 ",
    });
    expect(report).toEqual({ ok: true, problems: [], forward: "configured", outbox: "writable" });
    // The probe file is gone again.
    expect(readdirSync(dir)).toEqual([]);
  });

  it.each([
    ["not a url", "not_a_url"],
    [`crm.example.invalid/${HIDDEN}`, "not_a_url"],
    [`http://crm.example.invalid/${HIDDEN}`, "not_https"],
    ["ftp://crm.example.invalid/hook", "not_https"],
  ])("refuses LEAD_FORWARD_URL=%s (%s)", async (value, problem) => {
    const report = await checkConfig({ LEAD_FORWARD_URL: value });
    expect(report.ok).toBe(false);
    expect(report.forward).toBe("invalid");
    expect(report.problems).toEqual([{ variable: "LEAD_FORWARD_URL", problem }]);
    expect(JSON.stringify(report)).not.toContain(HIDDEN);
  });

  it.each(["LEAD_FORWARD_TIMEOUT_MS", "LEAD_OUTBOX_RETENTION_DAYS"])(
    "refuses %s unless it round-trips as a positive number",
    async (name) => {
      for (const value of ["4000ms", "1e3", "0x10", "Infinity", "abc", "04000", "  "]) {
        const report = await checkConfig({ [name]: value });
        expect(report.problems, value).toEqual([{ variable: name, problem: "not_a_number" }]);
      }
      for (const value of ["0", "-5"]) {
        const report = await checkConfig({ [name]: value });
        expect(report.problems, value).toEqual([{ variable: name, problem: "not_positive" }]);
      }
      for (const value of ["4000", "1.5", " 30 ", ""]) {
        expect((await checkConfig({ [name]: value })).ok, value).toBe(true);
      }
    },
  );

  it("refuses an outbox directory that cannot be written", async () => {
    const file = join(scratch(), "a-file");
    writeFileSync(file, "");
    const report = await checkConfig({ LEAD_OUTBOX_DIR: join(file, "outbox") });
    expect(report.outbox).toBe("unwritable");
    expect(report.problems).toEqual([{ variable: "LEAD_OUTBOX_DIR", problem: "not_writable" }]);
  });

  it("refuses production with nowhere durable for a lead to go", async () => {
    const report = await checkConfig({ NODE_ENV: "production" });
    expect(report.problems).toEqual([
      { variable: "LEAD_FORWARD_URL|LEAD_OUTBOX_DIR", problem: "no_lead_sink" },
    ]);
    // The outbox alone is enough; so is the forward alone.
    expect((await checkConfig({ NODE_ENV: "production", LEAD_OUTBOX_DIR: scratch() })).ok).toBe(true);
    expect(
      (await checkConfig({ NODE_ENV: "production", LEAD_FORWARD_URL: "https://crm.example.invalid/" })).ok,
    ).toBe(true);
  });
});

describe("logConfigReport", () => {
  it("logs one JSON line per problem, with names and codes only", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const report: ConfigReport = {
      ok: false,
      forward: "invalid",
      outbox: "unwritable",
      problems: [
        { variable: "LEAD_FORWARD_URL", problem: "not_https" },
        { variable: "LEAD_OUTBOX_DIR", problem: "not_writable" },
      ],
    };
    logConfigReport(report);
    expect(error).toHaveBeenCalledTimes(2);
    expect(info).not.toHaveBeenCalled();
    const lines = error.mock.calls.map(([line]) => JSON.parse(String(line)));
    expect(lines[0]).toEqual({
      level: "error",
      event: "config_problem",
      variable: "LEAD_FORWARD_URL",
      problem: "not_https",
    });
  });

  it("logs a single info line when all is well", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    logConfigReport({ ok: true, problems: [], forward: "unset", outbox: "writable" });
    expect(JSON.parse(String(info.mock.calls[0][0]))).toEqual({
      level: "info",
      event: "config_ok",
      forward: "unset",
      outbox: "writable",
    });
  });
});

describe("releaseId", () => {
  it("echoes a git SHA and nothing else", () => {
    const sha = "d6fca435d2085f0752d8930fbbe41fa032f6dbc2";
    expect(releaseId({ RELEASE: sha })).toBe(sha);
    expect(releaseId({ RELEASE: "D6FCA43" })).toBe("d6fca43");
    for (const bad of [undefined, "", "unknown", "d6fca4", "<script>", `${sha}0`, "v1.2.3"]) {
      expect(releaseId({ RELEASE: bad }), String(bad)).toBe("unknown");
    }
  });
});

describe("GET /api/health", () => {
  async function health() {
    const { GET } = await import("@/app/api/health/route");
    const res = await GET();
    const text = await res.text();
    return { res, text, body: JSON.parse(text) };
  }

  it("answers 200, uncached, with the release and a healthy config", async () => {
    vi.stubEnv("RELEASE", "d6fca435d2085f0752d8930fbbe41fa032f6dbc2");
    vi.stubEnv("LEAD_FORWARD_URL", "https://crm.example.invalid/hook");
    vi.stubEnv("LEAD_OUTBOX_DIR", scratch());
    const { res, body } = await health();
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(body).toEqual({
      status: "ok",
      release: "d6fca435d2085f0752d8930fbbe41fa032f6dbc2",
      config: "ok",
      lead: { forward: "configured", outbox: "writable" },
    });
  });

  it("still answers 200 when degraded, and says so without any value", async () => {
    const dir = scratch();
    vi.stubEnv("RELEASE", "");
    vi.stubEnv("LEAD_FORWARD_URL", `http://crm.example.invalid/${HIDDEN}`);
    vi.stubEnv("LEAD_FORWARD_TOKEN", HIDDEN);
    vi.stubEnv("LEAD_OUTBOX_DIR", dir);
    const { res, body, text } = await health();
    expect(res.status).toBe(200);
    expect(body).toMatchObject({ status: "ok", release: "unknown", config: "degraded" });
    expect(body.lead).toEqual({ forward: "invalid", outbox: "writable" });
    for (const leak of [HIDDEN, "crm.example", dir]) expect(text).not.toContain(leak);
  });

  it("reuses one check for a burst of requests", async () => {
    vi.stubEnv("LEAD_OUTBOX_DIR", scratch());
    const env = await import("@/lib/env");
    const first = env.currentConfig(1_000);
    expect(env.currentConfig(2_000)).toBe(first);
    expect(env.currentConfig(1_000 + 30_000)).not.toBe(first);
  });
});

describe("instrumentation register()", () => {
  it("checks the config once on the Node runtime, and logs it", async () => {
    vi.stubEnv("NEXT_RUNTIME", "nodejs");
    vi.stubEnv("NEXT_PHASE", "");
    vi.stubEnv("LEAD_FORWARD_URL", "nope");
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { register } = await import("@/instrumentation");
    await expect(register()).resolves.toBeUndefined();
    const lines = error.mock.calls.map(([line]) => JSON.parse(String(line)));
    expect(lines).toContainEqual({
      level: "error",
      event: "config_problem",
      variable: "LEAD_FORWARD_URL",
      problem: "not_a_url",
    });
  });

  it("does nothing on the edge runtime or during `next build`", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    vi.stubEnv("LEAD_FORWARD_URL", "nope");
    vi.stubEnv("NEXT_RUNTIME", "edge");
    const { register } = await import("@/instrumentation");
    await register();
    vi.stubEnv("NEXT_RUNTIME", "nodejs");
    vi.stubEnv("NEXT_PHASE", "phase-production-build");
    await register();
    expect(error).not.toHaveBeenCalled();
    expect(info).not.toHaveBeenCalled();
  });
});
