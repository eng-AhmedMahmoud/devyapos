import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/*
 * Guards the cause of the React #418 hydration error (QEN-F5).
 *
 * A server component that imports from a "use client" module does not get the
 * module's values: every export becomes a client reference, which the browser
 * resolves only once that module's chunk has loaded. For a component that is
 * the point. For a plain value it is a trap — the root layout read the theme
 * boot script from ThemeToggle.tsx, so its <head> carried a reference instead
 * of the script text, hydration suspended inside <head> whenever that chunk
 * arrived late, and React lost its place in the document and threw #418 on
 * roughly one cold load in seven.
 *
 * This walks the server module graph from the app/ entry points, stopping at
 * each "use client" boundary, and fails if anything other than a component
 * (PascalCase) or a type is imported across one. Values both sides need belong
 * in a plain module, as lib/theme.ts does for the theme key and boot script.
 */

const root = join(__dirname, "..");

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });
}

/** True when the module's first statement is the "use client" directive. */
function isClientModule(text: string): boolean {
  const body = text.replace(/^(?:\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/)*/, "");
  return /^["']use client["']/.test(body);
}

/** Resolves a project-local specifier ("@/…", "./…", "../…") to a source file. */
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

type Import = { spec: string; named: string[] };

/** Static imports with their runtime (non-type) named bindings. */
function importsOf(text: string): Import[] {
  const found: Import[] = [];
  const pattern = /^\s*import\s+(type\s+)?([\s\S]*?)\s+from\s+["']([^"']+)["']/gm;
  for (const match of text.matchAll(pattern)) {
    if (match[1]) continue; // `import type { … }` is erased at build time.
    const clause = match[2];
    const braces = clause.match(/\{([\s\S]*)\}/);
    const named = braces
      ? braces[1]
          .split(",")
          .map((part) => part.trim())
          .filter((part) => part && !part.startsWith("type "))
          .map((part) => part.split(/\s+as\s+/)[0].trim())
      : [];
    found.push({ spec: match[3], named });
  }
  return found;
}

/** A component name: PascalCase, with at least one lowercase letter (not SCREAMING_CASE). */
const isComponentName = (name: string) => /^[A-Z][A-Za-z0-9]*$/.test(name) && /[a-z]/.test(name);

const entryPoints = files(join(root, "app")).filter(
  (path) => !isClientModule(readFileSync(path, "utf8")),
);

function crossings(): string[] {
  const seen = new Set<string>();
  const queue = [...entryPoints];
  const problems: string[] = [];
  while (queue.length > 0) {
    const file = queue.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    for (const { spec, named } of importsOf(readFileSync(file, "utf8"))) {
      const target = resolveLocal(file, spec);
      if (!target) continue;
      if (isClientModule(readFileSync(target, "utf8"))) {
        for (const name of named.filter((n) => !isComponentName(n))) {
          problems.push(`${relative(root, file)} imports \`${name}\` from client module ${relative(root, target)}`);
        }
      } else {
        queue.push(target);
      }
    }
  }
  return problems;
}

describe("server/client boundary", () => {
  it("walks the server graph from the app/ entry points", () => {
    // The root layout is a server module; if this ever reads as zero the walk
    // below proves nothing.
    expect(entryPoints.map((p) => relative(root, p))).toContain("app/[locale]/layout.tsx");
  });

  it("imports only components (and types) across a \"use client\" boundary", () => {
    expect(crossings()).toEqual([]);
  });

  it("gives the root layout the theme boot script as text, from a plain module", () => {
    const layout = readFileSync(join(root, "app/[locale]/layout.tsx"), "utf8");
    const source = importsOf(layout).find((i) => i.named.includes("themeBootScript"));
    expect(source).toBeDefined();
    const target = resolveLocal(join(root, "app/[locale]/layout.tsx"), source!.spec);
    expect(target).not.toBeNull();
    expect(isClientModule(readFileSync(target!, "utf8"))).toBe(false);
  });
});
