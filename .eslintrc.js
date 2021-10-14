module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: ['plugin:prettier/recommended'],
  plugins: ['prettier', '@typescript-eslint'],
  // add your custom rules here
  rules: {
    'block-spacing': 'error',
    'no-console': 'off',
    'prettier/prettier': 'error',
    'linebreak-style': ['error', 'unix'],
  },
};
