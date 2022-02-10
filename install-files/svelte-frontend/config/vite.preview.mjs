
/* ------------------------------------------------------------------ Imports */

import { generatePreviewConfig } from "./include/vite.preview.server.inc.mjs";

import { generateResolveConfig } from "./include/vite.all.resolve.inc.mjs";
import { generatePluginsConfig } from "./include/vite.all.plugins.inc.mjs";

import { generateBuildConfig } from "./include/vite.build.inc.mjs";

/* ------------------------------------------------------------------ Exports */

//
// @see https://vitejs.dev/config/
//
export default async function() {
  return {
    build: await generateBuildConfig(), /* required for outDir */
    preview: await generatePreviewConfig(),
    resolve: await generateResolveConfig(),
    plugins: await generatePluginsConfig()
  };
}
