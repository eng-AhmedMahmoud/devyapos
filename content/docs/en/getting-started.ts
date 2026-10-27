import type { DocCategory } from "../types";
import { articles } from "./parts/getting-started";

export const gettingStarted: DocCategory = {
  id: "getting-started",
  group: "setup",
  icon: "sparkle",
  title: "Getting started",
  description: "Meet Moving POS and its apps, get your account, tour the back office and choose your devices.",
  articles,
};
