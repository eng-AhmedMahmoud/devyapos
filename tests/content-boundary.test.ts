import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/*
 * The site's copy stays on the server (X-Ray ARC-F7).
 *
 * content/index.ts imports both content/ar.ts and content/en.ts. When client
 * components called getContent() themselves, both trees, every word of the
 * site in two languages, landed in a chunk every page downloads: about 59 KB
 * of gzip, a fifth of the home page's JS. Client components now take the copy
 * they render as props from a server parent. `import "server-only"` makes
 * `next build` refuse a regression; this test names the offending import
 * before a build is ever run, including one made through another module.
 */

const root = join(__dirname, "..");
const COPY = ["content/index.ts", "content/ar.ts", "content/en.ts"].map((file) => join(root, file));

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sources(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });
}

/** True when the module's first statement is the "use client" directive. */
function isClientModule(text: string): boolean {
  const body = text.replace(/^(?:\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/)*/, "");
  return /^["']use client["']/.test(body);
}

/**
 * Specifiers a module loads at runtime. `import type` and `export type` are
 * erased by the compiler, so they pull nothing into a bundle.
 */
function runtimeImports(text: string): string[] {
  const specs: string[] = [];
  for (const match of text.matchAll(/^\s*(import|export)\s+(type\s+)?(?:[^"';]*?\sfrom\s+)?["']([^"']+)["']/gm)) {
    if (!match[2]) specs.push(match[3]);
  }
  return specs;
}

/** A project-local specifier ("@/…", "./…", "../…") as a source file. */
function resolveLocal(from: string, spec: string): string | null {
  let base: string;
  if (spec.startsWith("@/")) base = join(root, spec.slice(2));
  else if (spec.startsWith(".")) base = join(dirname(from), spec);
  else return null;
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts"), join(base, "index.tsx")]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/** The import chain from `entry` to a content tree, or null if there is none. */
function pathToCopy(entry: string): string[] | null {
  const seen = new Set<string>();
  const walk = (file: string, chain: string[]): string[] | null => {
    if (COPY.includes(file)) return [...chain, file];
    if (seen.has(file)) return null;
    seen.add(file);
    for (const spec of runtimeImports(readFileSync(file, "utf8"))) {
      const next = resolveLocal(file, spec);
      const found = next ? walk(next, [...chain, file]) : null;
      if (found) return found;
    }
    return null;
  };
  return walk(entry, []);
}

const clientModules = ["app", "components", "lib", "i18n"]
  .flatMap((dir) => sources(join(root, dir)))
  .filter((file) => isClientModule(readFileSync(file, "utf8")));

describe("the site's copy stays on the server", () => {
  it("finds the client modules it guards", () => {
    expect(clientModules.length).toBeGreaterThan(10);
  });

  it.each(clientModules.map((file) => relative(root, file)))("%s reaches no content tree", (file) => {
    const chain = pathToCopy(join(root, file));
    expect(chain?.map((step) => relative(root, step)).join(" → ") ?? null).toBeNull();
  });

  it("content/index.ts is server-only, so a client import fails the build", () => {
    const text = readFileSync(join(root, "content/index.ts"), "utf8");
    expect(runtimeImports(text)[0]).toBe("server-only");
  });

  it("sees an import made through another module", () => {
    // The walker itself: the layout (a server component) does reach the copy,
    // through content/index.ts; a type-only import does not count, and an
    // inline `type` specifier still loads its module.
    expect(pathToCopy(join(root, "app/[locale]/layout.tsx"))?.map((step) => relative(root, step))).toEqual([
      "app/[locale]/layout.tsx",
      "content/index.ts",
    ]);
    expect(pathToCopy(join(root, "content/index.ts"))?.map((step) => relative(root, step))).toEqual([
      "content/index.ts",
    ]);
    expect(runtimeImports('import type { SiteContent } from "@/content/types";')).toEqual([]);
    expect(runtimeImports('import { type SiteContent } from "@/content";')).toEqual(["@/content"]);
  });
});
