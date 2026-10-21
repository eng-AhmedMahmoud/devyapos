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
    // `pnpm test:coverage`, which CI runs. The server side only: the API
    // routes, lib/ and the locale proxy. Components are the browser journeys'
    // to cover, so counting them here would only dilute the number.
    coverage: {
      provider: "v8",
      include: ["app/api/**", "lib/**", "proxy.ts"],
      reporter: ["text", "json-summary", ["text", { file: "coverage.txt" }]],
      // A ratchet. Each number is the measured coverage rounded down, so a
      // change that loses coverage fails CI. Raise them when coverage rises;
      // never lower one to get a change through. Measured 2026-10-22 with the
      // conversion-path tests (#18) on top of the lead-durability work (#50):
      // statements 80.41, branches 81.22, functions 67.4, lines 81.1. Before
      // either: 28.44 / 19.28 / 34.78 / 30.22.
      thresholds: {
        statements: 80,
        branches: 81,
        functions: 67,
        lines: 81,
      },
    },
  },
});
