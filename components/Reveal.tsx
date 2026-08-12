"use client";

import { useEffect, useRef } from "react";

/**
 * Entrance animation wrapper, in two modes.
 *
 * `immediate` (above the fold): a plain CSS animation that is already in the
 * server HTML, so the hero paints and settles without waiting for hydration.
 *
 * Default (below the fold): the element renders visible — crawlers and no-JS
 * visitors get the whole page — then JS arms it and an IntersectionObserver
 * un-arms it on approach. The class swap is a DOM write rather than React
 * state on purpose: it is a one-shot visual effect, and routing it through
 * state would re-render the subtree for it.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  immediate = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;

    el.classList.add("reveal-armed");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.classList.remove("reveal-armed");
          el.classList.add("reveal-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);

    return () => io.disconnect();
  }, [delay, immediate]);

  // The tag is a runtime choice across four intrinsic elements whose ref types
  // have no common supertype, so it is narrowed to one for the JSX call.
  const Component = Tag as "div";

  return (
    <Component
      ref={ref as React.RefObject<HTMLDivElement | null>}
      className={`${immediate ? "reveal-now" : ""} ${className}`.trim()}
      style={
        immediate && delay ? { animationDelay: `${delay}ms` } : undefined
      }
    >
      {children}
    </Component>
  );
}
