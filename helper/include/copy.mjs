
import { resolveProjectPath,
         resolveDevToolsPath } from "./paths.mjs";

import { isFolder,
         isFile,
         copyFile,
         listFolderNames,
         ensureFolder } from "./fs.mjs";

import { execAsync } from "./shell.mjs";

// ---------------------------------------------------------------------- Method

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

  const installFilesFolder = resolveDevToolsPath("./install-files/frontend");

  const cmd =
    `rsync --ignore-existing --archive --relative \
    "${installFilesFolder}/./" "${projectRootPath}" > /dev/null 2>&1`;

  await execAsync( cmd );
}

// ---------------------------------------------------------------------- Method

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

  const installFilesFolder = resolveDevToolsPath("./install-files/backend");

  const cmd =
    `rsync --ignore-existing --archive --relative \
    "${installFilesFolder}/./" "${projectRootPath}" > /dev/null 2>&1`;

  await execAsync( cmd );
}
