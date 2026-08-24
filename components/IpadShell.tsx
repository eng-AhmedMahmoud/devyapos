import type { CSSProperties, ReactNode } from "react";

/**
 * The iPad chrome on its own — body, camera, screen well and glass sheen —
 * with whatever goes on the glass passed as children.
 *
 * Extracted from `IpadFrame` once a second thing needed to sit in a device: the
 * promo clip. Duplicating the bezel maths would have meant two mockups drifting
 * apart the first time a radius changed, and the shell is the part with all the
 * fiddly proportional geometry in it.
 *
 * Everything is drawn from the house tokens (`--espresso` family,
 * `--on-espresso`, `--shadow-lift`), each defined for both themes, so the frame
 * never branches on light/dark. The bezel highlight is an *inset* ring against
 * the device's own dark body rather than an outline against the page, which is
 * what keeps it legible on a cream band, on the espresso band, and in dark mode
 * alike.
 *
 * Geometry is `clamp(rem, %, rem)` against the component's own width, so bezel
 * and corner radius stay proportional from a 320px phone to the desktop cap
 * without a single breakpoint.
 *
 * RTL: nothing here is directional. The camera is centred with `justify-center`
 * inside a symmetric `inset-x-0` strip rather than a `start`/`left` offset, so
 * Arabic renders the identical device.
 */
export default function IpadShell({
  aspect,
  maxWidth,
  className = "",
  children,
}: {
  /** Screen ratio as width / height. */
  aspect: number;
  /** CSS length capping the device width. */
  maxWidth: string;
  className?: string;
  /** Goes on the glass; should fill its box. */
  children: ReactNode;
}) {
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

  const cameraDot: CSSProperties = {
    width: "clamp(0.2rem, 0.6%, 0.4rem)",
    height: "clamp(0.2rem, 0.6%, 0.4rem)",
    background:
      "radial-gradient(circle at 34% 30%, color-mix(in srgb, var(--on-espresso) 48%, transparent), rgba(0, 0, 0, 0.92) 76%)",
    boxShadow: "0 0 0 1px color-mix(in srgb, var(--on-espresso) 12%, transparent)",
  };

  return (
    <div className={`mx-auto w-full ${className}`.trim()} style={{ maxWidth }}>
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
          className="relative w-full overflow-hidden"
          style={{
            // Concentric with the body: the screen radius is the shell radius
            // minus most of the bezel, floored so tiny frames keep a corner.
            borderRadius:
              "max(0.3rem, calc(var(--ipad-radius) - var(--ipad-bezel) * 0.8))",
            background: "var(--espresso)",
            boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.6)",
            // Inline rather than a Tailwind aspect-[] class: the ratio comes
            // from the capture at runtime, so it cannot be a static class name.
            aspectRatio: String(aspect),
          }}
        >
          {children}
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
