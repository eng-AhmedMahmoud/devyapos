import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ParentCompany from "@/components/ParentCompany";
import { ar } from "@/content/ar";
import { en } from "@/content/en";
import { brand } from "@/lib/brand";
import { organizationJsonLd } from "@/lib/jsonld";

/**
 * Moving Systems is a subsidiary of Devya Solutions. The `notice` says so in
 * the same words on every Moving property (movingsystems.tech, Moving POS,
 * Moving Stores). The footer `credit` is the product sites' own: Moving POS
 * and Moving Accounting credit Devya Solutions as the maker of the product,
 * its name in Latin letters in both languages, while the umbrella keeps the
 * company line. A change to either is a change to every site that shares it.
 */
const PARENT = {
  en: {
    credit: { text: "A product of Devya Solutions", link: "Devya Solutions" },
    notice: {
      text: "Moving Systems is a subsidiary of Devya Solutions, its parent company.",
      link: "Devya Solutions",
    },
  },
  ar: {
    credit: { text: "أحد منتجات Devya Solutions", link: "Devya Solutions" },
    notice: {
      text: "موفينج سيستمز شركة تابعة لشركة ديفيا سوليوشنز، الشركة الأم.",
      link: "ديفيا سوليوشنز",
    },
  },
} as const;

/** What the footer draws: the words before the name, then the name as the link. */
const CREDIT_BEFORE = { en: "A product of ", ar: "أحد منتجات " } as const;

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

  it("is credited in the footer as the product's maker, its name a link to devya.dev in a new tab", () => {
    for (const [locale, content] of [["en", en], ["ar", ar]] as const) {
      // As components/Footer.tsx draws it (e2e/parent.spec.ts checks the real footer).
      const html = renderToStaticMarkup(
        createElement(ParentCompany, { sentence: content.parentCompany.credit, className: "credit-link", isolate: true }),
      );
      // The whole line: the words, then the linked name, and nothing after it.
      // `<bdi>` keeps the Latin name one isolated run inside the Arabic line.
      expect(html).toBe(
        `${CREDIT_BEFORE[locale]}<a href="https://devya.dev" target="_blank" rel="noopener" class="credit-link"><bdi>Devya Solutions</bdi></a>`,
      );
      const rel = /rel="([^"]*)"/.exec(html)?.[1].split(" ") ?? [];
      expect(rel).toContain("noopener");
    }
  });

  it("keeps the notice's markup as it was: the name linked, not isolated", () => {
    for (const content of [en, ar]) {
      const { text, link } = content.parentCompany.notice;
      const html = renderToStaticMarkup(createElement(ParentCompany, { sentence: content.parentCompany.notice }));
      const [before, after] = text.split(link);
      expect(html).toBe(`${before}<a href="https://devya.dev" target="_blank" rel="noopener">${link}</a>${after}`);
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
