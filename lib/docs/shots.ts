import captured from "@/content/docs/shots.captured.json";
import {
  SHOTS,
  SURFACES,
  type ShotDevice,
  type ShotId,
  type ShotSpec,
  type ShotSurface,
} from "@/content/docs/shots";

/**
 * What the capture script has actually shot, per slot, locale and device —
 * `content/docs/shots.captured.json`, written by scripts/capture-docs.mjs next
 * to the images in public/docs/shots/. A slot with no entry renders as a
 * drawn placeholder (components/docs/Figure.tsx).
 */
export interface CapturedImage {
  src: string;
  w: number;
  h: number;
}

type CapturedFile = Record<
  string,
  {
    capturedAt: string;
    source: string;
    images: Partial<Record<string, Partial<Record<ShotDevice, { w: number; h: number }>>>>;
  }
>;

const CAPTURED = captured as CapturedFile;

/** Public path of one captured image. The script writes exactly this name. */
export function shotPath(id: string, locale: string, device: ShotDevice) {
  return `/docs/shots/${id}.${locale}.${device}.webp`;
}

export function capturedShot(
  id: ShotId,
  locale: string,
): Partial<Record<ShotDevice, CapturedImage>> | undefined {
  const sizes = CAPTURED[id]?.images[locale];
  if (!sizes) return undefined;
  const out: Partial<Record<ShotDevice, CapturedImage>> = {};
  for (const device of ["desktop", "phone"] as const) {
    const size = sizes[device];
    if (size) out[device] = { src: shotPath(id, locale, device), ...size };
  }
  return Object.keys(out).length ? out : undefined;
}

/** A slot's spec and the app it is shot in (named on the figure's frame). */
export function shotSpec(id: ShotId): ShotSpec & { app: ShotSurface["app"] } {
  const spec: ShotSpec = (SHOTS as Record<string, ShotSpec>)[id];
  return { ...spec, app: SURFACES[spec.surface].app };
}
