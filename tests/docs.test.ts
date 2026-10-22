import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/*
 * Keeps the docs true to the system that ships.
 *
 * For a month after the move to the VPS (2026-09-25) the spec, the CI header,
 * .env.example and the route comments still said Vercel deployed `main`, that
 * unforwarded leads lived in Vercel's logs and that the site had no backend —
 * and the compliance audit marked the gap fixed (X-Ray REQ-F1, ARC-F5,
 * AIN-F2). The docs that describe the running system may not make those claims
 * again. History is exempt: the decision records, the dated audit and the
 * X-Ray report quote the old state on purpose.
 */

const root = join(__dirname, "..");

function walk(dir: string, keep: (path: string) => boolean): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path, keep);
    return keep(path) ? [path] : [];
  });
}

const read = (path: string) => readFileSync(path, "utf8");
const rel = (path: string) => relative(root, path);

/** Docs and config comments that describe the system as it runs today. */
const CURRENT = [
  "README.md",
  "CLAUDE.md",
  "AGENTS.md",
  ".env.example",
  "Dockerfile",
  "docker-compose.prod.yml",
  "docs/spec.md",
  "docs/architecture.md",
  "docs/testing.md",
  "docs/ai-policy.md",
  "docs/compliance/processors.md",
  "docs/compliance/consent-design.md",
  ...walk(join(root, ".github"), (p) => /\.(ya?ml|md)$/.test(p)).map(rel),
];

/** Claims that stopped being true, with what replaced them. */
const RETIRED_CLAIMS: [RegExp, string][] = [
  [/no backend/i, "the site has route handlers and a data volume (docs/architecture.md)"],
  [/fully static/i, "pages are prerendered, but /api/lead, /api/consent and /api/health are dynamic"],
  [/auto-?deploys?/i, "production ships only through scripts/deploy.sh (ADR 0006)"],
  [/vercel (runtime )?logs?/i, "unforwarded leads go to the outbox on the data volume (ADR 0002)"],
  [/76\.76\.21\.21/, "the site's A records point at the VPS, 72.61.81.59"],
  [/\bAPI_URL\b/, "the /api rewrite and API_URL were removed (PR #53)"],
  [/x-vercel-ip-country/i, "nginx sets no geo header; `country` is client-supplied"],
  [/canonical home\. Update there first/i, "docs/spec.md in this repo is the canonical copy"],
];

/** Markdown whose relative links must resolve. */
const LINKED = [
  "README.md",
  "CLAUDE.md",
  "AGENTS.md",
  ".github/pull_request_template.md",
  ...walk(join(root, "docs"), (p) => p.endsWith(".md") && !p.includes(`${join("docs", "xray")}`)).map(rel),
];

const decisionsDir = join(root, "docs", "decisions");
const ADR = /^(\d{4})-[a-z0-9-]+\.md$/;
const records = readdirSync(decisionsDir).filter((name) => ADR.test(name)).sort();

describe("docs", () => {
  it("describe the running system, not the one it replaced", () => {
    const stale: string[] = [];
    for (const file of CURRENT) {
      read(join(root, file))
        .split("\n")
        .forEach((line, i) => {
          for (const [claim, now] of RETIRED_CLAIMS) {
            if (claim.test(line)) stale.push(`${file}:${i + 1} matches ${claim} — ${now}`);
          }
        });
    }
    expect(stale).toEqual([]);
  });

  it("say where production runs and how it is deployed", () => {
    for (const file of ["README.md", "docs/architecture.md", "CLAUDE.md"]) {
      const text = read(join(root, file));
      expect(text, file).toContain("scripts/deploy.sh");
      expect(text, file).toMatch(/Devya VPS/);
    }
    expect(read(join(root, "docs/architecture.md"))).toContain("72.61.81.59");
  });

  it("link only to files that exist", () => {
    const broken: string[] = [];
    for (const file of LINKED) {
      const text = read(join(root, file));
      for (const match of text.matchAll(/\]\(([^)\s]+)\)/g)) {
        const target = match[1];
        if (/^(https?:|mailto:|tel:|#)/.test(target)) continue;
        const path = target.split("#")[0];
        if (!existsSync(join(root, dirname(file), path))) broken.push(`${file} → ${target}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it("number the decision records without gaps and list each in the index", () => {
    expect(records.length).toBeGreaterThan(0);
    records.forEach((name, i) => expect(name.slice(0, 4)).toBe(String(i + 1).padStart(4, "0")));
    const index = read(join(decisionsDir, "README.md"));
    for (const name of records) expect(index, name).toContain(`](${name})`);
  });

  it("give every decision record a status, a date, and its context, decision and consequences", () => {
    for (const name of records) {
      const text = read(join(decisionsDir, name));
      expect(text, name).toMatch(/^# \d{4}\. \S/);
      for (const part of ["**Status:**", "**Date:** 20", "## Context", "## Decision", "## Consequences"]) {
        expect(text, `${name}: ${part}`).toContain(part);
      }
    }
  });
});
