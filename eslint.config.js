import js from '@eslint/js';
import angularPlugin from '@angular-eslint/eslint-plugin';
import templatePlugin from '@angular-eslint/eslint-plugin-template';
import templateParser from '@angular-eslint/template-parser';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['server/**/*.mjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        crypto: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
      },
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      globals: {
        console: 'readonly',
        crypto: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        window: 'readonly',
      },
    },
    plugins: { '@angular-eslint': angularPlugin },
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@angular-eslint/prefer-standalone': 'error',
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: { parser: templateParser },
    plugins: { '@angular-eslint/template': templatePlugin },
    rules: { '@angular-eslint/template/eqeqeq': 'error' },
  },
  prettier,
  { ignores: ['dist/**', 'node_modules/**', '.angular/**', '.tmp-sheets/**'] },
];
