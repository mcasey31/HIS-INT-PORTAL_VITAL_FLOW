import { defineConfig, devices } from "@playwright/test";

const useExternalServer = !!process.env.E2E_BASE_URL;
const baseURL = process.env.E2E_BASE_URL || "http://localhost:4173";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  timeout: 90_000,
  expect: {
    timeout: 15_000
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    launchOptions: { slowMo: 1000 },
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  webServer: useExternalServer
    ? undefined
    : {
        command: "npm run preview -- --port 4173",
        port: 4173,
        reuseExistingServer: false,
        timeout: 30_000
      },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
