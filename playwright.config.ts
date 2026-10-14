import { defineConfig, devices } from '@playwright/test';
import { environment } from './src/config/environments';

const isCI = !!process.env.CI;
// Watch mode for debugging: SLOW_MO=1000 opens a visible browser and pauses 1s before each action.
const slowMo = Number(process.env.SLOW_MO) || 0;

export default defineConfig({
  testDir: './tests',
  globalSetup: './src/config/global-setup.ts',
  fullyParallel: true,
  forbidOnly: isCI,
  // Retries hide flakiness locally; in CI they keep a shared live site from blocking a PR.
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: environment.baseUrl,
    // The site marks its form controls with data-qa, so getByTestId targets those.
    testIdAttribute: 'data-qa',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    // API tests need no browser, so they get their own project and can run alone.
    { name: 'api', testDir: './tests/api' },
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        ...(slowMo > 0 && { headless: false, launchOptions: { slowMo } }),
      },
    },
  ],
});
