
import { resolveProjectPath,
         resolveLibPath,
         listLibNames } from './paths.mjs';

import { isFile,
         readFile,
         writeFile } from './fs.mjs';

// -----------------------------------------------------------------------------

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

  const rootPackageJsonPath = resolveProjectPath('package.json' );

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

  if( !packageJson.dependencies )
  {
    packageJson.dependencies = {};
  }

  const mergedDependencies = packageJson.dependencies;

  let mergedDevDependencies;

  if( includeDevDependencies )
  {
    if( !packageJson.devDependencies )
    {
      packageJson.devDependencies = {};
    }

    mergedDevDependencies = packageJson.devDependencies;
  }
  else {
    delete packageJson.devDependencies;
  }

  // -- Read `package.json` files from library folders

  for( const libName of libNames )
  {
    const path = resolveLibPath( libName, 'package.json' );

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
      if( e.code !== 'ENOENT' )
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
      console.log('* Write updated [package.json]');
    }

    await writeFile( outputPath, newPackageJsonContents, 'utf8' );

    return { updated: true };
  }
  else if( !silent )
  {
    console.log('* No update needed for [package.json]');
  }

  return { updated: false };
}

// -----------------------------------------------------------------------------

/**
 * Returns true if a `package.json` file exists in the project root
 *
 * @returns {boolean} true if a package.json file exists
 */
export async function packageJsonExists()
{
  return await isFile( resolveProjectPath('package.json') );
}

// -----------------------------------------------------------------------------

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

  const numVersionA = versionA.replace(/[^\d]/g, '');
  const numVersionB = versionB.replace(/[^\d]/g, '');

  // console.log( "compare", { numVersionA, numVersionB } );

  if( numVersionA > numVersionB )
  {
    return versionA;
  }
  else {
    return versionB;
  }
}