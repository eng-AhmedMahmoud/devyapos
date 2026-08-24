"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import IpadShell from "@/components/IpadShell";

/**
 * A short screen recording playing inside the same tablet as the screenshots.
 *
 * Loading is driven explicitly rather than by the `autoplay`/`preload`
 * attributes. Left to itself the element fired `loadstart` then `stalled` and
 * sat at `readyState 0` forever — the browser never retries a stalled media
 * fetch on its own, and the section showed a permanent poster. So: `preload`
 * stays `none`, and the first time the device comes near the viewport we call
 * `load()` and `play()` ourselves, with a one-shot `load()` retry if the fetch
 * stalls again. That also means a visitor who never scrolls this far never
 * pays for the clip.
 *
 * Playback is muted and inline, always. Every browser blocks a clip with
 * sound, and iOS takes a non-`playsInline` video fullscreen, which would hijack
 * the page on a phone. `play()` rejections are swallowed: a blocked autoplay
 * leaves the poster frame up, which is a fine resting state rather than an
 * error worth logging.
 *
 * Visibility also drives pausing — a four-second loop running forever in a
 * section nobody is looking at is a battery tax on mobile.
 *
 * `prefers-reduced-motion` never starts on its own. The clip is decorative; the
 * argument is made in the text beside it. That path shows the poster and a real
 * control, and fetches nothing until it is pressed.
 */
export default function IpadVideo({
  src,
  poster,
  aspect,
  label,
  playLabel,
  maxWidth = "56rem",
  className = "",
}: {
  /** Path under /public. */
  src: string;
  /** Poster image path under /public. */
  poster: string;
  /** Screen ratio as width / height, matching the recording. */
  aspect: number;
  /** Describes the recording for assistive tech — pass a translated string. */
  label: string;
  /** Accessible name for the reduced-motion play button. */
  playLabel: string;
  maxWidth?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  // Assume motion is fine until the media query has actually been read, so the
  // server markup and the common case agree and the button never flashes in.
  const [reduced, setReduced] = useState(false);
  const [started, setStarted] = useState(false);

  /**
   * Fetch if nothing has been fetched yet, then try to play.
   *
   * `preload` is raised to "auto" first, and that ordering matters: `load()`
   * honours the current `preload`, so calling it while still "none" only does
   * resource selection and fetches no bytes. It happens to work anyway because
   * `play()` forces a fetch, but relying on that leaves the element one
   * refactor away from silently never loading.
   */
  const start = useCallback((el: HTMLVideoElement) => {
    if (el.preload !== "auto") el.preload = "auto";
    if (el.networkState === el.NETWORK_EMPTY) el.load();
    void el.play().catch(() => {});
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // One retry on a stalled fetch. Bounded deliberately: a clip that cannot
  // load twice is a clip the visitor should stop waiting for, and an unbounded
  // retry on a flaky connection would just hammer it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let retried = false;
    const onStalled = () => {
      if (retried || el.readyState > 0) return;
      retried = true;
      el.load();
      void el.play().catch(() => {});
    };
    el.addEventListener("stalled", onStalled);
    el.addEventListener("error", onStalled);
    return () => {
      el.removeEventListener("stalled", onStalled);
      el.removeEventListener("error", onStalled);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || (reduced && !started)) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) start(el);
        else el.pause();
      },
      // Begin fetching just before it is on screen, so the first loop is
      // already running by the time it is actually looked at.
      { threshold: 0.2, rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, started, start]);

  return (
    <IpadShell aspect={aspect} maxWidth={maxWidth} className={className}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        className="h-full w-full object-contain"
      />
      {reduced && !started && (
        <button
          type="button"
          onClick={() => {
            setStarted(true);
            if (ref.current) start(ref.current);
          }}
          aria-label={playLabel}
          className="
            absolute inset-0 flex items-center justify-center
            bg-black/25 transition-colors hover:bg-black/35
          "
        >
          <span
            className="
              flex h-16 w-16 items-center justify-center rounded-full
              bg-[var(--on-espresso)]/90 text-[var(--espresso)] shadow-lg
            "
          >
            {/* Nudged by a hair: a triangle's optical centre sits inside its
                bounding box. Logical property so RTL does not mirror the
                nudge onto the wrong side. */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="h-7 w-7 ps-[2px]"
            >
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
          </span>
        </button>
      )}
    </IpadShell>
  );
}
