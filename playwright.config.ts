import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  timeout: 60000, expect: { timeout: 15000 },
  workers: 2,
  testDir: "./tests/e2e", fullyParallel: false, retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://127.0.0.1:3000", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } },
  ],
  // Exercise the deployable server; dev hot reload can interrupt concurrent auth redirects.
  webServer: { command: "npm run build && npm run start", url: "http://127.0.0.1:3000", reuseExistingServer: false, timeout: 180000 },
});
