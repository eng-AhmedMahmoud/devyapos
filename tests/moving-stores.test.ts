import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getContent } from "@/content";
import { brand, movingFamily, storesName } from "@/lib/brand";

/*
 * Moving Stores on the POS site, and the rest of the Moving family. The
 * addresses are brand facts (lib/brand.ts), the copy describes the POS ↔
 * Stores link as built, and the band and the footer read both from their one
 * place.
 */

const root = join(__dirname, "..");

describe("Moving Stores", () => {
  it("is named per language and lives at its own host", () => {
    expect(storesName("en")).toBe("Moving Stores");
    expect(storesName("ar")).toBe("موفينج ستورز");
    expect(brand.stores.url).toBe("https://stores.movingsystems.tech");
  });

  it("never claims the link syncs customers or loyalty", () => {
    for (const locale of ["ar", "en"]) {
      const s = getContent(locale).movingStores;
      const text = [s.title, s.body, s.note, ...s.points].join("\n");
      expect(text).not.toMatch(/loyalty|points balance|customers sync|ولاء|نقاط/i);
    }
  });

  it("is linked from the pricing page through the brand fact, and from the footer through the family row", () => {
    const page = readFileSync(join(root, "app/[locale]/pricing/page.tsx"), "utf8");
    const band = readFileSync(join(root, "components/MovingStoresBand.tsx"), "utf8");
    const footer = readFileSync(join(root, "components/Footer.tsx"), "utf8");
    expect(page).toContain("<MovingStoresBand />");
    expect(band).toContain("brand.stores.url");
    expect(footer).toContain("movingFamily(locale)");
  });
});

describe("the Moving family row", () => {
  /** The four sites, their names per language and their hosts. */
  const FAMILY = [
    { key: "umbrella", ar: "موفينج سيستمز", en: "Moving Systems", url: "https://movingsystems.tech" },
    { key: "stores", ar: "موفينج ستورز", en: "Moving Stores", url: "https://stores.movingsystems.tech" },
    { key: "accounting", ar: "موفينج للمحاسبة", en: "Moving Accounting", url: "https://accounting.movingsystems.tech" },
    { key: "loyalty", ar: "موفينج لويالتي", en: "Moving Loyalty", url: "https://loyalty.movingsystems.tech" },
  ] as const;

  it.each(["ar", "en"] as const)("%s: names the umbrella and the three sister products, in order, at the same language's home", (locale) => {
    expect(movingFamily(locale)).toEqual(
      FAMILY.map((site) => ({ key: site.key, name: site[locale], href: `${site.url}/${locale}` })),
    );
  });

  it("falls back to Arabic, the default locale, for anything else", () => {
    expect(movingFamily("fr")).toEqual(movingFamily("ar"));
  });

  it("is labelled in both languages", () => {
    expect(getContent("ar").footer.family).toBe("عائلة موفينج");
    expect(getContent("en").footer.family).toBe("The Moving family");
  });

  it("renders plain, followed links in the same tab, under a visible label that names the list", () => {
    const footer = readFileSync(join(root, "components/Footer.tsx"), "utf8");
    const row = footer.slice(footer.indexOf('id="footer-family"'), footer.indexOf("</ul>", footer.indexOf('id="footer-family"')));
    expect(row).toContain('aria-labelledby="footer-family"');
    expect(row).toContain("href={site.href}");
    // Nothing that would stop the links passing weight or send them elsewhere.
    expect(row).not.toMatch(/nofollow|ugc|sponsored|target=/);
    expect(footer).not.toMatch(/footerLink/);
  });
});
