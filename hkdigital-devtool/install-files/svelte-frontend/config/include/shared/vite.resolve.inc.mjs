
/* ------------------------------------------------------------------ Imports */

import { resolveSrcPath,
         resolveLibPath } from "../../../hkdigital-devtool/helper/index.mjs";

// import { getAliases as getHkBaseAliases }
//   from "./lib/jslib-hk-base/build-config/vite.aliases.js";

// import { getAliases as getHkFrontendAliases }
//   from "./lib/jslib-hk-fe/build-config/vite.aliases.js";

/* ------------------------------------------------------------------ Exports */

/**
 * Generate config section
 *
 * @see https://vitejs.dev/config/
 *
 * @returns {object} config section
 */
export function generateResolveConfig()
{
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

  };
}