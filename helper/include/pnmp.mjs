
import { resolveDevToolsPath,
         resolveProjectPath,
         stripProjectPath } from './paths.mjs';

import { execAsync } from './shell.mjs';

import { mergePackageJsons } from './package-json.mjs';

// -------------------------------------------------------------------- Function

export async function installPnpm( silent=false )
{
  const cmd = 'npm install -g pnpm';

  const projectRootPath = resolveProjectPath();

  try {
    await execAsync( 'pnpm -v', { cwd: projectRootPath } );
  }
  catch( e )
  {
    //
    // pnpm not installed yet
    //
    const { stdout, stderr } = await execAsync( cmd, { cwd: projectRootPath } );

    if( !silent )
    {
      if( stdout )
      {
        console.log( stdout );
      }

      if( stderr )
      {
        console.log( stderr );
      }
    }
  }
}

// -------------------------------------------------------------------- Function

/**
 * Merge package.json's and run npm install
 */
export async function updateDepsPnpm()
{
  await mergePackageJsons();
  await runPnpmInstall();
}

// -------------------------------------------------------------------- Function

/**
 * Run `pnpm install` in the project root folder
 *
 * @param {boolean} [silent=false]
 *   If set, no console output will be generated
 */
export async function runPnpmInstallInDevtoolFolder( { silent=false }={} )
{
  await runPnpmInstall( { silent, folderPath: resolveDevToolsPath() } );
}

// -------------------------------------------------------------------- Function

/**
 * Run `pnpm install` in the project root folder or a custom folder
 *
 * @param {boolean} [silent=false]
 *   If set, no console output will be generated
 *
 * @param {string} [folderPath=<project-root-folder>]
 */
export async function runPnpmInstall( { silent=false, folderPath }={} )
{
  const projectRootPath = resolveProjectPath();

  if( !folderPath )
  {
    folderPath = projectRootPath;
  }

  // ---------------------------------------------------------------------------
  // pnpm install
  {
    // const cmd = `pnpm install > /dev/null 2>&1`;
    const cmd = 'pnpm install';

    if( !silent )
    {
      let displayPath;

      if( folderPath === projectRootPath )
      {
        displayPath = projectRootPath;
      }
      else {
        displayPath = stripProjectPath(folderPath);
      }

      console.log(`* Running [pnpm install] in folder [${displayPath}]`);
    }

    const { stdout, stderr } = await execAsync( cmd, { cwd: folderPath } );

    if( !silent )
    {
      if( stdout )
      {
        console.log( stdout );
      }

      if( stderr )
      {
        console.log( stderr );
      }
    }
  }
}