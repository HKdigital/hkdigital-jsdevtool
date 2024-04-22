
/* ------------------------------------------------------------------ Imports */

import { generateServerConfig } from './config-include/server.dev.inc.mjs';
import { generatePluginsConfig } from './config-include/plugins.inc.mjs';

import { generateDefaultResolveConfig }  from '../hkdigital-jsdevtool/helper/index.mjs';


/* ------------------------------------------------------------------ Exports */

//
// @see https://vitejs.dev/config/
//
export default async function() {
  return {
    server: await generateServerConfig(),
    resolve: await generateDefaultResolveConfig(),
    plugins: await generatePluginsConfig()
  };
}
