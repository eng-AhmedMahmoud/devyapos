import { describe, expect, it } from "vitest";
import { inlineLinks, parseInline, plainText } from "@/lib/docs/inline";
import { plural } from "@/lib/docs/plural";
import { normalize, prepare, queryTerms, search, stem, type SearchEntry } from "@/lib/docs/search";

describe("inline marks", () => {
  it("splits UI labels, literals and links out of the prose", () => {
    expect(parseInline("Open **Orders**, copy `https://x.dev` or read [this](/docs/a/b).")).toEqual([
      { k: "text", v: "Open " },
      { k: "ui", v: "Orders" },
      { k: "text", v: ", copy " },
      { k: "code", v: "https://x.dev" },
      { k: "text", v: " or read " },
      { k: "link", v: "this", href: "/docs/a/b" },
      { k: "text", v: "." },
    ]);
  });

  it("leaves an unclosed mark as typed", () => {
    expect(parseInline("a **b")).toEqual([{ k: "text", v: "a **b" }]);
  });

  it("strips the marks for meta tags and the index", () => {
    expect(plainText("اضغط **حفظ** ثم افتح `/ar`")).toBe("اضغط حفظ ثم افتح /ar");
    expect(inlineLinks("[x](/docs/a/b) and [y](https://pos.movingsystems.tech/ar)")).toEqual([
      "/docs/a/b",
      "https://pos.movingsystems.tech/ar",
    ]);
  });
});

describe("search normalisation", () => {
  it("folds Arabic spellings, digits and case", () => {
    expect(normalize("إضافة المُنتَجات")).toBe("اضافه المنتجات");
    expect(normalize("مستوى")).toBe("مستوي");
    expect(normalize("٣ فروع")).toBe("3 فروع");
    expect(normalize("Add-Product!")).toBe("add product");
  });

  it("trims the article and plural endings off query words", () => {
    expect(stem("الطلبات")).toBe("طلب");
    expect(stem("والمنتجات")).toBe("منتج");
    expect(stem("orders")).toBe("order");
    expect(stem("address")).toBe("address");
    expect(queryTerms("  a  الطلبات orders ")).toEqual(["طلب", "order"]);
  });
});

describe("search ranking", () => {
  const entry = (over: Partial<SearchEntry>): SearchEntry => ({
    href: "/docs/x/y",
    title: "",
    category: "",
    summary: "",
    heads: "",
    keywords: "",
    body: "",
    ...over,
  });
  const index = prepare([
    entry({ href: "/docs/orders/refund", title: "استرداد طلب", body: "ارجع المبلغ للعميل" }),
    entry({ href: "/docs/orders/list", title: "قائمة الطلبات", summary: "كل طلبات متجرك" }),
    entry({ href: "/docs/selling/shift", title: "Open a shift", body: "the cash drawer and refund rules" }),
    entry({ href: "/docs/setup/printer", title: "Connect a printer", keywords: "ESC/POS, thermal" }),
  ]);

  it("finds a word inside longer words, Arabic article and plural included", () => {
    const hrefs = search(index, "الطلبات").map((h) => h.entry.href);
    expect(hrefs).toContain("/docs/orders/list");
    expect(hrefs).toContain("/docs/orders/refund");
  });

  it("ranks a title match above a body match", () => {
    const hits = search(index, "refund");
    expect(hits.map((h) => h.entry.href)).toEqual(["/docs/selling/shift"]);
    const ar = search(index, "استرداد");
    expect(ar[0].entry.href).toBe("/docs/orders/refund");
  });

  it("needs every word to match somewhere", () => {
    expect(search(index, "printer thermal").map((h) => h.entry.href)).toEqual(["/docs/setup/printer"]);
    expect(search(index, "printer refund")).toEqual([]);
  });

  it("returns nothing for an empty or one-letter query", () => {
    expect(search(index, "")).toEqual([]);
    expect(search(index, "a")).toEqual([]);
  });
});

describe("plural counts", () => {
  const forms = {
    zero: "no articles",
    one: "one article",
    two: "two articles",
    few: "{count} articles (few)",
    many: "{count} articles (many)",
    other: "{count} articles",
  };

  it("picks every Arabic CLDR form, and fills {count} with Latin digits", () => {
    expect(plural("ar", forms, 0)).toBe("no articles");
    expect(plural("ar", forms, 1)).toBe("one article");
    expect(plural("ar", forms, 2)).toBe("two articles");
    expect(plural("ar", forms, 3)).toBe("3 articles (few)");
    expect(plural("ar", forms, 11)).toBe("11 articles (many)");
    expect(plural("ar", forms, 100)).toBe("100 articles");
  });

  it("uses one and other in English, the zero form at zero, and fills extra variables", () => {
    expect(plural("en", forms, 1)).toBe("one article");
    expect(plural("en", forms, 0)).toBe("no articles");
    expect(plural("en", { other: "{count} for “{query}”" }, 0, { query: "shift" })).toBe("0 for “shift”");
    expect(plural("en", { one: "1 hit", other: "{count} hits" }, 5)).toBe("5 hits");
  });
});

describe("plural substitution", () => {
  it("keeps a $-pattern in the reader's query literal", () => {
    expect(plural("en", { other: "{count} for “{query}”" }, 2, { query: "$& $' $`" })).toBe("2 for “$& $' $`”");
  });
});
