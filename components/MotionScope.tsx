"use client";

import { useEffect, useRef } from "react";

/**
 * Pauses the looping decoration inside it while it is off screen.
 *
 * The loops are CSS keyframes on transform and opacity, so they run on the
 * compositor and cost little — but little is not nothing on a phone, and a
 * loop nobody can see is pure waste. An IntersectionObserver writes
 * `data-inview` on the wrapper; globals.css pauses `.motion-loop` children
 * while it reads "false". Before hydration (and without JS) the attribute is
 * absent and the loops simply run, so the page never depends on this to look
 * right. Like `Reveal`, it is a DOM write rather than React state: nothing
 * re-renders for it.
 */
export default function MotionScope({
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
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        el.dataset.inview = String(entry.isIntersecting);
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      {children}
    </div>
  );
}
