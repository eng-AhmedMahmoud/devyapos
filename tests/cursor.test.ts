import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The cursor's contract with the system cursor, read from the stylesheet and
 * the component themselves (components/Cursor.tsx): nothing hides the system
 * cursor unless the custom one is on screen, copy and fields keep the I-beam,
 * and the layer never takes a click.
 */
const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8").replace(
  /\/\*[\s\S]*?\*\//g,
  "",
);
const source = readFileSync(join(process.cwd(), "components/Cursor.tsx"), "utf8");

/** Innermost `selector { declarations }` blocks, selectors split on top-level commas. */
const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({
  selectors: m[1].trim().split(/,(?![^(]*\))/).map((s) => s.trim().replace(/\s+/g, " ")),
  body: m[2],
}));

function rule(selector: string) {
  const found = rules.find((r) => r.selectors.includes(selector));
  if (!found) throw new Error(`no rule for ${selector}`);
  return found.body;
}

describe("custom cursor", () => {
  it("hides the system cursor only under :root.cursor-on", () => {
    const hiding = rules.filter((r) => /(^|;)\s*cursor:\s*none/.test(r.body));
    expect(hiding.length).toBeGreaterThan(0);
    for (const r of hiding) {
      for (const s of r.selectors) expect(s.startsWith(":root.cursor-on")).toBe(true);
    }
  });

  it("keeps the I-beam over copy and the caret in text fields", () => {
    const text = rules.filter((r) => /cursor:\s*text/.test(r.body)).flatMap((r) => r.selectors);
    expect(text.some((s) => s.startsWith(":root.cursor-on :is(p, h1"))).toBe(true);
    expect(text.some((s) => s.startsWith(":root.cursor-on :is(textarea"))).toBe(true);
  });

  it("is a fixed layer that never takes a click and does not mirror", () => {
    const layer = rule(".cursor");
    expect(layer).toMatch(/position:\s*fixed/);
    expect(layer).toMatch(/pointer-events:\s*none/);
    expect(layer).toMatch(/left:\s*0/);
    expect(layer).not.toMatch(/inset-inline/);
  });

  it("leaves focus rings to the page", () => {
    const own = rules.filter((r) =>
      r.selectors.some((s) => s.startsWith(":root.cursor-on") || /^\.cursor(-|\b)/.test(s)),
    );
    expect(own.length).toBeGreaterThan(0);
    for (const r of own) {
      expect(r.body).not.toMatch(/outline|box-shadow:\s*none/);
      for (const s of r.selectors) expect(s).not.toMatch(/:focus/);
    }
  });

  it("gives the keyboard the page, and lets go of a press when focus leaves", () => {
    // Any key but a bare modifier or a Cmd/Ctrl shortcut puts the cursor away…
    expect(source).toContain('window.addEventListener("keydown", onKey, true)');
    expect(source).toMatch(/if \(event\.metaKey \|\| event\.ctrlKey \|\| MODIFIERS\.has\(event\.key\)\) return/);
    // …until the mouse really moves, and it comes back in the state under the pointer.
    expect(source).toMatch(/if \(keyboard && event\.clientX === x && event\.clientY === y\) return/);
    expect(source).toMatch(/if \(!shown\) \{[^}]*settle\(event\.target\)/);
    // Focus leaving the window hides it and drops the press.
    expect(source).toContain('window.addEventListener("blur", hide)');
    expect(source).toMatch(/const hide = \(\) => \{[^}]*press\(false\)/);
  });

  it("runs only for a hovering fine pointer, never under reduced motion", () => {
    expect(source).toContain('"(hover: hover) and (pointer: fine)"');
    expect(source).toContain("(prefers-reduced-motion: reduce)");
    // The class that hides the system cursor is set only once the cursor is drawn.
    expect(source.match(/classList\.(add|toggle)\("cursor-on"/g)).toHaveLength(1);
  });
});
