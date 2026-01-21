# Playwright TypeScript Automation Framework Skeleton

This repository serves as a **base skeleton for end-to-end (E2E) automation** with Playwright and TypeScript.  
It provides a clean, professional setup for creating maintainable automation projects.

---

## Features

- **TypeScript** support for type-safe tests
- **Playwright** for reliable cross-browser E2E automation
- **ESLint v9 (flat config)** + **Prettier** for consistent code style
- **Husky + lint-staged** pre-commit hooks to enforce linting & formatting
- Structure ready for **Page Objects**, **fixtures**, and **utility functions**
- Ignored directories for Playwright reports and builds

---

## Folder Structure
```
tests/e2e/       # Your E2E test files
pages/           # Page Object Models
fixtures/        # Reusable fixtures
utils/           # Helper functions
playwright-report/  # Playwright-generated reports (ignored by ESLint)
```

---

## Installation

1. Clone the template repository or use GitHub's **Use this template** feature.
2. Install dependencies:

```bash
npm install
npx playwright install
```

3.	Verify setup by running a test (if any exist):
```basb
npm test
```

---

## Scripts
- npm run lint → Runs ESLint on all TypeScript files
- npm run format → Formats files using Prettier
- npm test → Runs Playwright tests
- Pre-commit hooks automatically run lint & format on staged files

---

## Usage
1.	Add your tests in tests/e2e/
2.	Add Page Objects in pages/
3.	Add helpers in utils/ and fixtures in fixtures/
4.	Run npm run lint and npm run format to keep code clean
5.	Commit changes; Husky + lint-staged will enforce code quality

---

## Notes
- playwright-report/ and dist/ are ignored by ESLint to prevent analyzing generated files
- This skeleton is meant to be reused as a template for any future Playwright + TypeScript project
- Extend and customize rules in eslint.config.js as needed for your project

---