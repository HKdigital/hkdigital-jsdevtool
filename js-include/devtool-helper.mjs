
import { resolve, dirname } from "path";


import { existsSync,
         writeFileSync,
         promises as fsPromises } from "fs";

const stats = fsPromises.stat;

import { promisify } from "util";
import { exec } from "child_process";

const execAsync = promisify( exec );

/* ---------------------------------------------------------------- Internals */

export const DEVTOOLS_PATH = "devtools-hk";

export const CURRENT_SCRIPT_RELATIVE_PATH =
  `${DEVTOOLS_PATH}/js-include/devtool-helper.mjs`;

export const SRC_ROOT_NAME = "src";
export const LIB_ROOT_NAME = "lib";

const paths = {};

/**
 * Detect projectFolder, src and lib paths
 * - places detected paths in global variable `paths`
 */
function detectPaths()
{
  const currentFilePath = import.meta.url;

  if( !currentFilePath.endsWith( CURRENT_SCRIPT_RELATIVE_PATH ) )
  {
    throw new Error(
      `Failed to detect project root. ` +
      `Current file path should end with  [${CURRENT_SCRIPT_RELATIVE_PATH}]`);
  }

  paths.projectFolder =
    new URL( currentFilePath )
      .pathname
      .slice( 0, -( CURRENT_SCRIPT_RELATIVE_PATH.length + 1) );

  paths.src = resolve( paths.projectFolder, SRC_ROOT_NAME );

  paths.libRoot = resolve( paths.projectFolder, LIB_ROOT_NAME );

  // console.log( paths );
}

/* ------------------------------------------------------------------ Exports */

/**
 * Resolve (get) the full path of a folder that resides in the
 * `projectRoot` folder
 *
 * @param {string} [path="."] - Sub path inside the `projectRoot` folder.
 *
 * @returns {string} full path of the folder inside the `projectRoot` folder
 */
export function resolveProjectPath( path="." )
{
  if( !paths.projectFolder )
  {
    detectPaths();
  }

  return resolve( paths.projectFolder, ...arguments );
}

// ---------------------------------------------------------------------- Method

/**
 * Resolve (get) the full path of a folder that resides in the
 * `projectRoot` folder
 *
 * @param {string} [subPath="."] - Sub path inside the `projectRoot` folder.
 *
 * @returns {string} full path of the folder inside the `projectRoot` folder
 */
export function resolveDevToolsPath( path="." )
{
  return resolveProjectPath( DEVTOOLS_PATH, path );
}

// ---------------------------------------------------------------------- Method

/**
 * Resolve (get) the full path of a folder that resides in the `src` folder
 *
 * @param {string} [subPath="."] - Sub path inside the `src` folder.
 *
 * @returns {string} full path of the folder inside the `src` folder
 */
export function resolveSrcPath( path="." )
{
  return resolveProjectPath( SRC_ROOT_NAME, path );
}

// ---------------------------------------------------------------------- Method

/**
 * Resolve (get) the full path of a folder that resides in the `lib` folder
 *
 * @param {string} [subPath="."] - Sub path inside the `lib` folder.
 *
 * @returns {string} full path of the folder inside the `lib` folder
 */
export function resolveLibPath( path="." )
{
  return resolveProjectPath( LIB_ROOT_NAME, path );
}

// ---------------------------------------------------------------------- Method

/**
 * Returns a promise that returns true if a file system node is a folder at
 * the specified path.
 *
 * @param {string} path - Path to check
 *
 * @param {object} [options] - Options
 * @param {string} [options.followSymlinks=true] - Follows symlinks
 *
 * @returns {boolean} true if a file system node is a folder
 */
export async function isFolder( path, options )
{
  try {
    let stats_ = await stats( path, options );

    if( !stats_ )
    {
      return false;
    }

    return stats_.isDirectory();
  }
  catch( e )
  {
    return false;
  }
}

// ---------------------------------------------------------------------- Method

/**
 * Returns a promise that returns true if a file system node is a file at
 * the specified path.
 *
 * @param {string} path - Path to check
 *
 * @param {object} [options] - Options
 * @param {string} [options.followSymlinks=true] - Follows symlinks
 *
 * @returns {boolean} true if a file system node is a file
 */
export async function isFile( path, options )
{
  try {
    let stats_ = await stats( path, options );

    if( !stats_ )
    {
      return false;
    }

    return stats_.isFile();
  }
  catch( e )
  {
    return false;
  }
}

/* --------------------------------------------------- Setup helper functions */

/**
 * Set the internal variable `projectRootPath`
 */
// function detectProjectPath()
// {
//   if( !projectRootPath )
//   {
//     projectRootPath = resolveProjectPath();

//     console.log( `~ Using project path [${projectRootPath}]` );
//   }
// }

// ---------------------------------------------------------------------- Method

/**
 * Returns true if a `package.json` file exists in the project root
 *
 * @returns {boolean} true if a package.json file exists
 */
export async function packageJsonExists()
{
  return await isFile( resolveProjectPath("package.json") );
}

// ---------------------------------------------------------------------- Method

/**
 * Make sure a folder exists at the libRoot path
 */
export async function ensureLibPath( silent=false )
{
  if( !silent )
  {
    console.log("* ensure lib folder exists");
  }

  const libRoot = resolveLibPath();

  if( !await isFolder( libRoot ) )
  {
    await fsPromises.mkdir( libRoot );

    console.log(`* Created lib folder [${libRoot}]`);
  }
}

// ---------------------------------------------------------------------- Method

/**
 * Copy files from `devtools-hk/install-files/frontend`` to project root
 * - Uses rsync, existing files will not be overwritten
 */
export async function copyFrontendFiles( silent=false )
{
  if( !silent )
  {
    console.log("* copy frontend files");
  }

  const projectRootPath = resolveProjectPath();

  const installFilesFolder = resolveDevToolsPath("./install-files/frontend");

  const cmd =
    `rsync --ignore-existing --archive --relative \
    "${installFilesFolder}/./" "${projectRootPath}" > /dev/null 2>&1`;

  await execAsync( cmd );
}

/**
 * Copy files from `devtools-hk/install-files/backend`` to project root
 * - Uses rsync, existing files will not be overwritten
 */
export async function copyBackendFiles( silent=false )
{
  if( !silent )
  {
    console.log("* copy backend files");
  }

  const projectRootPath = resolveProjectPath();

  const installFilesFolder = resolveDevToolsPath("./install-files/backend");

  const cmd =
    `rsync --ignore-existing --archive --relative \
    "${installFilesFolder}/./" "${projectRootPath}" > /dev/null 2>&1`;

  await execAsync( cmd );
}

/**
 * Run `npm install` in the project root folder
 */
export async function runNpmInstall( silent=false )
{
  if( !silent )
  {
    console.log("* running `npm install`");
  }

  const projectRootPath = resolveProjectPath();

  // const cmd = `npm install > /dev/null 2>&1`;
  const cmd = `npm install`;

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
