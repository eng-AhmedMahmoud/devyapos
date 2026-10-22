import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { afterAll, describe, expect, it } from "vitest";
import { BUDGET_KB, firstLoadScripts, measure, overBudget } from "../scripts/check-bundle.mjs";

/*
 * scripts/check-bundle.mjs, the first-load JS budget CI runs after the build.
 * The fixture under tests/fixtures/next-build is laid out like `.next/`: two
 * prerendered pages and the chunks they reference, with the things a real page
 * also carries that must not be counted (a nomodule polyfill, a preload hint
 * for a script that is loaded anyway, an inline script, a third-party src, a
 * chunk named only inside the flight data, an .rsc file).
 */

const root = join(__dirname, "..");
const fixture = join(__dirname, "fixtures", "next-build");
const gz = (file: string) => gzipSync(readFileSync(join(fixture, file)), { level: 9 }).length;
const raw = (file: string) => readFileSync(join(fixture, file)).length;

describe("firstLoadScripts", () => {
  it("reads every same-origin script a page loads, once each, in document order", () => {
    const html = readFileSync(join(fixture, "server/app/ar.html"), "utf8");
    expect(firstLoadScripts(html)).toEqual([
      "static/chunks/shared.js",
      "static/chunks/page-home.js",
      "static/chunks/runtime.js",
    ]);
  });

  it("skips nomodule scripts however the attribute is written", () => {
    expect(
      firstLoadScripts(
        '<script nomodule src="/_next/static/chunks/a.js"></script><script src="/_next/static/chunks/b.js" noModule=""></script>',
      ),
    ).toEqual([]);
  });

  it("reads a chunk behind an asset prefix, and drops the query string", () => {
    expect(
      firstLoadScripts('<script async src="https://cdn.example.com/_next/static/chunks/c.js?dpl=x#y"></script>'),
    ).toEqual(["static/chunks/c.js"]);
  });
});

describe("measure", () => {
  it("sums each page's scripts, raw and gzipped, largest page first", () => {
    const home = ["static/chunks/shared.js", "static/chunks/page-home.js", "static/chunks/runtime.js"];
    const contact = ["static/chunks/shared.js", "static/chunks/runtime.js"];
    const sum = (files: string[], size: (file: string) => number) => files.reduce((total, f) => total + size(f), 0);

    expect(measure(fixture)).toEqual([
      { page: "/ar", scripts: 3, bytes: sum(home, raw), gzip: sum(home, gz) },
      { page: "/ar/contact", scripts: 2, bytes: sum(contact, raw), gzip: sum(contact, gz) },
    ]);
  });

  it("finds no pages where there is no build", () => {
    expect(measure(join(fixture, "missing"))).toEqual([]);
  });
});

describe("overBudget", () => {
  it("names exactly the pages above the budget", () => {
    const rows = measure(fixture);
    const between = (rows[0].gzip + rows[1].gzip) / 2 / 1024;
    expect(overBudget(rows, between).map((row) => row.page)).toEqual(["/ar"]);
    expect(overBudget(rows, rows[0].gzip / 1024)).toEqual([]);
  });

  it("is set, in KB, near the measured maximum (167.9 KB) plus headroom", () => {
    expect(BUDGET_KB).toBeGreaterThanOrEqual(168);
    expect(BUDGET_KB).toBeLessThanOrEqual(190);
  });
});

describe("the CLI", () => {
  const script = join(root, "scripts", "check-bundle.mjs");
  const empty = mkdtempSync(join(tmpdir(), "check-bundle-"));
  afterAll(() => rmSync(empty, { recursive: true, force: true }));

  function run(...args: string[]): { code: number; out: string } {
    try {
      const out = execFileSync(process.execPath, [script, ...args], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, GITHUB_STEP_SUMMARY: "" },
      });
      return { code: 0, out };
    } catch (error) {
      const failed = error as { status: number; stdout: string; stderr: string };
      return { code: failed.status, out: `${failed.stdout}${failed.stderr}` };
    }
  }

  it("passes a build within budget", () => {
    const result = run("--dir", fixture);
    expect(result.code).toBe(0);
    expect(result.out).toContain("All 2 pages within");
  });

  it("fails a build over budget and names the page", () => {
    const result = run("--dir", fixture, "--budget-kb", "0.01");
    expect(result.code).toBe(1);
    expect(result.out).toMatch(/2 page\(s\) over the 0\.01 KB budget: \/ar, \/ar\/contact/);
  });

  it("fails, rather than passing silently, when there is no build to read", () => {
    const result = run("--dir", empty);
    expect(result.code).toBe(1);
    expect(result.out).toContain("run `pnpm build` first");
  });
});
