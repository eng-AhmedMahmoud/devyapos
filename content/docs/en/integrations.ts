import type { DocCategory } from "../types";
import { articles } from "./parts/integrations";

export const integrations: DocCategory = {
  id: "integrations",
  group: "grow",
  icon: "link",
  title: "Integrations",
  description: "E-invoicing, delivery-app orders, API keys and webhooks, and the Accounting app.",
  articles,
};
