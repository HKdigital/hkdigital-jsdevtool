
import commonjs from '@rollup/plugin-commonjs';
// import { nodeResolve } from '@rollup/plugin-node-resolve';

import copy from "rollup-plugin-copy";
import json from '@rollup/plugin-json';

import alias from '@rollup/plugin-alias';

import { getDefaultAliasEntriesForRollup,
         createBannerFromPackageJson,
         onBootstrapReadyBannerCode,
         onBootstrapReadyFooterCode } from "../hkdigital-jsdevtool/helper/index.mjs";

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

  const aliasEntries = { ...await getDefaultAliasEntriesForRollup() };

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

    // Copy files to dist folder
    copy( {
      targets: [
        // { src: 'package.json', dest: 'dist/' },
        { src: 'LICENSE.txt', dest: 'dist/' }
      ]
    } ),

    // Aliases that can be used by import statements
    alias( { entries: aliasEntries } )
  );

  // ---------------------------------------------------------------------------

  return config;
}