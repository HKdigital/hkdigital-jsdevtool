
/* ------------------------------------------------------------------ Imports */

import { resolveSrcPath,
         resolveLibPath,
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

      // { find: "$theme",
      //   replacement: resolveLibPath("jslib-hk-fe/theme") },

      // { find: "$fonts-and-icons-hk",
      //   replacement: resolveLibPath("fonts-and-icons-hk") },

      // { find: "$content-panels",
      //   replacement: resolveSrcPath("views/content-panels") },

      // -- Custom

      // -- Libs

      // { find: "$lib",
      //   replacement: resolveLibPath() },

      // ...(await viteGetAliasesFromLib( "jslib-hk-base" ))
    ]

  };
}