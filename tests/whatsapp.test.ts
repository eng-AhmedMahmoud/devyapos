import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { ar } from "@/content/ar";
import { en } from "@/content/en";
import type { SiteContent } from "@/content/types";
import {
  whatsappCode,
  whatsappLink,
  whatsappSources,
  type WhatsappSource,
} from "@/lib/brand";

/*
 * Every WhatsApp chat the site opens says which button opened it, as a code on
 * the last line of the prefilled message (lib/brand.ts). It is the no-tracker
 * replacement for the Meta pixel in docs/social-launch-plan.md §5.2: the code
 * must reach WhatsApp intact in both languages, appear exactly once, and carry
 * the placement and nothing else — no campaign, no stored value.
 */

const root = join(__dirname, "..");
const SOURCES = Object.keys(whatsappSources) as WhatsappSource[];
const CODE = /\[P-[a-z]+\]/g;

/** The prefilled first message of a wa.me link, decoded. */
function prefill(href: string) {
  const url = new URL(href);
  expect(url.hostname).toBe("wa.me");
  expect([...url.searchParams.keys()]).toEqual(["text"]);
  return url.searchParams.get("text") ?? "";
}

/** Every prefilled-message template in a content tree. */
const templates = (c: SiteContent) => ({
  "contact.waTemplate": c.contact.waTemplate,
  "accountingTrial.outcomes.waTemplate": c.accountingTrial.outcomes.waTemplate,
  "accountingTrial.pricing.enterpriseWa": c.accountingTrial.pricing.enterpriseWa,
});

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });
}

const sources = ["app", "components", "lib"]
  .flatMap((d) => files(join(root, d)))
  .map((path) => ({ path: relative(root, path), text: readFileSync(path, "utf8") }));

describe("WhatsApp source codes", () => {
  it("gives every placement a short, neutral code", () => {
    for (const source of SOURCES) {
      expect(whatsappCode(source)).toMatch(/^\[P-[a-z]{2,10}\]$/);
    }
  });

  it("ends every template, in both languages, with exactly one known code, intact", () => {
    for (const [locale, c] of [["ar", ar], ["en", en]] as const) {
      for (const [key, template] of Object.entries(templates(c))) {
        // The code is added by the link builder, never typed into the copy.
        expect(template, `${locale} ${key}`).not.toMatch(CODE);
        for (const source of SOURCES) {
          const text = prefill(whatsappLink(template, source));
          const label = `${locale} ${key} ${source}`;
          expect(text.match(CODE), label).toEqual([whatsappCode(source)]);
          // The template and the code, and nothing appended from anywhere else.
          expect(text, label).toBe(`${template}\n\n${whatsappCode(source)}`);
          // On a line of its own, so an Arabic sentence cannot reorder it.
          expect(text.split("\n").at(-1), label).toBe(whatsappCode(source));
        }
      }
    }
  });

  it("builds every wa.me chat link through whatsappLink", () => {
    for (const { path, text } of sources) {
      if (!text.includes("wa.me/")) continue;
      // lib/jsonld.ts names the bare number as the Organization's contact
      // point: structured data for search engines, with no message to tag.
      expect(["lib/brand.ts", "lib/jsonld.ts"], `${path} builds a wa.me link`).toContain(path);
      if (path === "lib/jsonld.ts") expect(text).not.toMatch(/wa\.me\/[^`"']*\?text=/);
    }
  });

  it("uses every code in the legend, and no other", () => {
    const used = new Set<string>();
    for (const { text } of sources) {
      for (const pattern of [
        /whatsappLink\([^;]*?,\s*"([a-z]+)"\)/g, // whatsappLink(template, "float")
        /\bsource="([a-z]+)"/g, // <ClosingCta source="hardware" />
        /\bsource = "([a-z]+)"/g, // CtaBand's default
      ]) {
        for (const [, source] of text.matchAll(pattern)) used.add(source);
      }
    }
    expect([...used].sort()).toEqual([...SOURCES].sort());
  });
});
