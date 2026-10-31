import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'generated', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.ts'],
    languageOptions: { ecmaVersion: 2023, globals: globals.node },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' }],
      '@typescript-eslint/no-namespace': 'off',
      'no-console': ['warn', { allow: ['error'] }],
    },
  },
  {
    files: ['src/scripts/**/*.ts'],
    rules: { 'no-console': 'off' },
  },
);
