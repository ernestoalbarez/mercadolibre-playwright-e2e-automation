import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  retries: 1,
  workers: 2,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'https://www.mercadolibre.com.ar',
    headless: true,
    viewport: { width: 1366, height: 768 },
    actionTimeout: 10 * 1000,
    navigationTimeout: 20 * 1000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
