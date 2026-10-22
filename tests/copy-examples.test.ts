import { describe, expect, it } from "vitest";
import { ar } from "@/content/ar";
import { en } from "@/content/en";
import { foldDigits } from "@/lib/format";
import { normalizeEgyptMobile } from "@/lib/leads";

/*
 * A phone number the copy shows as an example must be one the form accepts.
 * Both locales' "invalid phone" message used to suggest 01312345678 — 013 is
 * not an operator block, so a visitor who typed the example got the same error
 * back (found by the X-Ray T6 review). Any 11-digit run that starts with 01, in
 * Latin or Arabic-Indic digits, anywhere in the copy, is read as such an
 * example.
 */

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

function mobileExamples(copy: unknown): string[] {
  return strings(copy).flatMap((s) => foldDigits(s).match(/(?<!\d)01\d{9}(?!\d)/g) ?? []);
}

describe("phone examples in the copy", () => {
  for (const [locale, copy] of [["ar", ar], ["en", en]] as const) {
    it(`${locale}: every example mobile is one the lead form accepts`, () => {
      const examples = mobileExamples(copy);
      expect(examples.length).toBeGreaterThan(0);
      for (const example of examples) expect(normalizeEgyptMobile(example), example).not.toBeNull();
    });
  }

  it("the old example is refused, so this test would have caught it", () => {
    expect(normalizeEgyptMobile("01312345678")).toBeNull();
  });
});
