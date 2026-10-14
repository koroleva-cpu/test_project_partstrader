# Automation Testing Exercise

UI and API test automation for [automationexercise.com](https://automationexercise.com/), built with Playwright and TypeScript.

> **Status:** the framework is scaffolded and two smoke tests prove the setup. The exercise test cases (UI 14 and 15, API 7–10) are still to come.

## Stack

| Purpose | Tool |
|---------|------|
| Test framework | [Playwright Test](https://playwright.dev/) |
| Language | TypeScript (strict) |
| Lint and format | [Biome](https://biomejs.dev/) |
| Test data | [Faker](https://fakerjs.dev/) |

## Requirements

- Node.js 20 or newer
- npm

## Setup

```
npm ci
npx playwright install chromium
```

## Running the tests

| Command | What it does |
|---------|--------------|
| `npm test` | Runs every test |
| `npm run test:api` | API tests only, no browser |
| `npm run test:ui` | Browser tests only |
| `npm run report` | Opens the HTML report from the last run |
| `npm run typecheck` | Compiles the TypeScript without emitting files |
| `npm run lint` | Checks lint and formatting |
| `npm run lint:fix` | Fixes what can be fixed automatically |

For debugging, `npx playwright test --ui` opens the interactive runner and `npx playwright test --debug` steps through with the inspector.

## Configuration

Settings come from environment variables. Set them in the shell, or copy `.env.example` to `.env`; the shell takes precedence.

| Variable | Values | Default | Purpose |
|----------|--------|---------|---------|
| `TEST_ENV` | `dev`, `test` | `dev` | Selects the base URL and user password |
| `SLOW_MO` | milliseconds | unset | Opens a visible browser and pauses before each action |
| `USER_PASSWORD` | any string | per environment | Overrides the password for generated users |

| Environment | Base URL |
|-------------|----------|
| `dev` | https://automationexercise.com/ |
| `test` | https://test.automationexercise.com/ |

Setting a variable for one run:

```
# PowerShell
$env:TEST_ENV='test'; npm test

# bash
TEST_ENV=test npm test
```

If the selected environment does not respond, every test is skipped with the reason instead of failing. The `test` environment is currently unreachable, so it is the easy way to see this.

## Project structure

```
src/
  api/         client for the account API endpoints
  config/      environment settings and the reachability check
  data/        Faker factories for users and payment cards
  fixtures/    the project's `test` and `expect`, with shared fixtures
  flows/       steps that span several pages, shared between tests
  pages/       page objects and reusable page components
tests/
  api/         API tests (no browser)
  ui/          browser tests
```

Specs import `test` and `expect` from `src/fixtures`, not from `@playwright/test`, so every test gets the shared fixtures.
