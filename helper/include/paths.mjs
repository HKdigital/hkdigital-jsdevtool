
import { resolve } from "path";

import { isFolder,
         ensureFolder,
         listFolderNames } from "./fs.mjs";

/* ---------------------------------------------------------------- Internals */

export const SRC_ROOT_NAME = "src";
export const LIB_ROOT_NAME = "lib";
export const DIST_ROOT_NAME = "dist";
export const DEVTOOLS_ROOT_NAME = "hkdigital-devtool";
export const CONFIG_ROOT_NAME = "config";

export const CURRENT_SCRIPT_RELATIVE_PATH =
  `${DEVTOOLS_ROOT_NAME}/helper/include/paths.mjs`;

const paths = {};

/**
 * Detect projectFolder, src and lib paths
 * - places detected paths in global variable `paths`
 */
function detectPaths()
{
  const currentFilePath = import.meta.url;

  // console.log( { currentFilePath,
  //                CURRENT_SCRIPT_RELATIVE_PATH } );

  if( !currentFilePath.endsWith( CURRENT_SCRIPT_RELATIVE_PATH ) )
  {
    throw new Error(
      `Failed to detect project root. ` +
      `Current file path should end with  [${CURRENT_SCRIPT_RELATIVE_PATH}]`);
  }

  // console.log( { test: new URL( currentFilePath ).pathname } );

  let pathname = new URL( currentFilePath ).pathname;

  let protoPrefix = "";

  if( pathname.charAt(0) === "/" && pathname.charAt(2) === ":" )
  {
    // on windows pathname looks like `/C:/Users/.../....`
    // => remove first slash
    pathname = pathname.slice( 1 );

    // Windows doesn't like e.g. %20 for space
    // => decode URI
    pathname = decodeURI( pathname );

    // pathname = "file://" + pathname;

    protoPrefix = "file:////";
  }

  const projectFolder =
    pathname
    .slice( 0, -( CURRENT_SCRIPT_RELATIVE_PATH.length + 1) );

  // console.log( { projectFolder } );

  paths.protoPrefix = protoPrefix;

  paths.projectFolder = projectFolder;

  paths.src =
    resolve( projectFolder, SRC_ROOT_NAME );

  paths.libRoot =
    resolve( projectFolder, LIB_ROOT_NAME );

  // console.log( paths );
}

/* ------------------------------------------------------------------ Exports */

/**
 * Resolve (get) the full path of a folder that resides in the
 * `projectRoot` folder
 *
 * @param {...string} [path] - Sub paths
 * @param {object} [options={ returnURI:false }]
 *
 * @returns {string} full path
 */
export function resolveProjectPath()
{
  if( !paths.projectFolder )
  {
    detectPaths();
  }

  const n = arguments.length;

  let returnURI = false;

  if( n > 0 )
  {
    const options = arguments[ n - 1 ];

    if( options )
    {
      returnURI = !!options.returnURI;
    }
  }

  // Split path parts that contain path separator "/"

  const parts = [];

  for( let j = 0, n = arguments.length; j < n; j = j + 1 )
  {
    const part = arguments[ j ];

    if( typeof part === "string" )
    {
        parts.push( ...part.split( "/" ) );
    }
  }

  if( !returnURI )
  {
    return resolve( paths.projectFolder, ...parts );
  }
  else {
    return paths.protoPrefix + resolve( paths.projectFolder, ...parts );
  }
}

// ---------------------------------------------------------------------- Method

/**
 * Resolve (get) the full path of a folder that resides in the
 * `config` folder
 *
 * @param {...string} [path] - Sub paths
 * @param {object} [options={ returnURI:false }]
 *
 * @returns {string} full path
 */
export function resolveConfigPath()
{
  return resolveProjectPath( CONFIG_ROOT_NAME, ...arguments );
}

// ---------------------------------------------------------------------- Method

/**
 * Resolve (get) the full path of a folder that resides in the
 * `devtools` folder
 *
 * @returns {string} full path
 * @param {object} [options={ returnURI:false }]
 */
export function resolveDevToolsPath()
{
  return resolveProjectPath( DEVTOOLS_ROOT_NAME, ...arguments );
}

// ---------------------------------------------------------------------- Method

/**
 * Resolve (get) the full path of a folder that resides in the `src` folder
 *
 * @param {...string} [path] - Sub paths
 * @param {object} [options={ returnURI:false }]
 *
 * @returns {string} full path
 */
export function resolveSrcPath()
{
  return resolveProjectPath( SRC_ROOT_NAME, ...arguments );
}

// ---------------------------------------------------------------------- Method

/**
 * Resolve (get) the full path of a folder that resides in the `lib` folder
 *
 * @param {...string} [path] - Sub paths
 * @param {object} [options={ returnURI:false }]
 *
 * @returns {string} full path
 */
export function resolveLibPath()
{
  return resolveProjectPath( LIB_ROOT_NAME, ...arguments );
}

// ---------------------------------------------------------------------- Method

/**
 * Resolve (get) the full path of a folder that resides in the `dist` folder
 *
 * @param {...string} [path] - Sub paths
 * @param {object} [options={ returnURI:false }]
 *
 * @returns {string} full path
 */
export function resolveDistPath()
{
  return resolveProjectPath( DIST_ROOT_NAME, ...arguments );
}

// ---------------------------------------------------------------------- Method

/**
 * Get a list of folders names in the `lib` folder
 *
 * @returns {string[]} list of lib folder name
 */
export async function listLibNames()
{
  const libRoot = resolveLibPath();

  return await listFolderNames( libRoot );
}

// ---------------------------------------------------------------------- Method

/**
 * Return the path without the project path prefix
 *
 * @param {string} path
 *
 * @returns {string} stipped path
 */
export function stripProjectPath( path )
{
  const projectPath = resolveProjectPath();

  if( path.startsWith( projectPath ) )
  {
    path = path.slice( projectPath.length );

    if( path.startsWith("/") || path.startsWith("\\") )
    {
      path = path.slice(1);
    }
  }

  return path;
}

// ---------------------------------------------------------------------- Method

/**
 * Get a list of paths of folders in the `lib` folder
 *
 * @returns {string[]} list of lib folder paths
 */
// export async function listLibPaths()
// {
//   const libNames = await listLibNames();

//   const libPaths = [];

//   for( const libName of libNames )
//   {
//     libPaths.push( resolveLibPath( libName ) );
//   }

//   return libPaths;
// }

// ---------------------------------------------------------------------- Method

/**
 * Make sure a folder exists at the libRoot path
 */
export async function ensureLibPath( silent=false )
{
  if( !silent )
  {
    console.log("* Ensure lib folder exists");
  }

  const libRoot = resolveLibPath();

  if( !await isFolder( libRoot ) )
  {
    await ensureFolder( libRoot );

    console.log(`* Created lib folder [${stripProjectPath(libRoot)}]`);
  }
}
