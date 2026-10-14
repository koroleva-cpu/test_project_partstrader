# Automation Testing Exercise

Automated UI and API tests for [automationexercise.com](https://automationexercise.com/), written in TypeScript with Playwright.

## What is tested

| Area | What | Source |
|------|------|--------|
| UI | Test Case 14: Place Order: Register while Checkout | [Test cases](https://automationexercise.com/test_cases) |
| UI | Test Case 15: Place Order: Register before Checkout | [Test cases](https://automationexercise.com/test_cases) |
| API | `verifyLogin`: API 7, 8, 9 and 10, plus three edge cases | [API list](https://automationexercise.com/api_list) |

## Tools

- [Playwright Test](https://playwright.dev/) as the test framework
- TypeScript in strict mode
- [Biome](https://biomejs.dev/) for linting and formatting
- [Faker](https://fakerjs.dev/) for test data
- [Husky](https://typicode.github.io/husky/) pre-commit hook: runs the typecheck, lint and API tests before every commit
- GitHub Actions: runs the typecheck, lint and all tests on every pull request

## Project layout

```
.github/workflows/ci.yml   checks that run on pull requests
.husky/pre-commit          checks that run before each commit
src/
  api/         client for the account API
  config/      environment settings and the reachability check
  data/        Faker factories for users and payment cards
  fixtures/    the project's test and expect, with shared fixtures
  flows/       steps that span several pages
  pages/       page objects; components/ holds parts shared by several pages
tests/
  api/         API tests
  ui/          UI tests
```

## Documentation

- [GETTING_STARTED.md](GETTING_STARTED.md): how to set up and run the tests, how they are built, and troubleshooting
- [ISSUES.md](ISSUES.md): defects found in the application
