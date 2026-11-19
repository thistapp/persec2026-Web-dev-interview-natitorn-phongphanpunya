import { defineConfig, devices } from "@playwright/test";

// Set PORT to reuse a dev server you already have running, e.g. PORT=3002 npm test
const PORT = Number(process.env.PORT ?? 3005);

export default defineConfig({
  testDir: "./tests",
  reporter: "list",
  projects: [
    // Unit tests: call the functions directly, no browser opened.
    { name: "unit", testDir: "./tests/unit" },
    // Browser tests: drive each section's UI on the real page.
    {
      name: "e2e",
      testDir: "./tests/e2e",
      use: { ...devices["Desktop Chrome"], baseURL: `http://localhost:${PORT}` },
    },
  ],
  webServer: {
    command: `npm run dev -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
