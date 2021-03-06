
import { resolveDevToolsPath,
         resolveProjectPath,
         resolveLibPath,
         listLibNames,
         stripProjectPath } from "./paths.mjs";

import { isFile,
         readFile,
         writeFile } from "./fs.mjs";

import { execAsync } from "./shell.mjs";


// -------------------------------------------------------------------- Function

/**
 * Merge package.json's and run npm install
 */
export async function updateDeps()
{
  await mergePackageJsons();
  await runNpmInstall();
}

// -------------------------------------------------------------------- Function

/**
 * Read dependencies in the package.json in the root folder and package.json
 * files from shared lib folder and merge them into the package.json in the
 * root folder
 *
 * @param {object} [{outputPath}] - Root package.json path by default
 *
 * @param {boolean} [silent=false]
 *   If set, no console output will be generated
 *
 * @returns {object} { updated: <boolean> }
 */
export async function mergePackageJsons(
  {
    outputPath=null,
    includeDevDependencies=true,
    silent=false
  }={} )
{
  const libNames = await listLibNames();

  const rootPackageJsonPath = resolveProjectPath("package.json" );

  // let outputPath;
  // let silent = false;

  if( !outputPath )
  {
    outputPath = rootPackageJsonPath;
  }

  // -- Read root `package.json`

  const rootPackageJsonContents =
    await readFile( rootPackageJsonPath, 'utf8' );

  const packageJson = JSON.parse( rootPackageJsonContents );

  const mergedDependencies = packageJson.dependencies || {};

  let mergedDevDependencies;

  if( includeDevDependencies )
  {
    mergedDevDependencies = packageJson.devDependencies || {};
  }
  else {
    delete packageJson.devDependencies;
  }

  // -- Read `package.json` files from library folders

  for( const libName of libNames )
  {
    const path = resolveLibPath( libName, "package.json" );

    try {
      const contents = await readFile( path, 'utf8' );

      const { dependencies, devDependencies } = JSON.parse( contents );

      if( !silent )
      {
        console.log(`+ Found package.json [${path}]`);
      }

      for( const label in dependencies )
      {
        const version = dependencies[ label ];

        mergedDependencies[ label ] =
          highest_version( version, mergedDependencies[ label ] );
      } // end for

      if( includeDevDependencies )
      {
        for( const label in devDependencies )
        {
          const version = devDependencies[ label ];

          mergedDevDependencies[ label ] =
            highest_version( version, mergedDevDependencies[ label ] );
        } // end for
      }
    }
    catch( e ) {
      if( e.code !== "ENOENT" )
      {
        console.log(`Failed to read [${path}]`);

        // Ignore file error, but rethrow rest of the errors
        throw e;
      }
    }
  } // end for

  const newPackageJsonContents = JSON.stringify(packageJson, null, 2);

  let existingJsonContents = null;

  if( outputPath === rootPackageJsonPath )
  {
    existingJsonContents = rootPackageJsonContents;
  }
  else if( await isFile( outputPath ) )
  {
    existingJsonContents = await readFile( outputPath, 'utf8' );
  }

  if( existingJsonContents !== newPackageJsonContents )
  {
    if( !silent )
    {
      console.log("* Write updated [package.json]");
    }

    await writeFile( outputPath, newPackageJsonContents, 'utf8' );

    return { updated: true };
  }
  else if( !silent )
  {
    console.log("* No update needed for [package.json]");
  }

  return { updated: false };
}

// -------------------------------------------------------------------- Function

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

// -------------------------------------------------------------------- Function

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
  let projectRootPath = resolveProjectPath();

  if( !folderPath )
  {
    folderPath = projectRootPath;
  }

  // ---------------------------------------------------------------------------
  // npm install
  {
    // const cmd = `npm install > /dev/null 2>&1`;
    const cmd = `npm install`;

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
    const cmd = `npm dedup`;

    if( !silent )
    {
      console.log(`* Running [npm dedup]`);
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

// -------------------------------------------------------------------- Function

/**
 * Returns true if a `package.json` file exists in the project root
 *
 * @returns {boolean} true if a package.json file exists
 */
export async function packageJsonExists()
{
  return await isFile( resolveProjectPath("package.json") );
}

// -------------------------------------------------------------------- Function

/**
 * Returns the highest version string
 *
 * @param {string} versionA
 * @param {string} [versionB]
 *
 * @returns {string} highest version
 */
function highest_version( versionA, versionB=null )
{
  if( !versionB )
  {
    return versionA;
  }

  const numVersionA = versionA.replace(/[^\d]/g, "");
  const numVersionB = versionB.replace(/[^\d]/g, "");

  // console.log( "compare", { numVersionA, numVersionB } );

  if( numVersionA > numVersionB )
  {
    return versionA;
  }
  else {
    return versionB;
  }
}