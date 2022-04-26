
/**
 * Generate config section
 *
 * @see https://vitejs.dev/config/
 *
 * @returns {object} config section
 */
export async function generateServerConfig()
{
  return /* config.server */ {
    port: 8888,
    host: "0.0.0.0",

    // cors: {
    //   origin: "*"
    // },

    //
    // HMR (Hot module replacement)
    //
    // @see https://github.com
    //        /vitejs/vite/blob/main/docs/config/index.md#serverhmr
    //
    //
    //
    // ### Option 1: enable or disable HMR
    //
    // hmr: false,
    hmr: true,
    //
    //
    // ### Option 2: use local HMR
    //
    // hmr: {
    //   // protocol: "ws",
    //   // host: 'localhost',
    //   // path: "/hmr",
    //   // port: 9999,
    //   // clientPort: 8888,
    //   // timeout: 10000
    // },
    //
    //
    // ### Option 3: use HMR via external proxy (e.g. ngrok)
    //
    // hmr: {
    //   // URL: wss://XXXX-000-000-000-000.ngrok.io[:443]/hmr
    //   protocol: "wss",
    //   host: 'XXXX-000-000-000-000.ngrok.io',
    //   path: "/hmr",
    //   port: 443,
    //   timeout: 10000
    // },

    open: false // open browser window on start
                // tip: use CMD-click on the url in iTerm2
  };
}
