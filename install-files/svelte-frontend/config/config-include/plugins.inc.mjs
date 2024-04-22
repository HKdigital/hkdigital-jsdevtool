
/* ------------------------------------------------------------------ Imports */

import { svelte } from '@sveltejs/vite-plugin-svelte';

import sveltePreprocess from 'svelte-preprocess';

/* ------------------------------------------------------------------ Exports */

/**
 * Generate config section
 *
 * @see https://vitejs.dev/config/
 *
 * @returns {object} config section
 */
export async function generatePluginsConfig()
{
  return /* config.plugins */ [
   svelte( {
      preprocess: sveltePreprocess( {} ),

      // @see https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md
      onwarn(warning, defaultHandler) {

        if( warning.code.startsWith('a11y') )
        {
          // Ignore all a11y warnings
          return;
        }

        switch( warning.code )
        {
          case 'vite-plugin-svelte-css-no-scopable-elements':
          case 'unused-export-let':
            // console.log( warning.code );
            // ignore warning
            return;

          default:
            // console.log( warning.code );
            break;
        }

        //
        // The default handler will shown warnings in the terminal
        // output during development and build
        //
        defaultHandler(warning);
      }
    } )
  ];
}