
/* ------------------------------------------------------------------ Imports */

import { generateBuildConfig } from "./include/vite.build.inc.mjs";

import { generateResolveConfig } from "./include/shared/vite.resolve.inc.mjs";
import { generatePluginsConfig } from "./include/shared/vite.plugins.inc.mjs";

/* ------------------------------------------------------------------ Exports */

//
// @see https://vitejs.dev/config/
//
export default {
  build: generateBuildConfig(),
  resolve: generateResolveConfig(),
  plugins: generatePluginsConfig()
};
