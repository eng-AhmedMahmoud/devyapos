import type { DocShot } from "@/content/docs/types";
import { capturedShot } from "@/lib/docs/shots";
import Icon from "./DocIcon";
import Inline from "./Inline";

/**
 * A screenshot with its caption, numbered within the article ("Fig. 3 — …"),
 * in a window frame that names the app it was taken in.
 *
 * A slot scripts/capture-docs.mjs has not shot yet renders as a drawn frame
 * saying so, at the screenshot's proportions, and the caption still reads.
 * Once captured, the phone shot serves narrow screens and the desktop shot
 * the rest; either alone serves both.
 */
export default function Figure({
  shot,
  number,
  locale,
  labels,
}: {
  shot: DocShot;
  number: number;
  locale: string;
  labels: { figure: string; pending: string; pendingBody: string; surface: string };
}) {
  const captured = capturedShot(shot.id, locale);
  const desktop = captured?.desktop;
  const phone = captured?.phone;
  const main = desktop ?? phone;

  return (
    <figure className="flex flex-col gap-3">
      {main ? (
        <div className="overflow-hidden border border-line-strong bg-surface">
          <div
            aria-hidden="true"
            className="flex h-7 items-center gap-1.5 border-b border-line px-3"
          >
            <span className="size-2 bg-line-strong" />
            <span className="size-2 bg-line-strong" />
            <span className="size-2 bg-saffron" />
            <span className="ms-2 truncate text-[0.75rem] text-ink-dim">{labels.surface}</span>
          </div>
          {/* The full-size capture opens in a tab: the reader's zoom, no lightbox script. */}
          <a href={main.src} target="_blank" rel="noopener" className="block cursor-zoom-in">
            <picture>
              {desktop && phone ? (
                <source
                  media="(max-width: 639px)"
                  srcSet={phone.src}
                  width={phone.w}
                  height={phone.h}
                />
              ) : null}
              {/* Pre-sized WebP from the capture script; next/image would only re-encode it. */}
              <img
                src={main.src}
                width={main.w}
                height={main.h}
                alt={shot.alt}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </picture>
          </a>
        </div>
      ) : (
        <div
          role="img"
          aria-label={shot.alt}
          className="grid-paper relative flex aspect-[16/10] flex-col items-center justify-center gap-3 border border-dashed border-line-strong bg-surface p-6 text-center [--cell:1.5rem]"
        >
          <span className="inline-flex size-12 items-center justify-center bg-saffron text-on-saffron">
            <Icon name="image" size={24} />
          </span>
          <span className="font-display text-base font-semibold text-ink sm:text-lg">
            {labels.pending}
          </span>
          <span className="max-w-[38ch] text-sm leading-relaxed text-ink-dim">
            {labels.pendingBody.replace("{surface}", labels.surface)}
          </span>
        </div>
      )}
      <figcaption className="flex gap-2 text-sm leading-snug text-ink-dim">
        <span className="shrink-0 font-medium text-ink">
          {labels.figure} <span className="t-index">{number}</span> —
        </span>
        <span>
          <Inline text={shot.caption} />
        </span>
      </figcaption>
    </figure>
  );
}
