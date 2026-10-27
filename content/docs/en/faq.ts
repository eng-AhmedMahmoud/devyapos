import type { DocCategory } from "../types";
import { articles } from "./parts/faq";

export const faq: DocCategory = {
  id: "faq",
  group: "grow",
  icon: "info",
  title: "FAQ",
  description: "Short answers to the questions we are asked most about Moving POS.",
  articles,
};
