
/* ------------------------------------------------------------------ Imports */

import { generateServerConfig } from "./include/vite.dev.server.inc.mjs";

import { generateResolveConfig } from "./include/vite.all.resolve.inc.mjs";
import { generatePluginsConfig } from "./include/vite.all.plugins.inc.mjs";

/* ------------------------------------------------------------------ Exports */

//
// @see https://vitejs.dev/config/
//
export default async function() {
  return {
    server: await generateServerConfig(),
    resolve: await generateResolveConfig(),
    plugins: await generatePluginsConfig()
  };
}
