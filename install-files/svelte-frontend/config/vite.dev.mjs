
/* ------------------------------------------------------------------ Imports */

import { generateServerConfig } from "./include/vite.dev.server.inc.mjs";

import { generateResolveConfig } from "./include/shared/vite.resolve.inc.mjs";
import { generatePluginsConfig } from "./include/shared/vite.plugins.inc.mjs";

/* ------------------------------------------------------------------ Exports */

//
// @see https://vitejs.dev/config/
//
export default {
  server: generateServerConfig(),
  resolve: generateResolveConfig(),
  plugins: generatePluginsConfig()
};
