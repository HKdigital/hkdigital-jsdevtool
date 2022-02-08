
/* ------------------------------------------------------------------ Imports */

import { generateServerConfig } from "./vite.dev.server.inc.mjs";

/* ------------------------------------------------------------------ Exports */

/**
 * Generate config section
 *
 * @see https://vitejs.dev/config/
 *
 * @returns {object} config section
 */
export function generatePreviewConfig()
{
  const server = generateServerConfig();

  return /* config.preview */ {
    port: server.port || 8888,
    host: server.host || "0.0.0.0",

    // cors: {
    //   origin: "*"
    // },

    open: true // open browser window on start
  };
}
