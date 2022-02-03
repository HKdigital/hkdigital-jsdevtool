
/* ------------------------------------------------------------------ Imports */

import { generatePreviewConfig } from "./include/vite.preview.server.inc.mjs";

import { generateResolveConfig } from "./include/shared/vite.resolve.inc.mjs";
import { generatePluginsConfig } from "./include/shared/vite.plugins.inc.mjs";

import { generateBuildConfig } from "./include/vite.build.inc.mjs";

/* ------------------------------------------------------------------ Exports */

//
// @see https://vitejs.dev/config/
//
export default {
  build: generateBuildConfig(), /* required for outDir */
  preview: generatePreviewConfig(),
  resolve: generateResolveConfig(),
  plugins: generatePluginsConfig()
};
