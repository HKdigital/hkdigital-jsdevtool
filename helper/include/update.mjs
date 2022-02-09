
import { resolveProjectPath, 
         resolveDevToolsPath } from "./paths.mjs";

import { copyFile } from "./fs.mjs";

/**
 * Copy the [devtool.mjs] file from the [install-files] folder into the 
 * project root 
 * 
 * @param {string} installFilesFolderName
 *   Name of the sub folder in [install-files], 
 *   e.g. `nodejs-backend` or `svelte-frontend`
 */
export async function updateDevtool( installFilesFolderName )
{
  const devToolFileName = "devtool.mjs";

  const fromPath = 
    resolveDevToolsPath(
      "install-files",
      installFilesFolderName,
      devToolFileName );

  const toPath =  resolveProjectPath( devToolFileName );


  await copyFile( fromPath, toPath );
}