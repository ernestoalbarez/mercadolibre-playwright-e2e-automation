# MercadoLibre Playwright E2E Automation Framework

End-to-end automation framework for **MercadoLibre Argentina** built with **Playwright** and **TypeScript**.

This project focuses on building a scalable, maintainable, and automation-first testing framework, following modern **QA / SDET best practices** rather than demo-level test scripts.

---

## Project Goals

- Provide a clean and extensible E2E automation framework
- Promote test readability and long-term maintainability
- Avoid conditionals and UI decision logic inside tests
- Enforce separation of concerns between tests, pages, and locators
- Serve as a reusable framework skeleton for future projects

---

## Tech Stack

- **Playwright** – reliable cross-browser E2E automation
- **TypeScript** – type-safe test development
- **ESLint v9 (Flat Config)** – static analysis and code quality
- **Prettier** – consistent formatting
- **Husky + lint-staged** – pre-commit quality enforcement
- **dotenv** – environment configuration

---

## Features

- Page Object Model with clear responsibility boundaries
- Custom Playwright fixtures for dependency and lifecycle management
- Locators isolated from page logic
- Pre-commit hooks enforcing linting and formatting
- Ignored generated artifacts (reports, builds)
- Designed for reuse and scalability

---

## Project Structure

```text
src/
├── tests/e2e/        # End-to-end test scenarios
├── pages/            # Page Objects (behavior & actions)
│   ├── BasePage.ts   # Shared page abstraction
│   └── locators/     # Page locators (selectors only)
├── fixtures/         # Custom Playwright fixtures
├── utils/            # Helpers and utilities
```

---

## Design Principles

- No conditionals in tests
- Tests express intent, not implementation
- Page Objects handle behavior and decisions
- Locators are isolated from logic
- Fixtures manage dependencies and lifecycle

---

## Architecture Overview

- Tests orchestrate user flows only
- Page Objects encapsulate UI behavior
- Locators contain selectors and nothing else
- Fixtures inject ready-to-use pages into tests

This structure reduces flakiness and makes UI changes easier to maintain.

---

## Example Test

```ts
test('Search for a product', async ({ homePage, searchResultsPage }) => {
  await homePage.searchFor('iPhone');
  await searchResultsPage.expectResultsToBeVisible();
});
```

---

## Getting Started

1. **Install dependencies**
```bash
npm install
npx playwright install
```

2. **Run tests**
```bash
npm test
```

3. **Run tests in headed mode**
```bash
npm run test:headed
```

4. **Debug tests**
```bash
npm run test:debug
```

---

## Code Quality

1. **Lint**
```bash
npm run lint
```

2. **Format**
```bash
npm run format
```

Linting and formatting are automatically enforced on commit using **Husky + lint-staged**.

---

## Environment Variables

Create a .env file based on the example:
```bash
cp .env.example .env
```

> **Note:** `.env` files are ignored from version control.


---

## License

This project is licensed under the **MIT License**.

---
