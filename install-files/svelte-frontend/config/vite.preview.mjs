
/* ------------------------------------------------------------------ Imports */

import { generatePreviewConfig } from './config-include/server.preview.inc.mjs';
import { generatePluginsConfig } from './config-include/plugins.inc.mjs';
import { generateBuildConfig } from './config-include/build.inc.mjs';

import { generateDefaultResolveConfig }  from '../hkdigital-jsdevtool/helper/index.mjs';

/* ------------------------------------------------------------------ Exports */

//
// @see https://vitejs.dev/config/
//
export default async function() {
  return {
    build: await generateBuildConfig(), /* required for outDir */
    preview: await generatePreviewConfig(),
    resolve: await generateDefaultResolveConfig(),
    plugins: await generatePluginsConfig()
  };
}
