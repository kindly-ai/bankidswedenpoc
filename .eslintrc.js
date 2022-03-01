module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: '2020',
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:unicorn/recommended',
  ],
  rules: {
    'unicorn/prevent-abbreviations': 'off',
  },
  overrides: [
    {
      files: ['.eslintrc.js'],
      rules: {
        'unicorn/prefer-module': 'off', // unicorn wants js files to use the export keywords, but eslint doesn't understand it for the config file itself
      },
    },
  ],
  plugins: ['@typescript-eslint', 'prettier'],
};
