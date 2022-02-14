
/* ------------------------------------------------------------------ Imports */

import { resolveSrcPath,
         resolveLibPath,
         viteGetAliasesFromAllLibs
         /*viteGetAliasesFromLib*/ }
          from "../../hkdigital-devtool/helper/index.mjs";

/* ------------------------------------------------------------------ Exports */

/**
 * Generate config section
 *
 * @see https://vitejs.dev/config/
 *
 * @returns {object} config section
 */
export async function generateResolveConfig()
{
  // console.log( await viteGetAliasesFromLib( "jslib-hk-base" ) );

  return /* config.resolve */ {

    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.css'],

    alias: [
      // -- Platform (usually jslib-hk-fe or jslib-hk-be)

      // { find: "$platform",
      //   replacement: resolveLibPath("jslib-hk-fe") },

      // -- Project

      // { find: '@',
      //   replacement: resolveSrcPath(".") },

      { find: "$src",
        replacement: resolveSrcPath(".") },

      // { find: "$theme",
      //   replacement: resolveSrcPath("theme") }

      // { find: "$theme",
      //   replacement: resolveLibPath("my-theme-lib/theme") }

      // -- Custom

      // -- Libs

      ...(await viteGetAliasesFromAllLibs())
      // ...(await viteGetAliasesFromLib( "my-lib" ))
    ]

  };
}