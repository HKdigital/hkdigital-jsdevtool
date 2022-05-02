
import { stripProjectPath,
         resolveProjectPath,
         resolveDevToolsPath } from "./paths.mjs";

import { copyFile } from "./fs.mjs";


/**
 * Copy the [devtool.mjs] file from the [install-files] folder into the 
 * project root 
 * 
 * @param {string} installFilesFolderName
 *   Name of the sub folder in [install-files], 
 *   e.g. `nodejs-backend` or `svelte-frontend`
 *
 * @param {boolean} [silent=false]
 *   If set, no console output will be generated
 *
 */
export async function updateDevtool( { installFilesFolderName, silent=false } )
{
  if( typeof installFilesFolderName !== "string" )
  {
    throw new Error("Missing or invalid parameter [installFilesFolderName]");
  }

  const devToolFileName = "devtool.mjs";

  const fromPath = 
    resolveDevToolsPath(
      "install-files",
      installFilesFolderName,
      devToolFileName );

  const toPath = resolveProjectPath( devToolFileName );

  await copyFile( fromPath, toPath, { overwrite: true } );

  if( !silent )
  {
    console.log(
      `\nNote: to upgrade the [hkdigital-jsdevtool] folder contents, see ` +
      `[https://github.com/HKdigital/hkdigital-jsdevtool].`);

    console.log(
      `\n* Copied [${stripProjectPath(fromPath)}] ` +
      `to [${stripProjectPath(toPath)}]\n`);
  }
}