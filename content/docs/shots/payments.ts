import { BOTH, type ShotSpec } from "../surfaces.ts";

/**
 * Screenshot slots used by the "payments" articles. Ids start with "pos-".
 * payment-methods also shows the register's Pay dialog and close form, whose
 * slots live in shots/selling.ts (pos-register-pay, pos-register-close-shift).
 * online-payments has no slot: the ordering site's payment choice only shows
 * with a filled cart, and the gateway is set up per account, not on a screen.
 */
export const shots = {
  /* payment-methods: admin-app /reports opens on the Daily tab (app/reports/page.tsx); its
     "By payment method" card is a KeyValueCard <h2>. Needs today's demo orders
     (`backend/prisma/demo-orders.ts --apply`, which writes today by default); they are rung on
     cash, card, Instapay and online payment. Without them the card lists every method at 0. */
  "pos-payments-by-method": {
    surface: "pos-admin",
    path: "/reports",
    devices: BOTH,
    scrollTo: 'h2:text-is("حسب طريقة الدفع"), h2:text-is("By payment method")',
  },
} as const satisfies Record<string, ShotSpec>;
