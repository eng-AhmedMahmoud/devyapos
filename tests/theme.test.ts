import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { THEME_KEY, themeBootScript } from "@/lib/theme";

/**
 * The site opens light for a visitor with no stored choice, whatever the OS
 * prefers: the server renders `data-theme="light"` and the boot script only
 * ever applies a stored "light" or "dark".
 */
const layout = readFileSync(join(process.cwd(), "app/[locale]/layout.tsx"), "utf8");

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
    expect(boot("system")).toBe("light");
  });

  it("applies a stored choice before paint", () => {
    expect(boot("dark")).toBe("dark");
    expect(boot("light")).toBe("light");
  });
});
