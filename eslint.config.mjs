import globals from 'globals';
import tseslint from 'typescript-eslint';

const rules = {
  eqeqeq: 'error',
  'no-undef': 'error',
  'no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
};

const typescriptRules = {
  eqeqeq: 'error',
  'no-undef': 'off',
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
  '@typescript-eslint/no-explicit-any': 'error',
};

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules,
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.{ts,mts,cts}'],
  })),
  {
    files: ['**/*.{ts,mts,cts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {...globals.node, ...globals.browser},
    },
    rules: typescriptRules,
  },
];
