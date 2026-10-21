import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The cursor's contract with the system cursor, read from the stylesheet and
 * the component themselves (components/Cursor.tsx): nothing hides the system
 * cursor unless the custom one is on screen, copy and fields keep the I-beam,
 * and the layer never takes a click.
 *
 * These are source-contract tests, not behaviour tests: the `source`
 * assertions pin lines of the component, so a faithful rewrite fails them and
 * a broken one written the same way passes. What the cursor does in a real
 * browser belongs to the browser journeys, not to this file.
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

  it("has two looks only: the default and the focus look over clickables", () => {
    // No text frame, no label, no press: copy and fields wear the default.
    const own = rules.flatMap((r) => r.selectors).filter((s) => /\.cursor|cursor-on/.test(s));
    for (const s of own) {
      expect(s).not.toMatch(/data-pressed|cursor-caret|cursor-label/);
      const state = s.match(/data-state="([^"]+)"/);
      if (state) expect(state[1]).toBe("link");
    }
    expect(rule('.cursor[data-state="link"] .cursor-ring')).toMatch(/scale:/);
    expect(source).toContain('type State = "idle" | "link" | "native";');
    // A text field wears the default, even inside a clickable <label>.
    expect(source).toContain('if (target.closest(FIELD)) return "idle";');
    // The system cursor no longer shows over copy or fields while the custom one is on.
    expect(rules.some((r) => /cursor:\s*text/.test(r.body))).toBe(false);
    const hidden = rules.filter((r) => /cursor:\s*none/.test(r.body)).flatMap((r) => r.selectors).join(" ");
    for (const field of ["input", "textarea", "[contenteditable]"]) expect(hidden).toContain(field);
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

  it("gives the keyboard the page, and steps aside when focus leaves", () => {
    // Any key but a bare modifier or a Cmd/Ctrl shortcut puts the cursor away…
    expect(source).toContain('window.addEventListener("keydown", onKey, true)');
    expect(source).toMatch(/if \(event\.metaKey \|\| event\.ctrlKey \|\| MODIFIERS\.has\(event\.key\)\) return/);
    // …until the mouse really moves, and it comes back in the state under the pointer.
    expect(source).toMatch(/if \(keyboard && event\.clientX === x && event\.clientY === y\) return/);
    expect(source).toMatch(/if \(!shown\) \{[^}]*settle\(event\.target\)/);
    // Focus leaving the window hides it.
    expect(source).toContain('window.addEventListener("blur", hide)');
  });

  it("runs only for a hovering fine pointer, never under reduced motion", () => {
    expect(source).toContain('"(hover: hover) and (pointer: fine)"');
    expect(source).toContain("(prefers-reduced-motion: reduce)");
    // The class that hides the system cursor is set only once the cursor is drawn.
    expect(source.match(/classList\.(add|toggle)\("cursor-on"/g)).toHaveLength(1);
  });
});
