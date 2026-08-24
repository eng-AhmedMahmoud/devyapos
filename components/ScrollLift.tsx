"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-linked lift: the child eases from slightly small, low and dimmed to
 * its resting state as it travels up the viewport, then holds.
 *
 * Unlike `Reveal`, which fires once on intersection, this tracks scroll
 * position continuously, so a device mockup feels attached to the page rather
 * than popping in. The whole effect is a CSS custom property `--p` (0 → 1)
 * written on the element; the transform reads from it, so the browser only ever
 * composites — no layout, no React re-render per frame.
 *
 * Renders at rest (`--p: 1`) and only arms once JS runs, so no-JS visitors and
 * crawlers see the finished state rather than a permanently dimmed one.
 * `prefers-reduced-motion` leaves it at rest too.
 */
export default function ScrollLift({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 while the top edge is still a viewport-height away, 1 once it has
      // risen into the comfortable reading band.
      const raw = 1 - (rect.top - vh * 0.25) / (vh * 0.75);
      el.style.setProperty("--p", String(Math.min(1, Math.max(0, raw))));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    el.dataset.armed = "true";
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-lift ${className}`.trim()}
      style={{ "--p": 1 } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
