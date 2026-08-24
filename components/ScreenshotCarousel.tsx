"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import IpadFrame from "@/components/IpadFrame";

export interface CarouselItem {
  src: string;
  alt: string;
  caption: string;
  orientation?: "landscape" | "portrait";
}

/**
 * Auto-advancing screenshot carousel.
 *
 * Built on a native scroll-snap track rather than transform slides, so the
 * browser owns the physics: swipe on touch, trackpad flick, keyboard, and the
 * scrollbar all work without being re-implemented, and it still functions if
 * hydration never happens — the slides are laid out and scrollable in plain
 * HTML. JS only adds auto-advance and the dots.
 *
 * Auto-play stops for good on first interaction. A carousel that yanks itself
 * forward while the visitor is reading a caption is worse than no carousel, and
 * `prefers-reduced-motion` disables it outright.
 */
export default function ScreenshotCarousel({
  items,
  ariaLabel,
  intervalMs = 5200,
}: {
  items: CarouselItem[];
  ariaLabel: string;
  intervalMs?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [engaged, setEngaged] = useState(false);

  /**
   * Centre slide `i`.
   *
   * `scrollIntoView` rather than arithmetic on `offsetLeft`: offsetLeft is
   * relative to the nearest positioned ancestor, not the scroll container, so
   * computing a delta from it only coincidentally works — and it breaks in RTL,
   * where the track's scroll origin sits on the right. `inline:"center"` is
   * both snap-aware and direction-agnostic, and `block:"nearest"` stops it
   * dragging the page vertically on the way.
   */
  const goTo = useCallback((i: number, smooth = true) => {
    const slide = trackRef.current?.children[i] as HTMLElement | undefined;
    slide?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      inline: "center",
      block: "nearest",
    });
  }, []);

  // Corrective sync for scrolls this component did not initiate — a swipe,
  // a trackpad flick, a dragged scrollbar. Deliberately NOT the only source of
  // truth: every code path that moves the track also sets `index` itself, so a
  // dot still lights up even where scroll events are throttled or suppressed
  // (some embedded and automated browsers emit none at all).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Same reasoning as goTo: compare rect centres, not offsetLeft.
        const t = track.getBoundingClientRect();
        const mid = t.left + t.width / 2;
        let best = 0;
        let bestGap = Infinity;
        for (let i = 0; i < track.children.length; i++) {
          const r = (track.children[i] as HTMLElement).getBoundingClientRect();
          const gap = Math.abs(r.left + r.width / 2 - mid);
          if (gap < bestGap) { bestGap = gap; best = i; }
        }
        setIndex(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Auto-advance: paused while off-screen, while the tab is hidden, and
  // permanently once the visitor takes control.
  useEffect(() => {
    if (engaged || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const track = trackRef.current;
    if (!track) return;
    let visible = false;
    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; },
      { threshold: 0.4 },
    );
    io.observe(track);

    const id = setInterval(() => {
      if (!visible || document.hidden) return;
      setIndex((prev) => {
        const next = (prev + 1) % items.length;
        goTo(next);
        return next;
      });
    }, intervalMs);

    return () => { clearInterval(id); io.disconnect(); };
  }, [engaged, goTo, intervalMs, items.length]);

  const stop = useCallback(() => setEngaged(true), []);

  return (
    <div
      className="flex flex-col gap-5"
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onPointerDown={stop}
      onWheel={stop}
      onKeyDown={(e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        stop();
        // Arrow keys are physical, not logical: in RTL the visually-right key
        // still moves to the next slide because the track itself is flipped.
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
        const next = Math.min(
          items.length - 1,
          Math.max(0, index + (rtl ? -dir : dir)),
        );
        setIndex(next);
        goTo(next);
      }}
      tabIndex={0}
    >
      <div
        ref={trackRef}
        className="
          flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain
          pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        "
      >
        {items.map((item, i) => (
          <figure
            key={item.src}
            className="w-[86%] shrink-0 snap-center sm:w-[68%] lg:w-[52%]"
            aria-label={`${i + 1} / ${items.length}`}
          >
            <IpadFrame
              src={item.src}
              alt={item.alt}
              orientation={item.orientation}
              /* Only the first is eager; the rest are below the fold of the
                 track and would otherwise all decode on load. */
              priority={i === 0}
            />
            <figcaption className="mt-3 flex items-start gap-2 text-sm text-ink-dim">
              <span className="pearl mt-2 shrink-0" aria-hidden="true" />
              <span className="text-start">{item.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => { stop(); setIndex(i); goTo(i); }}
            aria-label={item.caption}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index
                ? "w-7 bg-[var(--espresso)] dark:bg-[var(--on-espresso)]"
                : "w-2 bg-ink-dim/30 hover:bg-ink-dim/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
