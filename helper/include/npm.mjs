
import { resolveDevToolsPath,
         resolveProjectPath,
         stripProjectPath } from './paths.mjs';

import { execAsync } from './shell.mjs';

import { mergePackageJsons } from './package-json.mjs';

// -----------------------------------------------------------------------------

/**
 * Merge package.json's and run npm install
 */
export async function updateDepsNpm()
{
  await mergePackageJsons();
  await runNpmInstall();
}

// -----------------------------------------------------------------------------

/**
 * Run `npm install` in the project root folder
 *
 * @param {boolean} [silent=false]
 *   If set, no console output will be generated
 */
export async function runNpmInstallInDevtoolFolder( { silent=false }={} )
{
  await runNpmInstall( { silent, folderPath: resolveDevToolsPath() } );
}

// -----------------------------------------------------------------------------

/**
 * Run `npm install` in the project root folder or a custom folder
 *
 * @param {boolean} [silent=false]
 *   If set, no console output will be generated
 *
 * @param {string} [folderPath=<project-root-folder>]
 */
export async function runNpmInstall( { silent=false, folderPath }={} )
{
  const projectRootPath = resolveProjectPath();

  if( !folderPath )
  {
    folderPath = projectRootPath;
  }

  // ---------------------------------------------------------------------------
  // npm install
  {
    // const cmd = `npm install > /dev/null 2>&1`;
    const cmd = 'npm install';

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

      console.log(`* Running [npm install] in folder [${displayPath}]`);
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

  // ---------------------------------------------------------------------------
  // npm dedup
  {
    const cmd = 'npm dedup';

    if( !silent )
    {
      console.log('* Running [npm dedup]');
    }

    const { stdout, stderr } =
      await execAsync( cmd, { cwd: folderPath } );

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
