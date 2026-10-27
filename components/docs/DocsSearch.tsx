"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { DocsUi } from "@/content/docs/types";
import { useRouter } from "@/i18n/navigation";
import { plural } from "@/lib/docs/plural";
import { prepare, search, type PreparedEntry, type SearchEntry } from "@/lib/docs/search";
import Icon from "./DocIcon";

/** One fetch of the index per locale per page load, shared by every search box. */
const indexes = new Map<string, Promise<PreparedEntry[]>>();

export function loadIndex(locale: string): Promise<PreparedEntry[]> {
  let p = indexes.get(locale);
  if (!p) {
    p = fetch(`/${locale}/docs/search.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`search index: ${r.status}`);
        return r.json() as Promise<SearchEntry[]>;
      })
      .then(prepare)
      .catch(() => {
        // Not cached: the next focus tries again.
        indexes.delete(locale);
        return [];
      });
    indexes.set(locale, p);
  }
  return p;
}

/**
 * The help centre's search box: an ARIA combobox over the static index. The
 * index (app/[locale]/docs/search.json) is fetched the first time the box is
 * focused, so pages that are only read never download it. Arrow keys move
 * through the results, Enter opens one, Escape clears; Enter with nothing
 * chosen — or no JavaScript at all — submits to the results page. "/" from
 * anywhere on the page focuses the box.
 */
export default function DocsSearch({
  locale,
  ui,
  size = "bar",
}: {
  locale: string;
  ui: DocsUi["search"];
  size?: "hero" | "bar";
}) {
  const router = useRouter();
  const [index, setIndex] = useState<PreparedEntry[] | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  const hero = size === "hero";

  const hits = useMemo(() => (index ? search(index, query, hero ? 8 : 6) : []), [index, query, hero]);
  const showList = open && query.trim().length >= 2;
  /** The listbox itself is in the document (results to show), not only the panel. */
  const listShown = showList && !!index && hits.length > 0;

  function warm() {
    if (!index) loadIndex(locale).then(setIndex);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      const typing =
        t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t?.isContentEditable;
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        input.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" && hits.length) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % hits.length);
    } else if (e.key === "ArrowUp" && hits.length) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? hits.length - 1 : i - 1));
    } else if (e.key === "Enter" && showList && active >= 0 && hits[active]) {
      e.preventDefault();
      go(hits[active].entry.href);
    } else if (e.key === "Escape") {
      if (open && query) {
        setOpen(false);
      } else {
        setQuery("");
      }
      setActive(-1);
    }
  }

  const status = !showList
    ? ""
    : !index
      ? ui.loading
      : hits.length
        ? plural(locale, ui.resultsCount, hits.length, { query: query.trim() })
        : ui.empty;

  return (
    <form
      role="search"
      action={`/${locale}/docs/search`}
      method="get"
      className="relative w-full"
      onSubmit={(e) => {
        if (!query.trim()) e.preventDefault();
      }}
    >
      <label htmlFor={`${listId}-input`} className="sr-only">
        {ui.label}
      </label>
      <div
        className={`flex items-center gap-3 border-[1.5px] border-line-strong bg-surface text-ink focus-within:border-ink ${
          hero ? "min-h-16 px-5" : "min-h-12 px-4"
        }`}
      >
        <Icon name="search" size={hero ? 22 : 18} className="text-ink-dim" />
        <input
          ref={input}
          id={`${listId}-input`}
          name="q"
          type="search"
          role="combobox"
          aria-expanded={listShown}
          aria-controls={listShown ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={listShown && active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          enterKeyHint="search"
          placeholder={ui.placeholder}
          value={query}
          onFocus={() => {
            warm();
            setOpen(true);
          }}
          onBlur={() => setOpen(false)}
          onChange={(e) => {
            warm();
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onKeyDown={onKeyDown}
          className={`min-w-0 flex-1 truncate bg-transparent outline-none placeholder:text-ink-dim [&::-webkit-search-cancel-button]:hidden ${
            hero ? "text-lg" : "text-[0.9375rem]"
          }`}
        />
        <kbd
          aria-hidden="true"
          className="t-index hidden border border-line-strong px-1.5 text-xs text-ink-dim sm:inline-block"
        >
          /
        </kbd>
        <button type="submit" className="sr-only">
          {ui.submit}
        </button>
      </div>

      <p role="status" className="sr-only">
        {status}
      </p>

      {showList ? (
        <div className="absolute inset-x-0 top-full z-30 mt-1 border-[1.5px] border-line-strong bg-surface shadow-[0_18px_40px_-18px_rgb(0_0_0/0.45)]">
          {!index ? (
            <p className="px-4 py-4 text-sm text-ink-dim">{ui.loading}</p>
          ) : hits.length === 0 ? (
            <p className="px-4 py-4 text-sm text-ink-dim">{ui.empty}</p>
          ) : (
            <ul id={listId} role="listbox" aria-label={ui.label} className="max-h-[min(28rem,60dvh)] overflow-y-auto py-1">
              {hits.map(({ entry }, i) => (
                <li
                  key={entry.href}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  // mousedown, not click: the input's blur would close the list first.
                  onMouseDown={(e) => {
                    e.preventDefault();
                    go(entry.href);
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={`flex cursor-pointer flex-col gap-1 border-s-2 px-4 py-3 ${
                    i === active ? "border-saffron bg-surface" : "border-transparent"
                  }`}
                >
                  <span className="font-medium text-ink">{entry.title}</span>
                  <span className="text-xs text-ink-dim">{entry.category}</span>
                  {hero ? (
                    <span className="line-clamp-1 text-sm text-ink-dim">{entry.summary}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
          <p className="border-t border-line px-4 py-2 text-xs text-ink-dim">{ui.hint}</p>
        </div>
      ) : null}
    </form>
  );
}
