import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// import sveltePreprocess from 'svelte-preprocess';

import { resolveSrcPath,
         resolveLibPath } from "./hkdigital-devtool/helper/index.mjs";

// import { getAliases as getHkBaseAliases }
//   from "./lib/jslib-hk-base/build-config/vite.aliases.js";

// import { getAliases as getHkFrontendAliases }
//   from "./lib/jslib-hk-fe/build-config/vite.aliases.js";

//
// @see https://vitejs.dev/config/
//
export default defineConfig({
  server: {
    cors: {
      origin: "*"
    },
    // hmr: {
    //   protocol: "ws",
    //   host: 'localhost',
    //   port: 3123,
    //   timeout: 30000
    // },
    // hmr: false,
    hmr: {
      //
      // @see
      // https://github.com/vitejs/vite/blob/main/docs/config/index.md#serverhmr
      //
      protocol: "wss",
      host: 'jens.hkdigital.dev',
      port: 443,
      clientPort: 443,
      timeout: 10000
    },
    open: true // open browser window on start
  },
  build: {
    //
    // @see https://vitejs.dev/config
    //

    // https://caniuse.com/es6-module-dynamic-import
    // 'modules' (default)
    // 'esnext' (assumes native dynamic imports support)
    //
    // target: "modules", // "esnext"

    // cssCodeSplit: true =>
    //   CSS is inlined
    //
    // cssCodeSplit: false =>
    //   all CSS in the entire project will be extracted into a single CSS file
    //
    // cssCodeSplit: true

    // sourceMap: true | false | 'inline' | 'hidden'
    //
    // sourcemap: false

    // minify: true | false | 'terser' | 'esbuild'
    //
    // minity: 'esbuild'

  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.css'],

    alias: [
      // {
      //   find: '@',
      //   replacement: resolveSrcPath(".")
      // },

      // -- Platform (usually jslib-hk-fe or jslib-hk-be)

      { find: "$platform",
        replacement: resolveLibPath("jslib-hk-fe") },

      // -- Project

      { find: "$src",
        replacement: resolveSrcPath(".") },

      { find: "$theme",
        replacement: resolveLibPath("jslib-hk-fe/theme") },

      { find: "$fonts-and-icons-hk",
        replacement: resolveLibPath("fonts-and-icons-hk") },

      { find: "$content-panels",
        replacement: resolveSrcPath("views/content-panels") },

      // -- Custom

      // -- Libs

      // ...getHkBaseAliases( { resolveLibPath } ),

      // ...getHkFrontendAliases( { resolveLibPath } )
    ]
  },
  plugins: [
   svelte( {
      // preprocess: sveltePreprocess( {} ),

      // @see https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md
      onwarn(warning, defaultHandler) {

        switch( warning.code )
        {
          case "vite-plugin-svelte-css-no-scopable-elements":
          case "unused-export-let":
            // ignore warning
            return;

          default:
            // console.log( warning.code );
            break;
        }

        defaultHandler(warning);
      }
    } )
  ]
})
