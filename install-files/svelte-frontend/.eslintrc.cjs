/**
 * @note Make sure that the eslint plugin for svelte has been installed
 * npm install --save-dev eslint-plugin-svelte3
 */
module.exports = {
  "env": {
    // @see https://eslint.org/docs/user-guide
    //        /configuring/language-options#specifying-environments
    "browser": true,
    "es2021": true,
    "commonjs": true,
    "jest": true
  },
  "globals": {
  },
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    'svelte3',
    'html'
  ],
  "overrides": [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  "extends": "eslint:recommended",
  "rules": {
    // @see https://eslint.org/docs/rules/no-unused-vars
    "no-unused-vars": [
      "warn", {
      "vars": "all",
      //"args": "after-used",
      // "args": "none",
      "args": "all",
      "ignoreRestSiblings": false
      }
    ],
    "indent": [
      "off",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "off",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ]
  },
  "settings": {
    "svelte3/ignore-styles": () => true
  }
};
