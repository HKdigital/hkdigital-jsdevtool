import svelteConfig from '@sveltejs/eslint-config';

import globals from 'globals';

export default [
  ...svelteConfig,
  {
    // your overrides
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
  }
];