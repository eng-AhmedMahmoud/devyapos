import Image from "next/image";
import IpadShell from "@/components/IpadShell";
import { ASPECT_BY_SRC, DIMS_BY_SRC } from "@/lib/screenshots";

/**
 * iPad mockup — a real product screenshot dressed as a tablet.
 *
 * The device chrome lives in `IpadShell`, shared with the promo clip so the two
 * mockups cannot drift apart. This file is only concerned with getting the
 * screenshot onto the glass at the ratio it was actually captured at.
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
  /**
   * Screen aspect as width/height, when the capture is not 4:3.
   *
   * The frame was built for 4:3 captures, but a browser window rarely gives
   * exactly that. Forcing one meant either cropping the sides off (losing a
   * sidebar or a totals column) or letterboxing. Passing the capture's real
   * aspect lets the screen match it, so the shot fills the glass edge to edge
   * and nothing is lost. Defaults to the orientation's native 4:3.
   */
  aspect?: number;
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
  aspect,
  className = "",
  maxWidth,
  sizes,
  priority = false,
  quality,
}: IpadFrameProps) {
  // next/image lays the image out at the ratio of the width/height it is
  // GIVEN, not the ratio of the bytes. Feeding it the orientation constant
  // meant a wide capture was declared 4:3 and boxed to match, which is what
  // put the black bars back after the crop was fixed. Real dimensions first.
  const native = DIMS_BY_SRC[src] ?? NATIVE[orientation];
  const portrait = orientation === "portrait";

  return (
    <IpadShell
      className={className}
      maxWidth={maxWidth ?? MAX_WIDTH[orientation]}
      // Explicit prop wins; otherwise the manifest knows what this capture was
      // actually shot at; 4:3 only as a last resort.
      aspect={aspect ?? ASPECT_BY_SRC[src] ?? (portrait ? 3 / 4 : 4 / 3)}
    >
      <Image
        src={src}
        alt={alt}
        width={native.width}
        height={native.height}
        sizes={sizes ?? SIZES[orientation]}
        priority={priority}
        quality={quality}
        /* `contain`, not `cover`. A capture whose aspect is not exactly 4:3
           gets letterboxed against the screen fill rather than having its
           edges sliced off — losing a sidebar or a totals column is far worse
           on a product screenshot than a thin margin. */
        className="h-full w-full object-contain"
      />
    </IpadShell>
  );
}
