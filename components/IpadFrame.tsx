import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * iPad mockup — a real product screenshot dressed as a tablet.
 *
 * The device is drawn entirely from the house tokens (`--espresso` family,
 * `--on-espresso`, `--shadow-lift`), each of which is defined for both themes,
 * so the frame never branches on light/dark. The bezel highlight is an *inset*
 * ring against the device's own dark body rather than an outline against the
 * page, which is what keeps the mockup legible on a cream band, on the espresso
 * band, and on the dark theme alike.
 *
 * Geometry is expressed as `clamp(rem, %, rem)` against the component's own
 * width, so the bezel and corner radius stay proportional from a 320px phone up
 * to the desktop cap without a single breakpoint.
 *
 * RTL: nothing here is directional. The camera is centred with `justify-center`
 * inside a symmetric `inset-x-0` strip rather than a `start`/`left` offset, so
 * Arabic renders the identical device.
 */

export type IpadOrientation = "landscape" | "portrait";

/** Native pixel size of the captures this frame is built for (exactly 4:3). */
const NATIVE: Record<IpadOrientation, { width: number; height: number }> = {
  landscape: { width: 1376, height: 1032 },
  portrait: { width: 1032, height: 1376 },
};

/** Desktop caps. Wider than this and a screenshot reads as a browser, not a device. */
const MAX_WIDTH: Record<IpadOrientation, string> = {
  landscape: "56rem",
  portrait: "24rem",
};

/** Must mirror MAX_WIDTH so the optimiser picks the right srcset candidate. */
const SIZES: Record<IpadOrientation, string> = {
  landscape: "(min-width: 1024px) 896px, 100vw",
  portrait: "(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw",
};

export type IpadFrameProps = {
  /** Path under /public, e.g. "/screenshots/pos-order.webp". */
  src: string;
  /** Describes the screen contents — pass a translated string. */
  alt: string;
  orientation?: IpadOrientation;
  /** Layout classes for the wrapper (margins, grid placement). */
  className?: string;
  /** Override the desktop cap, e.g. "42rem". Any CSS length. */
  maxWidth?: string;
  /** Override the `sizes` hint when the layout is narrower than the cap. */
  sizes?: string;
  /** Set on the one mockup that is above the fold. */
  priority?: boolean;
  /**
   * Only pass a value already listed in `images.qualities` in next.config.ts
   * (the Next default is `[75]`); the optimiser rejects anything else with a
   * 400 at request time.
   */
  quality?: number;
};

export default function IpadFrame({
  src,
  alt,
  orientation = "landscape",
  className = "",
  maxWidth,
  sizes,
  priority = false,
  quality,
}: IpadFrameProps) {
  const native = NATIVE[orientation];
  const portrait = orientation === "portrait";

  const deviceStyle = {
    "--ipad-bezel": "clamp(0.5rem, 2.6%, 1.35rem)",
    "--ipad-radius": "clamp(0.9rem, 4.4%, 2.1rem)",
    padding: "var(--ipad-bezel)",
    borderRadius: "var(--ipad-radius)",
    // Warm anodised body: the espresso family reads as a device against both
    // the cream page and the dark theme, where --espresso sits below --bg.
    background:
      "linear-gradient(157deg, var(--espresso-2) 0%, var(--espresso) 44%, var(--espresso-2) 100%)",
    boxShadow: [
      "var(--shadow-lift)",
      // Machined edge highlight — measured against the body, not the page.
      "inset 0 0 0 1px color-mix(in srgb, var(--on-espresso) 16%, transparent)",
      "inset 0 1px 1px 0 color-mix(in srgb, var(--on-espresso) 26%, transparent)",
      "inset 0 -1px 1px 0 rgba(0, 0, 0, 0.55)",
    ].join(", "),
  } as CSSProperties;

  const screenStyle: CSSProperties = {
    // Concentric with the body: the screen radius is the shell radius minus
    // most of the bezel, floored so tiny frames keep a rounded corner.
    borderRadius: "max(0.3rem, calc(var(--ipad-radius) - var(--ipad-bezel) * 0.8))",
    background: "var(--espresso)",
    boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.6)",
  };

  const cameraDot: CSSProperties = {
    width: "clamp(0.2rem, 0.6%, 0.4rem)",
    height: "clamp(0.2rem, 0.6%, 0.4rem)",
    background:
      "radial-gradient(circle at 34% 30%, color-mix(in srgb, var(--on-espresso) 48%, transparent), rgba(0, 0, 0, 0.92) 76%)",
    boxShadow: "0 0 0 1px color-mix(in srgb, var(--on-espresso) 12%, transparent)",
  };

  return (
    <div
      className={`mx-auto w-full ${className}`.trim()}
      style={{ maxWidth: maxWidth ?? MAX_WIDTH[orientation] }}
    >
      <div className="relative w-full" style={deviceStyle}>
        {/* Front camera, centred in the top bezel in both writing directions. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 flex justify-center"
          style={{
            top: "calc(var(--ipad-bezel) / 2)",
            transform: "translateY(-50%)",
          }}
        >
          <span className="block rounded-full" style={cameraDot} />
        </span>

        <div
          className={`relative w-full overflow-hidden ${
            portrait ? "aspect-[3/4]" : "aspect-[4/3]"
          }`}
          style={screenStyle}
        >
          <Image
            src={src}
            alt={alt}
            width={native.width}
            height={native.height}
            sizes={sizes ?? SIZES[orientation]}
            priority={priority}
            quality={quality}
            className="h-full w-full object-cover"
          />
          {/* Glass sheen. Decorative only, and kept faint enough that dense UI
              text underneath stays readable. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(154deg, rgba(255, 255, 255, 0.11) 0%, rgba(255, 255, 255, 0.03) 20%, transparent 44%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
