
/* ------------------------------------------------------------------ Imports */

import { generateBuildConfig } from "./include/vite.build.inc.mjs";

import { generateResolveConfig } from "./include/vite.all.resolve.inc.mjs";
import { generatePluginsConfig } from "./include/vite.all.plugins.inc.mjs";

/* ------------------------------------------------------------------ Exports */

//
// @see https://vitejs.dev/config/
//
export default async function() {
  return {
    build: await generateBuildConfig(),
    resolve: await generateResolveConfig(),
    plugins: await generatePluginsConfig()
  };
}
