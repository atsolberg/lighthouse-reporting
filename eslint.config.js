import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import { defineConfig, globalIgnores } from 'eslint/config';

const react = reactPlugin.configs.flat;
const OFF = 0;

export default defineConfig([
  globalIgnores(['build/', 'public/build']),

  // JAVASCRIPT
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['**/build/'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },

  // REACT
  {
    ...react.recommended,
    files: ['**/*.{js,jsx}'],
    rules: { ...react.recommended.rules, 'react/prop-types': OFF },
    settings: {
      react: {
        version: 'detect', // automatically picks installed version
        defaultVersion: '18.3.1',
      },
    },
  },
  { files: ['**/*.{js,jsx}'], ...react['jsx-runtime'] },
  { files: ['**/*.{js,jsx}'], plugins: { 'react-hooks': reactHooks } },

  // JSON
  {
    files: ['**/*.json'],
    ignores: ['package.json', 'package-lock.json', 'tsconfig.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.jsonc'],
    plugins: { json },
    language: 'json/jsonc',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.json5'],
    plugins: { json },
    language: 'json/json5',
    extends: ['json/recommended'],
  },

  // MARKDOWN
  {
    files: ['**/*.md'],
    ignores: ['**/guidelines.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    extends: ['markdown/recommended'],
  },
]);
