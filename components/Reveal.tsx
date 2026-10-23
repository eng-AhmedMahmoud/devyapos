"use client";

import { useEffect, useRef } from "react";

/**
 * Entrance animation wrapper, in two modes.
 *
 * `immediate` (above the fold): a plain CSS animation that is already in the
 * server HTML, so the hero paints and settles without waiting for hydration.
 *
 * Default (below the fold): the element renders visible — crawlers and no-JS
 * visitors get the whole page — then, if it is still below the fold when JS
 * runs, JS arms it and an IntersectionObserver un-arms it on approach. One
 * already on screen is left alone. The class swap is a DOM write rather than React
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

    /* Armed only once the observer's first report says the element is below
       the fold. Arming on mount hid content the visitor was already reading
       (the server HTML had painted it) and faded it back in: a blink above
       the fold, and, when hydration beat the first paint, text at opacity 0
       that Chrome does not count for LCP, so the consent banner became the
       page's Largest Contentful Paint instead. */
    let first = true;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (first) {
            first = false;
            // The real viewport, not the root margin's: an element peeking in
            // at the bottom edge is already in view.
            const onScreen = entry.boundingClientRect.top < window.innerHeight;
            if (onScreen) {
              io.disconnect();
              return;
            }
            el.classList.add("reveal-armed");
            continue;
          }
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
