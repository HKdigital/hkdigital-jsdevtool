module.exports = {
  env: {
    // @see https://eslint.org/docs/user-guide
    //        /configuring/language-options#specifying-environments
    browser: false,
    es2021: true,
    node: true,
    jest: true
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [],
  overrides: [],
  extends: 'eslint:recommended',
  rules: {
    // @see https://eslint.org/docs/rules/no-unused-vars
    'no-unused-vars': [
      'warn', {
      vars: 'all',
      //"args": "after-used",
      // "args": "none",
      args: 'all',
      ignoreRestSiblings: false
      }
    ],

    indent: [
      'off',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    quotes: [
      'off',
      'double'
    ],
    semi: [
      'error',
      'always'
    ]
  },
  settings: {}
};