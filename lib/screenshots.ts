/**
 * Product screenshots, with the aspect each was actually captured at.
 *
 * A browser window does not hand back a tidy 4:3, and the captures here range
 * from a 16:9-ish 1480x811 to a portrait 1032x1376. An earlier pass forced them
 * all to 4:3 with `sips -c`, which CROPS AND PADS rather than scales — it
 * sliced the sidebar off the admin console and added black bars top and bottom.
 *
 * So the images are shipped at their native aspect and the device frame adopts
 * it. Every consumer reads the ratio from here rather than hardcoding one, so
 * adding a capture at a new size cannot silently reintroduce the cropping.
 *
 * The `-v2` suffix is deliberate. A previous deploy shipped different bytes at
 * the same paths, and Next serves optimised images from an immutable-cached
 * URL keyed on the source path — a returning visitor would keep the old,
 * cropped copy indefinitely. Renaming the file is the only reliable bust.
 */
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

const WIDE = { width: 1480, height: 811 };   // current capture viewport
const FOUR3 = { width: 1376, height: 1032 }; // the older set
const wide = WIDE.width / WIDE.height;
const four3 = FOUR3.width / FOUR3.height;

export const SHOTS = {
  posOrder: { src: "/screenshots/pos-order-v2.webp", ...WIDE, aspect: wide },
  posItem: { src: "/screenshots/pos-item.webp", ...FOUR3, aspect: four3 },
  posPayment: { src: "/screenshots/pos-payment.webp", ...FOUR3, aspect: four3 },
  posReceipt: { src: "/screenshots/pos-receipt-print.webp", ...FOUR3, aspect: four3 },
  kds: { src: "/screenshots/pos-kds-v2.webp", ...WIDE, aspect: wide },
  shopMenu: { src: "/screenshots/shop-menu-v2.webp", ...WIDE, aspect: wide },
  adminDashboard: { src: "/screenshots/admin-dashboard-v2.webp", ...WIDE, aspect: wide },
  adminReports: { src: "/screenshots/admin-reports-v2.webp", ...WIDE, aspect: wide },
  adminMenu: { src: "/screenshots/admin-menu-v2.webp", ...WIDE, aspect: wide },
  adminInventory: { src: "/screenshots/admin-inventory-v2.webp", ...WIDE, aspect: wide },
  adminPermissions: { src: "/screenshots/admin-permissions.webp", ...FOUR3, aspect: four3 },
  shellSettings: {
    src: "/screenshots/shell-settings.webp",
    width: 1032,
    height: 1376,
    aspect: 1032 / 1376,
    orientation: "portrait",
  },
} as const satisfies Record<string, Shot>;

/** Lookup by path, so IpadFrame can size itself from `src` alone. */
export const ASPECT_BY_SRC: Record<string, number> = Object.fromEntries(
  Object.values(SHOTS).map((s) => [s.src, s.aspect]),
);

/** True file dimensions, for next/image's intrinsic sizing. */
export const DIMS_BY_SRC: Record<string, { width: number; height: number }> =
  Object.fromEntries(
    Object.values(SHOTS).map((s) => [s.src, { width: s.width, height: s.height }]),
  );
