import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getContent } from "@/content";
import { brand, storesName } from "@/lib/brand";

/*
 * Moving Stores on the POS site. The address is a brand fact (lib/brand.ts),
 * the copy describes the POS ↔ Stores link as built, and the band and the
 * footer read both from their one place.
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

  it("is linked from the pricing page and the footer, through the brand fact", () => {
    const page = readFileSync(join(root, "app/[locale]/pricing/page.tsx"), "utf8");
    const band = readFileSync(join(root, "components/MovingStoresBand.tsx"), "utf8");
    const footer = readFileSync(join(root, "components/Footer.tsx"), "utf8");
    expect(page).toContain("<MovingStoresBand />");
    expect(band).toContain("brand.stores.url");
    expect(footer).toContain("brand.stores.url");
  });
});
