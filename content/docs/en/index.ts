import type { DocsContent } from "../types";
import { gettingStarted } from "./getting-started";
import { posJourneys } from "./journeys";
import { posSetup } from "./setup";
import { payments } from "./payments";
import { branches } from "./branches";
import { posSelling } from "./selling";
import { onlineOrdering } from "./online-ordering";
import { posInventory } from "./inventory";
import { reports } from "./reports";
import { assistant } from "./assistant";
import { loyalty } from "./loyalty";
import { integrations } from "./integrations";
import { faq } from "./faq";
import { ui } from "./ui";

/* Follows content/docs/ar/index.ts category for category. */
export const enDocs: DocsContent = {
  ui,
  startHere: [
    "getting-started/get-started-with-pos",
    "journeys/owner-setup",
    "setup/build-your-menu",
    "journeys/cashier-shift",
    "assistant/ask-the-assistant",
  ],
  popular: [
    "journeys/owner-setup",
    "selling/sign-in-and-open-a-shift",
    "setup/build-your-menu",
    "payments/payment-methods",
    "setup/receipt-printers",
    "setup/staff-and-permissions",
    "selling/close-the-shift",
    "reports/sales-reports",
    "assistant/ask-the-assistant",
  ],
  /* Reading order: setting the restaurant up, running the day, then the numbers and what connects to them. */
  categories: [
    gettingStarted,
    posJourneys,
    posSetup,
    payments,
    branches,
    posSelling,
    onlineOrdering,
    posInventory,
    reports,
    assistant,
    loyalty,
    integrations,
    faq,
  ],
};
