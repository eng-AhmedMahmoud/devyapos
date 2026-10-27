import type { DocCategory } from "../types";
import { articles } from "./parts/payments";

export const payments: DocCategory = {
  id: "payments",
  group: "setup",
  icon: "card",
  title: "طرق الدفع",
  description: "ما يقبله الكاشير من نقدي وبطاقة وإنستاباي، والدفع الإلكتروني على موقع الطلبات، وأين يظهر كل منها في الإيصال والتقارير.",
  articles,
};
