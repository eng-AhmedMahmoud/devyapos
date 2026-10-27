import type { DocCategory } from "../types";
import { articles } from "./parts/getting-started";

export const gettingStarted: DocCategory = {
  id: "getting-started",
  group: "setup",
  icon: "sparkle",
  title: "البداية",
  description: "تعرّف على موفينج POS وتطبيقاته، واحصل على حسابك، وتجوّل في لوحة الإدارة، واختر أجهزتك.",
  articles,
};
