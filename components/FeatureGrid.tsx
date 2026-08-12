import type { Feature } from "@/content";
import { Icon } from "./icons";
import Reveal from "./Reveal";

const hueVar: Record<Feature["hue"], string> = {
  brand: "var(--brand)",
  sky: "var(--caramel)",
  violet: "var(--pink)",
  amber: "var(--gold)",
  rose: "var(--brand-hover)",
  emerald: "var(--mint)",
  blue: "var(--caramel)",
};

/**
 * Feature cards.
 *
 * `bento` gives two of the nine tiles a double-width cell so the grid reads as
 * a composed panel rather than a uniform card wall; `grid-flow-dense` back-fills
 * the holes that creates. `even` is the plain two-column grid used on the
 * features page, where the groups are already doing the visual sorting.
 */
export default function FeatureGrid({
  items,
  variant = "bento",
}: {
  items: Feature[];
  variant?: "bento" | "even";
}) {
  const bento = variant === "bento";

  return (
    <ul
      className={
        bento
          ? "grid auto-rows-fr grid-flow-dense gap-4 sm:grid-cols-2 lg:grid-cols-3"
          : "grid gap-4 sm:grid-cols-2"
      }
    >
      {items.map((f, i) => {
        const wide = bento && (i === 0 || i === 5);
        return (
          <Reveal
            as="li"
            key={f.title}
            delay={(i % 3) * 70}
            className={wide ? "sm:col-span-2" : ""}
          >
            <article
              className={`card lift flex h-full flex-col gap-4 p-6 ${
                wide ? "sm:p-7" : ""
              }`}
              style={{ ["--tile" as string]: hueVar[f.hue] }}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="icon-tile">
                  <Icon name={f.icon} />
                </span>
                <span className="rounded-full border border-line px-2.5 py-1 text-xs font-bold text-ink-dim">
                  {f.badge}
                </span>
              </div>
              <h3
                className={`font-display text-ink ${wide ? "text-xl" : "text-lg"}`}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-dim">{f.body}</p>
            </article>
          </Reveal>
        );
      })}
    </ul>
  );
}
