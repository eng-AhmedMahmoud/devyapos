"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

/** A mouse or trackpad that hovers — the only pointer this cursor draws for. */
export const FINE = "(hover: hover) and (pointer: fine)";
/** Where it never runs: reduced motion, or colours the system forces. */
export const QUIET = "(prefers-reduced-motion: reduce), (forced-colors: active)";

const CLICKABLE =
  'a[href], button, summary, label, select, [role="button"], [role="link"], [role="tab"], [role="radio"], [role="checkbox"], [role="switch"], [role="menuitem"], [role="option"], input[type="button"], input[type="submit"], input[type="reset"], input[type="checkbox"], input[type="radio"], input[type="range"], input[type="color"], input[type="file"], input[type="image"]';
/** Text fields: the system's caret stays, the ring shows the text state. */
const FIELD =
  'textarea, [contenteditable]:not([contenteditable="false"]), input:not([type="button"], [type="submit"], [type="reset"], [type="checkbox"], [type="radio"], [type="range"], [type="color"], [type="file"], [type="image"], [type="hidden"])';
/** Selectable copy keeps the system's I-beam too (the same list as the CSS). */
const TEXT =
  "p, h1, h2, h3, h4, h5, h6, li, dt, dd, blockquote, figcaption, td, th, pre, address";
/** Where the system cursor takes over entirely: framed pages, and anything open above the page. */
const NATIVE = "iframe";
/** The quick look is a modal <dialog>; the phone menu's drawer is one too, over its scrim. */
const MODAL =
  'dialog[open], [aria-modal="true"], [role="dialog"][data-state="open"], .nav-drawer.is-open';
/** Share of the gap the ring closes per 1/60 s. */
const EASE = 0.22;

type State = "idle" | "link" | "text" | "label" | "native";

function stateOf(target: Element | null): State {
  if (!target || target.closest(NATIVE) || document.querySelector(MODAL)) return "native";
  if (target.closest("[data-cursor]")) return "label";
  if (target.closest(FIELD)) return "text";
  if (target.closest(CLICKABLE)) return "link";
  return target.closest(TEXT) ? "text" : "idle";
}

function subscribe(onChange: () => void) {
  const queries = [window.matchMedia(FINE), window.matchMedia(QUIET)];
  queries.forEach((q) => q.addEventListener("change", onChange));
  return () => queries.forEach((q) => q.removeEventListener("change", onChange));
}

function isEnabled() {
  return window.matchMedia(FINE).matches && !window.matchMedia(QUIET).matches;
}

/**
 * The site's cursor, Moving Stores' (devya-commerce landing-cursor.tsx): a
 * dot on the pointer and a ring that trails it, grows over anything
 * clickable, turns into a text frame over copy and fields (the system's
 * I-beam and caret stay), shows a label where an element asks for one with
 * `data-cursor`, and presses with the button.
 *
 * Mounted only for a hovering fine pointer with motion allowed. The system
 * cursor is hidden (`.cursor-on` on <html>) only while this one is on screen:
 * not before the first mouse move, never for touch or pen, and not over a
 * framed page or while a modal is open — the cursor sits under modals.
 * Movement is one requestAnimationFrame loop writing transforms; it reads no
 * layout and stops when the ring comes to rest.
 */
export default function Cursor() {
  // The server snapshot is "off": the elements only exist after hydration.
  const enabled = useSyncExternalStore(subscribe, isEnabled, () => false);
  return enabled ? <CursorLayer /> : null;
}

function CursorLayer() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const [r, d, l] = [ring.current, dot.current, label.current];
    if (!r || !d || !l) return;
    const root = document.documentElement;
    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let frame = 0;
    let last = 0;
    let shown = false;
    /** A mouse is over the page (not touch or pen, not outside the window). */
    let inside = false;
    /** Over a framed page, or a modal is open: the system cursor's turn. */
    let native = false;

    const show = (visible: boolean) => {
      if (visible === shown) return;
      shown = visible;
      r.dataset.visible = d.dataset.visible = String(visible);
      root.classList.toggle("cursor-on", visible);
    };
    const hide = () => {
      inside = false;
      show(false);
    };
    const tick = (now: number) => {
      // Frame-rate independent: the same easing at 60, 120 or 144 Hz.
      const k = last ? 1 - (1 - EASE) ** (Math.min(now - last, 100) / (1000 / 60)) : EASE;
      last = now;
      rx += (x - rx) * k;
      ry += (y - ry) * k;
      const moving = Math.abs(x - rx) + Math.abs(y - ry) > 0.2;
      if (!moving) {
        rx = x;
        ry = y;
        last = 0;
      }
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      // Shown, and the system cursor hidden, only once it is drawn on the pointer.
      show(inside && !native);
      frame = moving ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return hide();
      inside = true;
      x = event.clientX;
      y = event.clientY;
      if (!shown) {
        // Appearing: the ring starts on the pointer rather than flying in.
        rx = x;
        ry = y;
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = event.target instanceof Element ? event.target : null;
      const state = stateOf(target);
      native = state === "native";
      if (native) return show(false);
      if (state === "label") {
        l.textContent = target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
      }
      r.dataset.state = d.dataset.state = state;
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") r.dataset.pressed = "true";
    };
    const onUp = () => {
      delete r.dataset.pressed;
      // A click can open a modal under a still pointer: step aside for it.
      requestAnimationFrame(() => {
        if (document.querySelector(MODAL)) {
          native = true;
          show(false);
        }
      });
    };
    const onOut = (event: MouseEvent) => {
      if (!event.relatedTarget) hide();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    window.addEventListener("blur", hide);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("blur", hide);
      cancelAnimationFrame(frame);
      root.classList.remove("cursor-on");
    };
  }, []);

  return (
    <>
      <div ref={ring} aria-hidden="true" className="cursor" data-visible="false" data-state="idle">
        <span className="cursor-ring" />
        <span className="cursor-caret" />
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} aria-hidden="true" className="cursor-dot" data-visible="false" data-state="idle" />
    </>
  );
}
