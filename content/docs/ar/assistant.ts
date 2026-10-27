import type { DocCategory } from "../types";
import { articles } from "./parts/assistant";

export const assistant: DocCategory = {
  id: "assistant",
  group: "grow",
  icon: "assistant",
  title: "المساعد الذكي",
  description: "اسأل المساعد الذكي عن أرقامك كتابةً أو بصوتك، واقرأ ملخص اليوم، ووافق على التغييرات التي يجهّزها. إضافة تُفعَّل لكل مطعم على حدة.",
  articles,
};
