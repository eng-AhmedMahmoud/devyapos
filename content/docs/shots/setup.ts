import { BOTH, DESKTOP, type ShotSpec } from "../surfaces.ts";

/**
 * Screenshot slots used by the "setup" articles, plus the two back-office-tour slots
 * that getting-started/back-office-tour shows (kept here under their first ids). Ids start
 * with the product. All are read-only screens; checked at bohub-pos origin/main efacd1b5.
 * Demo-seed notes (backend/prisma/seed-data-demo): the sizes Sales Analysis has rows only
 * after prisma/demo-orders.ts --apply; no option group is seeded, so the Option Groups view
 * shows its empty state; demo branches carry no printer address, so the shift screen's
 * printer card reads "No printer set".
 */
export const shots = {
  /* back-office-tour (getting-started) */
  "pos-setup-tour-dashboard": { surface: "pos-admin", path: "/dashboard", devices: BOTH },
  "pos-setup-tour-more": { surface: "pos-admin", path: "/more", devices: ["phone"] },

  /* business-settings-and-tax */
  "pos-setup-settings": { surface: "pos-admin", path: "/settings", devices: BOTH },

  /* build-your-menu: the menu's tabs are URL-addressable (?tab=). */
  "pos-setup-menu-categories": { surface: "pos-admin", path: "/menu?tab=categories", devices: BOTH },
  "pos-setup-menu-products": { surface: "pos-admin", path: "/menu?tab=products", devices: BOTH },

  /* sizes-and-option-groups: the tab opens on Sales Analysis; Option Groups is a sub-view button. */
  "pos-setup-menu-sizes": { surface: "pos-admin", path: "/menu?tab=modifiers", devices: DESKTOP },
  "pos-setup-menu-option-groups": {
    surface: "pos-admin",
    path: "/menu?tab=modifiers",
    devices: DESKTOP,
    clicks: ['button:has-text("Option Groups"), button:has-text("مجموعات الإضافات")'],
  },

  /* staff-and-permissions */
  "pos-setup-staff": { surface: "pos-admin", path: "/staff", devices: BOTH },
  "pos-setup-permissions": { surface: "pos-admin", path: "/permissions", devices: DESKTOP },

  /* receipt-printers: the branch list (the printer field is in its edit dialog), and the
     register's Shift screen with its Receipt printer card. */
  "pos-setup-branches": { surface: "pos-admin", path: "/branches", devices: BOTH },
  "pos-setup-shift-printer": { surface: "pos-register", path: "/shift", devices: BOTH },
} as const satisfies Record<string, ShotSpec>;
