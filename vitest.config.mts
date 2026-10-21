import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    include: ["tests/**/*.test.{ts,tsx}"],
    environment: "node",
    server: {
      deps: {
        // next-intl's ESM build imports `next/server` without an extension,
        // which Node's own resolver refuses (next has no exports map). Inlined,
        // it goes through Vite's resolver instead, so tests/proxy.test.ts can
        // run the real locale middleware.
        inline: ["next-intl"],
      },
    },
  },
});
