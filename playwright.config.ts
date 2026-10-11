import { existsSync } from "node:fs";
import { defineConfig } from "@playwright/test";

const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  ?? (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);

export default defineConfig({
  testDir: "./tests",
  testMatch: "landing.spec.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    browserName: "chromium",
    reducedMotion: "reduce",
    launchOptions: chromiumPath ? { executablePath: chromiumPath } : {},
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "mobile",
      use: { viewport: { width: 375, height: 844 }, isMobile: true, hasTouch: true },
    },
    {
      name: "tablet",
      use: { viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true },
    },
    { name: "laptop", use: { viewport: { width: 1024, height: 1000 } } },
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "wide-desktop", use: { viewport: { width: 1920, height: 1000 } } },
  ],
  webServer: {
    command: "npm run start -- --port 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
