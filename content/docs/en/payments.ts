import type { DocCategory } from "../types";
import { articles } from "./parts/payments";

export const payments: DocCategory = {
  id: "payments",
  group: "setup",
  icon: "card",
  title: "Payments",
  description: "What the till takes — cash, card and Instapay — online payment on the ordering site, and where each shows on receipts and reports.",
  articles,
};
