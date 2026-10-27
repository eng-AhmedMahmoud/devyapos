import { DESKTOP, type ShotSpec } from "../surfaces.ts";

/** Screenshot slots used by the "loyalty" articles. Ids start with the product. */
export const shots = {
  /* The till's Pay screen with its "Loyalty points" block. Needs an open shift on
     the demo branch: one product tile, then "Add to order", then "Pay" — all
     client-side (bohub-pos e2e/pos-garden-member.spec.ts reaches it the same way). The block draws
     with the `loyalty` flag; with `garden` + `gardenNetwork` on (the demo seed turns every flag on)
     it also draws the garden member card, which this site does not sell — capture with those off. */
  "pos-loyalty-pay-screen": {
    surface: "pos-register",
    path: "/pos",
    devices: DESKTOP,
    clicks: [
      ".lg\\:grid-cols-3 button",
      "role=button[name=/^(Add to order|إضافة إلى الطلب)/]",
      "role=button[name=/^(Pay|الدفع)/]",
    ],
  },
} as const satisfies Record<string, ShotSpec>;
