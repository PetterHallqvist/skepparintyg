import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    include: ["tests/unit/**/*.test.{ts,tsx}", "lib/**/*.test.{ts,tsx}"],
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      // The real `server-only` throws outside an RSC graph; stub it so
      // server-only modules (Stripe/service clients) are unit-testable.
      "server-only": path.resolve(__dirname, "tests/stubs/server-only.ts"),
    },
  },
});
