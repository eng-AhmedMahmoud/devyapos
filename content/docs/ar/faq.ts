import type { DocCategory } from "../types";
import { articles } from "./parts/faq";

export const faq: DocCategory = {
  id: "faq",
  group: "grow",
  icon: "info",
  title: "الأسئلة الشائعة",
  description: "إجابات قصيرة عن الأسئلة التي تصلنا أكثر من غيرها عن موفينج POS.",
  articles,
};
