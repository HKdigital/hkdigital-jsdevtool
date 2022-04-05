
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


  // let Rsync;

  // try {
  //   Rsync = (await import("rsync")).default;
  // }
  // catch(e)
  // {
  //   const cmd = "npm install";

  //   try {
  //     await execAsync( cmd );
  //   }
  //   catch( e )
  //   {
  //     console.log("Failed to load module [rsync] and failed to run [npm install]");
  //     throw new Error(e);
  //   }
  // }

  // // Build the command
  // const rsync = new Rsync();

  // console.log( { source: installFilesFolder, destination: projectRootPath } );

  // rsync
  //   // .shell('rsync')
  //   .set("ignore-existing")
  //   .set("archive")
  //   .set("relative")
  //   .source( installFilesFolder )
  //   .destination( projectRootPath );

  // console.log( { command: rsync.command() } );

  // let resolve;
  // let reject;

  // const promise = new Promise( ( _resolve, _reject ) => {
  //   resolve = _resolve;
  //   reject = _reject;
  // } );

  // // Execute the command

  // rsync.execute( function( error, code, cmd ) {
  //     // we're done
  //     if( error )
  //     {
  //       console.log( 123, error );
  //       return reject( error )
  //     }

  //     resolve();
  // });

  // await promise;

  const cmd =
    `rsync --ignore-existing --archive --relative \
    "${installFilesFolder}/./" "${projectRootPath}" > /dev/null 2>&1`;

  try {
    await execAsync( cmd );
  }
  catch( e )
  {
    console.log(
      "- Failed to execute RSYNC command " +
      "  (make sure rsync is installed on your system)\n");

    throw e;
  }

  await copyDevTool();
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
