import { BOTH, DESKTOP, type ShotSpec } from "../surfaces.ts";

/**
 * Screenshot slots used by the "pos-selling" articles. Ids start with the product.
 * The register (`/pos`) and the close form on `/shift` need the demo account to have an open
 * shift at its branch (an admin account also needs a branch picked); without one they show the
 * "No open shift" gate or the open-shift form. Nothing here writes: the product and pay dialogs
 * live in the browser until "Confirm payment", which is never pressed.
 */
export const shots = {
  /* sign-in-and-open-a-shift */
  "pos-register-login": { surface: "pos-register", path: "/login", devices: BOTH, signedOut: true },
  "pos-register-shift": { surface: "pos-register", path: "/shift", devices: BOTH },
  /* take-an-order */
  "pos-register-sale": { surface: "pos-register", path: "/pos", devices: BOTH },
  /* discounts-and-coupons: open the first menu tile, add it, open Pay, then scroll to the coupon
     box (checked at bohub-pos efacd1b5). pos-app/app/pos/page.tsx: a menu tile is the only
     `min-h-36` button and has no fixed text; ProductModal.tsx is a role="dialog" whose submit reads
     product.addToCart; the Pay button's first span is pos.pay ("الدفع" / "Pay") with the subtotal
     in a second span, so it is matched by that span. Desktop only: on a phone the cart (and Pay)
     sits behind "View order". */
  "pos-register-pay-discounts": {
    surface: "pos-register",
    path: "/pos",
    devices: DESKTOP,
    clicks: [
      "button.min-h-36",
      '[role="dialog"] button:has-text("إضافة إلى الطلب"), [role="dialog"] button:has-text("Add to order")',
      'button:has(> span:text-is("الدفع")), button:has(> span:text-is("Pay"))',
    ],
    scrollTo: 'input[placeholder="أدخل كود الخصم"], input[placeholder="Enter discount code"]',
  },
  /* take-payment: the same three clicks, the Pay dialog as it opens. Both Pay shots need the
     `garden` flag off on the capture tenant (the demo seed's "all" turns it on), or PayModal.tsx
     draws the Garden voucher box this site must not show. */
  "pos-register-pay": {
    surface: "pos-register",
    path: "/pos",
    devices: DESKTOP,
    clicks: [
      "button.min-h-36",
      '[role="dialog"] button:has-text("إضافة إلى الطلب"), [role="dialog"] button:has-text("Add to order")',
      'button:has(> span:text-is("الدفع")), button:has(> span:text-is("Pay"))',
    ],
  },
  /* gift-cards: needs the gift-card feature on the demo tenant. */
  "pos-register-gift-cards": { surface: "pos-register", path: "/gift-cards", devices: BOTH },
  /* receipts-and-order-numbers: no order id is known ahead of time — open the first row
     (pos-app/app/orders/page.tsx renders each row as `li[data-order-id] > button`). */
  "pos-register-order-drawer": {
    surface: "pos-register",
    path: "/orders",
    devices: BOTH,
    clicks: ["li[data-order-id] > button"],
  },
  /* orders-cancellations-and-returns */
  "pos-register-orders": { surface: "pos-register", path: "/orders", devices: BOTH },
  /* close-the-shift: "Close shift" only opens the count form and reads the running Z-report (GET). */
  "pos-register-close-shift": {
    surface: "pos-register",
    path: "/shift",
    devices: BOTH,
    clicks: ['button:text-is("إغلاق الوردية"), button:text-is("Close shift")'],
  },
  /* kitchen-display */
  "pos-register-kds": { surface: "pos-register", path: "/kds", devices: BOTH },
} as const satisfies Record<string, ShotSpec>;
