import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import playwrightPlugin from 'eslint-plugin-playwright';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'playwright-report/**', 'test-results/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      playwright: playwrightPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      ...playwrightPlugin.configs.recommended.rules,
      'playwright/no-skipped-test': 'warn',
      'no-undef': 'error',
      'playwright/expect-expect': 'off',
      // Playwright specific browser globals handling is better done via globals.browser
      // but if 'document' is still flagged in test files, we can be explicit here
    },
  },
];
