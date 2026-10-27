import type { DocArticle, DocBlock, DocsUi } from "@/content/docs/types";
import { articleShots } from "@/lib/docs";
import { shotSpec } from "@/lib/docs/shots";
import Icon, { type IconName } from "./DocIcon";
import Figure from "./Figure";
import Inline from "./Inline";

const CALLOUT_ICON: Record<"note" | "tip" | "warning", IconName> = {
  note: "info",
  tip: "tip",
  warning: "warning",
};

/**
 * An article's blocks, set for reading: a measure of about 70 characters,
 * numbered steps on the site's index tiles, ruled callouts with the icon on a
 * saffron or ink tile (saffron is a fill, never type), and figures numbered in
 * order of appearance.
 */
export default function ArticleBody({
  article,
  ui,
  locale,
}: {
  article: DocArticle;
  ui: DocsUi;
  locale: string;
}) {
  const figureNumber = new Map(articleShots(article).map((s, i) => [s.id, i + 1]));
  const figureLabels = (id: Parameters<typeof shotSpec>[0]) => ({
    figure: ui.figure,
    pending: ui.shotPending,
    pendingBody: ui.shotPendingBody,
    surface: ui.surfaces[shotSpec(id).surface],
  });

  function block(b: DocBlock, key: number) {
    switch (b.t) {
      case "p":
        return (
          <p key={key} className="doc-prose text-ink">
            <Inline text={b.text} />
          </p>
        );
      case "h2":
        return (
          <h2
            key={key}
            id={b.id}
            className="group flex items-baseline gap-3 pt-6 font-display text-2xl leading-snug font-semibold text-ink sm:text-[1.75rem]"
          >
            <span aria-hidden="true" className="size-2.5 shrink-0 translate-y-[-0.15em] bg-saffron" />
            <span>
              <Inline text={b.text} />
            </span>
            {/* The "#" is drawn by CSS, so the heading's text — what search
                results and the outline read — is the title alone. */}
            <a
              href={`#${b.id}`}
              aria-hidden="true"
              tabIndex={-1}
              className="t-index text-base text-ink-dim opacity-0 transition-opacity group-hover:opacity-100 before:content-['#']"
            />
          </h2>
        );
      case "h3":
        return (
          <h3 key={key} className="pt-2 font-display text-xl leading-snug font-semibold text-ink">
            <Inline text={b.text} />
          </h3>
        );
      case "list":
        return (
          <ul key={key} className="flex flex-col gap-2.5">
            {b.items.map((item) => (
              <li key={item} className="doc-prose flex gap-3 text-ink">
                <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 bg-saffron" />
                <span>
                  <Inline text={item} />
                </span>
              </li>
            ))}
          </ul>
        );
      case "steps":
        return (
          // Inset on a phone so the step tiles, centred on the rule, clear the screen edge.
          <ol key={key} className="flex flex-col border-s border-line-strong max-sm:ms-[1.125rem]">
            {b.items.map((step, i) => (
              <li key={step.title} className="relative flex flex-col gap-3 pb-8 ps-8 last:pb-2 sm:ps-10">
                {/* The tile keeps the page's direction so its inline start is the
                    rule's side in Arabic too; only the digits are an LTR run. */}
                <span
                  aria-hidden="true"
                  className="absolute -start-[1.125rem] top-0 inline-flex size-9 items-center justify-center border border-line-strong bg-bg text-sm font-medium text-ink"
                >
                  <span className="t-index">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <h3 className="pt-1.5 font-display text-lg leading-snug font-semibold text-ink sm:text-xl">
                  <span className="sr-only">
                    {ui.stepLabel} {i + 1}:{" "}
                  </span>
                  <Inline text={step.title} />
                </h3>
                {step.body ? (
                  <p className="doc-prose text-ink-dim">
                    <Inline text={step.body} />
                  </p>
                ) : null}
                {step.shot ? (
                  <div className="pt-2">
                    <Figure
                      shot={step.shot}
                      number={figureNumber.get(step.shot.id) ?? 0}
                      locale={locale}
                      labels={figureLabels(step.shot.id)}
                    />
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        );
      case "callout":
        return (
          <aside
            key={key}
            className={`flex gap-4 border p-5 ${
              b.tone === "warning" ? "border-line-strong bg-surface" : "border-line bg-surface"
            }`}
          >
            <span
              className={`inline-flex size-9 shrink-0 items-center justify-center ${
                b.tone === "tip" ? "bg-saffron text-on-saffron" : "border border-line-strong text-ink"
              }`}
            >
              <Icon name={CALLOUT_ICON[b.tone]} size={18} />
            </span>
            <div className="flex flex-col gap-1">
              <p className="doc-label text-ink">{ui.callout[b.tone]}</p>
              <p className="doc-prose text-ink-dim">
                <Inline text={b.text} />
              </p>
            </div>
          </aside>
        );
      case "shot":
        return (
          <Figure
            key={key}
            shot={b.shot}
            number={figureNumber.get(b.shot.id) ?? 0}
            locale={locale}
            labels={figureLabels(b.shot.id)}
          />
        );
      case "table":
        return (
          <div key={key} className="overflow-x-auto border border-line-strong">
            <table className="w-full min-w-[32rem] border-collapse text-start text-[0.9375rem]">
              <thead className="bg-surface">
                <tr>
                  {b.head.map((h) => (
                    <th key={h} scope="col" className="doc-label border-b border-line-strong px-4 py-3 text-start text-ink">
                      <Inline text={h} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((row, r) => (
                  <tr key={r} className="border-b border-line last:border-b-0">
                    {row.map((cell, c) => (
                      <td key={c} className={`px-4 py-3 align-top leading-relaxed ${c === 0 ? "font-medium text-ink" : "text-ink-dim"}`}>
                        <Inline text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "qa":
        return (
          <div key={key}>
            {b.items.map((item) => (
              <details key={item.q} className="group border-b border-line-strong first:border-t">
                <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-6 py-4 text-start">
                  <span className="font-display text-lg font-semibold text-ink">
                    <Inline text={item.q} />
                  </span>
                  <Icon name="plus" size={18} className="doc-plus text-ink" />
                </summary>
                <p className="doc-prose pb-5 text-ink-dim">
                  <Inline text={item.a} />
                </p>
              </details>
            ))}
          </div>
        );
    }
  }

  return <div className="flex flex-col gap-6">{article.body.map(block)}</div>;
}
