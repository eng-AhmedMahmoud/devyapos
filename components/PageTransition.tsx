"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState, ViewTransition } from "react";

/*
 * Page transitions, the Moving family's (Moving Stores' PageTransition,
 * devya-commerce apps/admin/components/motion/page-transition.tsx): the page
 * being left fades out through the View Transitions API (`.page-out`, 150 ms)
 * while the next one fades in and slides a few pixels from the inline end
 * (`.page-enter` in globals.css, 200 ms) — so it mirrors in Arabic.
 *
 * Keyed by pathname: a hash or a query change on the same page never
 * animates, and the header, footer and fixed layers outside <main> stay put.
 * The entrance is a CSS animation on the new page rather than a view
 * transition, because React commits nothing while one runs. Nothing here
 * delays a navigation: browsers without the API swap the old page instantly
 * and still get the entrance; reduced motion gets neither (globals.css).
 *
 * The first page of a visit never animates — it is the LCP and it is already
 * on screen — so the entrance waits until a page has hydrated.
 */

let hydrated = false;

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    /* A back/forward swipe the browser already animated (Chrome's gesture
       navigation) gets no second animation on top. */
    const onPop = (event: PopStateEvent) => {
      if (!(event as PopStateEvent & { hasUAVisualTransition?: boolean }).hasUAVisualTransition) return;
      const root = document.documentElement;
      root.dataset.uaTransition = "";
      window.setTimeout(() => delete root.dataset.uaTransition, 600);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return (
    <ViewTransition key={pathname} exit="page-out" default="none">
      <Page>{children}</Page>
    </ViewTransition>
  );
}

function Page({ children }: { children: ReactNode }) {
  const [enter] = useState(() => hydrated);
  useEffect(() => {
    hydrated = true;
  }, []);
  /* The frame clips the slide sideways: 8 px past the edge is overflow, and a
     phone widens its layout viewport to fit it, which aborts the transition. */
  return (
    <div className="page-frame">
      <div className={enter ? "page-enter" : undefined}>{children}</div>
    </div>
  );
}
