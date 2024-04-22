/**
 * @note Make sure that the eslint plugin for svelte has been installed
 *
 *   npm install --save-dev eslint-plugin-svelte
 *
 *   @see https://www.npmjs.com/package/eslint-plugin-svelte
 *
 * --
 *
 * @note for Visual Studio Code install the eslint plugin
 *
 *   @see https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
 *
 */
module.exports = {

  env: {
    //
    // @see https://eslint.org/docs/user-guide
    //        /configuring/language-options#specifying-environments
    //
    browser: true,
    es2021: true,
    commonjs: true,
    jest: true
  },

  globals: {},

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },

  plugins: [
    'html'
  ],

  overrides: [
    {
      files: ['*.svelte']
    }
  ],

  extends: ['plugin:svelte/recommended'],

  rules: {
    //
    // @see https://eslint.org/docs/rules/no-unused-vars
    //
    'no-unused-vars': [
      'warn', {
      vars: 'all',
      args: 'all',
      ignoreRestSiblings: false
      }
    ],

    //
    // Mark undefined functions or variables as error
    //
    'no-undef': 'error',

    //
    // @see https://sveltejs.github.io/eslint-plugin-svelte/rules/valid-compile/
    //
    'svelte/valid-compile': [
      'error',
      {
        ignoreWarnings: true
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
