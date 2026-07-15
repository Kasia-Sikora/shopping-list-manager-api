import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.ts"],
    name: { label: "node", color: "green" },
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**"],
      exclude: ["src/**/__tests__/**", "**/*.test.ts", "src/interfaces.ts"],
    },
  },
  resolve: { tsconfigPaths: true }
});
