/**
 * Product screenshots, with the aspect each was actually captured at.
 *
 * A browser window does not hand back a tidy ratio, so images ship at their
 * native aspect and the device frame adopts it. Every consumer reads the ratio
 * from here rather than hardcoding one — an earlier pass forced everything to
 * 4:3, which cropped the sidebar off the admin console.
 *
 * The `-demo` suffix is doing real work. Next serves optimised images from an
 * immutable-cached URL keyed on the source path, so shipping different bytes at
 * an old path leaves returning visitors on the previous image forever. These
 * paths differ from the withdrawn client captures, which busts that cache.
 */
/**
 * Whether product media may be shown at all.
 *
 * Turned back on 2026-08-29. The original captures came from a client
 * deployment and carried that client's logo, name and menu; they were
 * withdrawn at the client's request and are gone from the repo.
 *
 * Everything here is now captured from the neutral DevyaPOS Demo tenant,
 * which runs this same build against fictional data. That is the standing
 * rule: marketing media comes from the demo tenant, never from a client's
 * deployment. See docs/guides/white-label.md in the platform monorepo.
 */
export const PRODUCT_MEDIA_AVAILABLE = true;

/**
 * The register recording, tracked separately from the stills so either can
 * ship without the other. Both are now captured from the demo tenant.
 */
export const PROMO_CLIP_AVAILABLE = true;

export interface Shot {
  src: string;
  /** Real pixel size of the file. next/image needs the TRUE dimensions:
   *  declaring a different ratio makes it lay the image out at that ratio
   *  regardless of the bytes, which is how the 4:3 constant survived the
   *  switch to wide captures and kept them boxed. */
  width: number;
  height: number;
  /** width / height, as captured. */
  aspect: number;
  orientation?: "landscape" | "portrait";
}

const WIDE = { width: 1450, height: 840 };  // demo-tenant capture viewport
const POS = { width: 1481, height: 812 };   // the register was captured wider
const wide = WIDE.width / WIDE.height;
const pos = POS.width / POS.height;

export const SHOTS = {
  posOrder: { src: "/screenshots/pos-order-demo.webp", ...POS, aspect: pos },
  kds: { src: "/screenshots/pos-kds-demo.webp", ...WIDE, aspect: wide },
  shopMenu: { src: "/screenshots/shop-menu-demo.webp", ...WIDE, aspect: wide },
  adminDashboard: {
    src: "/screenshots/admin-dashboard-demo.webp",
    ...WIDE,
    aspect: wide,
  },
  adminReports: {
    src: "/screenshots/admin-reports-demo.webp",
    ...WIDE,
    aspect: wide,
  },
  adminMenu: { src: "/screenshots/admin-menu-demo.webp", ...WIDE, aspect: wide },
  adminInventory: {
    src: "/screenshots/admin-inventory-demo.webp",
    ...WIDE,
    aspect: wide,
  },
} as const satisfies Record<string, Shot>;

/**
 * The promo recording. Kept here with the stills for one reason: the tablet
 * frame sizes its glass from an aspect number, and an aspect that disagrees
 * with the file letterboxes the clip exactly the way the hardcoded 4:3 used to
 * letterbox the screenshots. 1450x840 is the capture viewport it was shot at.
 */
export const PROMO_CLIP = {
  src: "/video/pos-demo.mp4",
  poster: "/video/pos-demo-poster.webp",
  width: 1450,
  height: 840,
  aspect: 1450 / 840,
} as const;

/** Lookup by path, so IpadFrame can size itself from `src` alone. */
export const ASPECT_BY_SRC: Record<string, number> = Object.fromEntries(
  Object.values(SHOTS).map((s) => [s.src, s.aspect]),
);

/** True file dimensions, for next/image's intrinsic sizing. */
export const DIMS_BY_SRC: Record<string, { width: number; height: number }> =
  Object.fromEntries(
    Object.values(SHOTS).map((s) => [s.src, { width: s.width, height: s.height }]),
  );
