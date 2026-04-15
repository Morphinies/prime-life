import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(globalIgnores(['dist', 'node_modules']), {
  files: ['**/*.{ts,tsx}'],
  extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
  plugins: {
    prettier: prettierPlugin,
  },
  rules: {
    ...eslintConfigPrettier.rules,
    'prettier/prettier': 'error',
  },
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
    globals: { ...globals.node, ...globals.es2024 },
  },
});
