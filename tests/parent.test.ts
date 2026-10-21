import { describe, expect, it } from "vitest";
import { ar } from "@/content/ar";
import { en } from "@/content/en";
import { brand } from "@/lib/brand";
import { organizationJsonLd } from "@/lib/jsonld";

/**
 * Moving Systems is a subsidiary of Devya Solutions. Every Moving property
 * (movingsystems.tech, Moving POS, Moving Stores) names the parent in these
 * exact words, so a change here is a change to all of them.
 */
const PARENT = {
  en: {
    credit: { text: "Moving Systems is a Devya Solutions company", link: "Devya Solutions" },
    notice: {
      text: "Moving Systems is a subsidiary of Devya Solutions, its parent company.",
      link: "Devya Solutions",
    },
  },
  ar: {
    credit: { text: "موفينج سيستمز إحدى شركات ديفيا سوليوشنز", link: "ديفيا سوليوشنز" },
    notice: {
      text: "موفينج سيستمز شركة تابعة لشركة ديفيا سوليوشنز، الشركة الأم.",
      link: "ديفيا سوليوشنز",
    },
  },
} as const;

describe("parent company", () => {
  it("is Devya Solutions at devya.dev", () => {
    expect(brand.parent).toEqual({ name: "Devya Solutions", url: "https://devya.dev" });
  });

  it("is named in the shared words, each with its name inside the sentence once", () => {
    for (const [locale, content] of [["en", en], ["ar", ar]] as const) {
      expect(content.parentCompany).toEqual(PARENT[locale]);
      for (const sentence of Object.values(content.parentCompany)) {
        expect(sentence.text.split(sentence.link)).toHaveLength(2);
      }
    }
  });

  it("is the Organization's parentOrganization in the structured data", () => {
    for (const locale of ["ar", "en"]) {
      expect(organizationJsonLd(locale).parentOrganization).toMatchObject({
        "@type": "Organization",
        name: "Devya Solutions",
        url: "https://devya.dev",
      });
    }
  });
});
