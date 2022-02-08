
import { resolveProjectPath,
         resolveDevToolsPath } from "./paths.mjs";

import { copyFile } from "./fs.mjs";

import { execAsync } from "./shell.mjs";

const SVELTE_FRONTEND_INSTALL_FILES_PATH = "install-files/svelte-frontend";
const NODEJS_BACKEND_INSTALL_FILES_PATH = "install-files/nodejs-backend";

// -------------------------------------------------------------------- Function

/**
 * Copy files from `hkdigital-devtool/install-files/frontend`` to project root
 * - Uses rsync, existing files will not be overwritten
 */
export async function copyFrontendFiles( silent=false )
{
  if( !silent )
  {
    console.log("* Copy frontend files");
  }

  const projectRootPath = resolveProjectPath();

  const installFilesFolder =
    resolveDevToolsPath( SVELTE_FRONTEND_INSTALL_FILES_PATH );

  const cmd =
    `rsync --ignore-existing --archive --relative \
    "${installFilesFolder}/./" "${projectRootPath}" > /dev/null 2>&1`;

  await execAsync( cmd );

  // await copyDevTool();
}

// -------------------------------------------------------------------- Function

/**
 * Copy files from `hkdigital-devtool/install-files/backend`` to project root
 * - Uses rsync, existing files will not be overwritten
 */
export async function copyBackendFiles( silent=false )
{
  if( !silent )
  {
    console.log("* Copy backend files");
  }

  const projectRootPath = resolveProjectPath();

  const installFilesFolder =
    resolveDevToolsPath( NODEJS_BACKEND_INSTALL_FILES_PATH );

  const cmd =
    `rsync --ignore-existing --archive --relative \
    "${installFilesFolder}/./" "${projectRootPath}" > /dev/null 2>&1`;

  await execAsync( cmd );

  // await copyDevTool();
}

// -------------------------------------------------------------------- Function

/**
 * Copy `devtool` script into project root folder
 */
// async function copyDevTool()
// {
//   await copyFile(
//     resolveDevToolsPath( "install-files/devtool.mjs" ),
//     resolveProjectPath( "devtool.mjs") );
// }
