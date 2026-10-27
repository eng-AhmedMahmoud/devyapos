"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { DocsUi } from "@/content/docs/types";
import { Link } from "@/i18n/navigation";
import { plural } from "@/lib/docs/plural";
import { search, type PreparedEntry } from "@/lib/docs/search";
import Icon from "./DocIcon";
import { loadIndex } from "./DocsSearch";

/** The full results page for `?q=` — where the search box submits. */
export default function SearchResults({
  locale,
  ui,
}: {
  locale: string;
  ui: DocsUi["search"];
}) {
  const query = (useSearchParams().get("q") ?? "").trim();
  const [index, setIndex] = useState<PreparedEntry[] | null>(null);

  useEffect(() => {
    let live = true;
    loadIndex(locale).then((i) => {
      if (live) setIndex(i);
    });
    return () => {
      live = false;
    };
  }, [locale]);

  const hits = useMemo(() => (index && query ? search(index, query, 50) : []), [index, query]);

  if (!query) return <p className="doc-lede">{ui.noQuery}</p>;
  if (!index) return <p className="doc-lede">{ui.loading}</p>;

  return (
    <div className="flex flex-col gap-6">
      <p role="status" className="doc-lede">
        {hits.length
          ? plural(locale, ui.resultsCount, hits.length, { query })
          : ui.empty}
      </p>
      {hits.length ? (
        <ol className="flex flex-col border-t border-line-strong">
          {hits.map(({ entry }) => (
            <li key={entry.href} className="border-b border-line-strong">
              <Link href={entry.href} className="doc-card group flex items-start justify-between gap-6 px-1 py-5">
                <span className="flex flex-col gap-1.5">
                  <span className="doc-label text-ink-dim">{entry.category}</span>
                  <span className="font-display text-xl font-semibold text-ink">{entry.title}</span>
                  <span className="max-w-3xl leading-relaxed text-ink-dim">{entry.summary}</span>
                </span>
                <Icon name="arrow" size={18} className="doc-arrow mt-8 text-ink" />
              </Link>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
