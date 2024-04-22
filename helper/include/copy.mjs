
import { resolveProjectPath,
         resolveDevToolsPath } from './paths.mjs';

import { execAsync } from './shell.mjs';

import { copyUsingGlobs } from './glob.mjs';

const SVELTE_FRONTEND_INSTALL_FILES_PATH = 'install-files/svelte-frontend';
const NODEJS_BACKEND_INSTALL_FILES_PATH = 'install-files/nodejs-backend';

// -------------------------------------------------------------------- Function

/**
 * Copy files from `hkdigital-jsdevtool/install-files/frontend`` to project root
 * - Uses rsync, existing files will not be overwritten
 */
export async function copyFrontendFiles( silent=false )
{
  if( !silent )
  {
    console.log('* Copy frontend files');
  }

  const projectRootPath = resolveProjectPath();

  const sourceBasePath =
    resolveDevToolsPath( SVELTE_FRONTEND_INSTALL_FILES_PATH );

  // const files =
  await copyUsingGlobs(
    {
      sourceGlob: [
        `${sourceBasePath}/**/*`,
        `${sourceBasePath}/**/.eslintrc*`,
        `${sourceBasePath}/**/.gitignore`
      ],
      sourceBasePath,
      targetFolder: `${projectRootPath}`,
      overwrite: false
    } );

  // console.log( files );

  const cmd =
    `chmod +x "${projectRootPath}/devtool.mjs" > /dev/null 2>&1`;

  try {
    await execAsync( cmd );
  }
  catch( e )
  {
    console.log(
      '- Failed to make devtool executable (use node devtool.mjs to run)\n');
  }
}

// -------------------------------------------------------------------- Function

/**
 * Copy files from `hkdigital-jsdevtool/install-files/backend`` to project root
 * - Uses rsync, existing files will not be overwritten
 */
export async function copyBackendFiles( silent=false )
{
  if( !silent )
  {
    console.log('* Copy backend files');
  }

  const projectRootPath = resolveProjectPath();

  // const installFilesFolder =
  //   resolveDevToolsPath( NODEJS_BACKEND_INSTALL_FILES_PATH );

  const sourceBasePath =
    resolveDevToolsPath( NODEJS_BACKEND_INSTALL_FILES_PATH );

  // const files =
  await copyUsingGlobs(
    {
      sourceGlob: [
        `${sourceBasePath}/**/*`,
        `${sourceBasePath}/**/.eslintrc*`,
        `${sourceBasePath}/**/.gitignore`
      ],
      sourceBasePath,
      targetFolder: `${projectRootPath}`,
      overwrite: false
    } );

  const cmd =
    `chmod +x "${projectRootPath}/devtool.mjs" > /dev/null 2>&1`;

  try {
    await execAsync( cmd );
  }
  catch( e )
  {
    console.log(
      '- Failed to make devtool executable (use node devtool.mjs to run)\n');
  }
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
