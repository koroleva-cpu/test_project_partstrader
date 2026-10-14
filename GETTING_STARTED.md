# Getting Started

## Purpose

This guide shows how to get the code, set it up and run the tests. The last section explains how the tests are built and what to do when something goes wrong.

It is meant for anyone new to the project, and for reviewers checking a pull request. For an overview of what is tested, see the [README](README.md).

## Getting the Latest Code

You need [Git](https://git-scm.com/downloads).

To get the code for the first time:

```
git clone https://github.com/koroleva-cpu/test_project_partstrader.git
cd test_project_partstrader
```

To update a copy you already have:

```
git switch main
git pull
```

## Setting Up the Environment

There is nothing to deploy. The tests run on your machine against the live site, so setting up only means installing the tools.

### Prerequisites

- Node.js 20 or newer (check with `node -v`)
- npm, which comes with Node.js
- Git

### Steps

1. Open a terminal in the project folder.
2. Install the dependencies:
   ```
   npm ci
   ```
   This also switches on the pre-commit hook.
3. Download the browser the tests use:
   ```
   npx playwright install chromium
   ```

That's it. The tests run against the dev environment by default.

### Settings

You only need these to change the defaults. Set them in the terminal, or copy `.env.example` to `.env` and edit it there. A value set in the terminal wins.

| Variable | What it does | Default |
|----------|--------------|---------|
| `TEST_ENV` | Picks the environment: `dev` or `test` | `dev` |
| `SLOW_MO` | Opens a visible browser and waits this many milliseconds before each action | not set |
| `USER_PASSWORD` | Overrides the password given to test users | the environment's password |

| Environment | URL |
|-------------|-----|
| `dev` | https://automationexercise.com/ (the working site) |
| `test` | https://test.automationexercise.com/ (not reachable at the moment) |

## Running the Tests


| Command | What it does |
|---------|--------------|
| `npm test` | Runs all tests |
| `npm run test:api` | Runs the API tests only |
| `npm run test:ui` | Runs the UI tests only |
| `npm run report` | Opens the report from the last run |
| `npm run typecheck` | Checks the TypeScript compiles |
| `npm run lint` | Checks code style |
| `npm run lint:fix` | Fixes code style problems |

A full run takes about 20 seconds and should end with **9 passed** (7 API, 2 UI).

### Run a single test

Pass part of the test name to `-g`:

```
npx playwright test -g "Test Case 14"
npx playwright test -g "API 7"
```

### Watch the tests in a browser

```
npx playwright test --project=ui --headed
```

To slow it down so you can follow along, set `SLOW_MO`:

```
# PowerShell
$env:SLOW_MO=1000; npm run test:ui
Remove-Item Env:SLOW_MO

# bash
SLOW_MO=1000 npm run test:ui
```

To step through a test and inspect the page at any point, open the interactive runner with `npx playwright test --ui`.

### Run against another environment

```
# PowerShell
$env:TEST_ENV='test'; npm test
Remove-Item Env:TEST_ENV

# bash
TEST_ENV=test npm test
```

If the environment can't be reached, the tests are skipped rather than failed, and the run says why at the start.

### Read the results

Run `npm run report` after any run. Each test shows its steps; failed tests include a screenshot.

### Automatic checks

- **Before each commit**, the pre-commit hook runs the typecheck, lint and API tests (about 10 seconds). If any of them fail, the commit is stopped. The UI tests are not part of the hook: they take longer, open browsers and depend on the live site, which would make every commit slow and occasionally flaky. They run in CI instead.
- **On every pull request**, GitHub Actions runs the typecheck, lint and all tests. The report is attached to the run under **Artifacts**.


[README](README.md) | [ISSUES](ISSUES.md)
