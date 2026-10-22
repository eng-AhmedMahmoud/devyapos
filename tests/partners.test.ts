import { describe, expect, it } from "vitest";
import { getContent } from "@/content";
import { whatsappSources } from "@/lib/brand";
import { routes } from "@/lib/routes";

/*
 * /partners carries commercial terms. The two trees must state the same
 * programmes with the same figures, the page must be reachable (route
 * manifest, footer) and its WhatsApp chats must say where they came from.
 */

const ar = getContent("ar").partners;
const en = getContent("en").partners;

/** "20%" and "٢٠٪" are the same number: compare the digits, whatever the script. */
const digits = (text: string) =>
  text.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/\D/g, "");

describe("partners", () => {
  it("is a route in the manifest and in the footer of both languages", () => {
    expect(routes.map((r) => r.path)).toContain("/partners");
    for (const locale of ["ar", "en"]) {
      const links = getContent(locale).footer.cols.flatMap((col) => col.links);
      expect(links.map((l) => l.href)).toContain("/partners");
    }
  });

  it("offers the same programmes with the same figures in both languages", () => {
    expect(ar.programmes.items.map((p) => p.id)).toEqual(["referral", "reseller", "restaurant"]);
    expect(en.programmes.items.map((p) => p.id)).toEqual(["referral", "reseller", "restaurant"]);
    expect(ar.programmes.items.map((p) => digits(p.figure))).toEqual(
      en.programmes.items.map((p) => digits(p.figure)),
    );
    for (const [a, e] of ar.programmes.items.map((p, i) => [p, en.programmes.items[i]] as const)) {
      expect(a.points.map(digits)).toEqual(e.points.map(digits));
    }
  });

  it("tags its WhatsApp chats with its own placement code", () => {
    expect(whatsappSources.partners).toMatch(/\/partners/);
  });
});
