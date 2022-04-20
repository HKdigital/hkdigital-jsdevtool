
import commonjs from '@rollup/plugin-commonjs';
// import { nodeResolve } from '@rollup/plugin-node-resolve';

import json from '@rollup/plugin-json';

import alias from '@rollup/plugin-alias';

import { // resolveSrcPath,
         // resolveLibPath,
         getDefaultAliasEntries,
         createBannerFromPackageJson,
         onBootstrapReadyBannerCode,
         onBootstrapReadyFooterCode } from "../hkdigital-devtool/helper/index.mjs";

// import { getConfigAliasEntries } from "./rollup.aliases.inc.mjs";

/* ------------------------------------------------------ Export createConfig */

/**
 * Function that returns a rollup config
 *
 * @returns {object} config
 */
export async function createConfig()
{
  const config =
    {
      /* input: "src/index.js" */
      output: {},
      plugins: []
    };

  const { output, plugins } = config;

  // ---------------------------------------------------------------------------
  // Generate banner using package.json

  output.banner = await createBannerFromPackageJson();

  // ---------------------------------------------------------------------------
  // Add `onBootstrapReadyFns` to banner and footer
  // - Functions added to `onBootstrapReadyFns` will be executed when
  //   bootstrap has finished

  output.banner += onBootstrapReadyBannerCode();
  output.footer = onBootstrapReadyFooterCode();

  // ---------------------------------------------------------------------------
  // Alias entries

  const aliasEntries =
    {
      ...await getDefaultAliasEntries()
      // ...await getConfigAliasEntries( { resolveSrcPath, resolveLibPath } )
    };

  console.log( "\nAliases", aliasEntries );

  // ---------------------------------------------------------------------------
  // Plugins

  plugins.push(

    // @see https://github.com/rollup/plugins

    // Find files in `node_modules`
    //
    // --> CRASHES GENERATED CODE!
    //
    // nodeResolve( { preferBuiltins: true } ),

    // Process JSON
    json(),

    // Help rollup to convert modules from `node_modules` to ES
    commonjs(),

    // Aliases that can be used by import statements
    alias( { entries: aliasEntries } )
  );

  // ---------------------------------------------------------------------------

  return config;
}