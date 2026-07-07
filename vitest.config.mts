import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.ts"],
    name: { label: "node", color: "green" },
    environment: "node",
  },
  resolve: { tsconfigPaths: true }
});
