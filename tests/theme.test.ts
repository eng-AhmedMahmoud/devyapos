import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import ThemeToggle from "@/components/ThemeToggle";
import { THEME_KEY, themeBootScript } from "@/lib/theme";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

/**
 * The site opens light for a visitor with no stored choice, whatever the OS
 * prefers: the server renders `data-theme="light"` and the boot script only
 * ever applies a stored "light" or "dark".
 */
const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");
const layout = read("app/[locale]/layout.tsx");

function boot(stored: string | null): string {
  const attrs: Record<string, string> = { "data-theme": "light" };
  const run = new Function("document", "localStorage", themeBootScript);
  run(
    { documentElement: { setAttribute: (k: string, v: string) => (attrs[k] = v) } },
    { getItem: (k: string) => (k === THEME_KEY ? stored : null) },
  );
  return attrs["data-theme"];
}

describe("default theme", () => {
  it("is rendered light on <html>", () => {
    expect(layout).toMatch(/data-theme="light"/);
    expect(layout).not.toMatch(/data-theme="dark"/);
  });

  it("stays light with nothing stored", () => {
    expect(boot(null)).toBe("light");
  });

  // A "system" (or any other stale value) is not a theme here: it leaves the
  // light default, and the toggle's next press stores a real choice.
  it("resolves a stored system or unknown value to light", () => {
    expect(boot("system")).toBe("light");
    expect(boot("auto")).toBe("light");
    expect(boot("")).toBe("light");
  });

  it("applies a stored choice before paint", () => {
    expect(boot("dark")).toBe("dark");
    expect(boot("light")).toBe("light");
  });
});

describe("two themes, light and dark", () => {
  const messages = { ar: arMessages, en: enMessages };

  it("labels only Light and Dark, in both locales", () => {
    for (const m of Object.values(messages)) {
      expect(Object.keys(m.a11y).filter((k) => /theme/i.test(k)).sort()).toEqual([
        "themeDark",
        "themeLight",
      ]);
    }
  });

  // The server render is the light default, so the one button offers dark;
  // both glyphs ship and the stylesheet shows the right one before hydration.
  it("renders one toggle with a sun and a moon, offering dark from the default", () => {
    for (const [locale, m] of Object.entries(messages)) {
      // The provider's props type wants `children` among the props; it comes
      // as createElement's third argument instead, which the lint rule asks for.
      const props = { locale, messages: m } as { locale: string; messages: typeof m; children: ReactNode };
      const html = renderToStaticMarkup(
        createElement(NextIntlClientProvider, props, createElement(ThemeToggle)),
      );
      expect(html.match(/<button/g)).toHaveLength(1);
      expect(html.match(/<svg/g)).toHaveLength(2);
      expect(html).toContain(`aria-label="${m.a11y.themeDark}"`);
      expect(html).not.toContain(m.a11y.themeLight);
    }
  });
});

/** Every .ts, .tsx and .css file the site is built from. */
function sources(dir: string): string[] {
  return readdirSync(join(process.cwd(), dir), { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile() && /\.(tsx?|css)$/.test(e.name))
    .map((e) => join(e.parentPath, e.name));
}

describe("never the OS theme", () => {
  // app/icon.svg is the browser tab's favicon, which sits on the browser's own
  // chrome, so it still follows prefers-color-scheme; it is not scanned here.
  const files = ["app", "components", "lib"].flatMap(sources);

  it("no stylesheet, script or inline style reads prefers-color-scheme or asks for both schemes", () => {
    expect(files.length).toBeGreaterThan(20);
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(/@media[^{]*prefers-color-scheme/);
      expect(source, file).not.toMatch(/matchMedia\([^)]*prefers-color-scheme/);
      expect(source, file).not.toMatch(/color-?scheme:\s*["']?light dark/i);
    }
  });
});
