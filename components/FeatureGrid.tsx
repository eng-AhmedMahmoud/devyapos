import type { Feature } from "@/content";
import { Icon } from "./icons";
import Reveal from "./Reveal";

const hueVar: Record<Feature["hue"], string> = {
  brand: "var(--brand)",
  sky: "var(--sky)",
  violet: "var(--violet)",
  amber: "var(--amber)",
  rose: "var(--rose)",
  emerald: "var(--emerald)",
  blue: "var(--blue)",
};

/**
 * Feature card grid, shared by the home page and the features page.
 *
 * Each card carries a metric badge — the incumbent's "+30% efficiency" device.
 * Ours are capability claims (`< 1 second`, `0% commission`) rather than
 * invented percentages, so they survive a sales conversation.
 */
export default function FeatureGrid({
  items,
  columns = 3,
}: {
  items: Feature[];
  columns?: 2 | 3;
}) {
  return (
    <ul
      className={`grid gap-5 sm:grid-cols-2 ${
        columns === 3 ? "lg:grid-cols-3" : ""
      }`}
    >
      {items.map((f, i) => (
        <Reveal as="li" key={f.title} delay={(i % 3) * 70}>
          <article
            className="card lift flex h-full flex-col gap-4 p-6"
            style={{ ["--tile" as string]: hueVar[f.hue] }}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="icon-tile">
                <Icon name={f.icon} />
              </span>
              <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-ink-dim">
                {f.badge}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-ink">{f.title}</h3>
            <p className="text-sm leading-relaxed text-ink-dim">{f.body}</p>
          </article>
        </Reveal>
      ))}
    </ul>
  );
}
