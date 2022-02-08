
import pathTool from 'path';

import { access,
         mkdirSync,
         promises as fsPromises } from "fs";

const stats = fsPromises.stat;

// ------------------------------------------------------------------ Re-exports

export const readFile = fsPromises.readFile;
export const writeFile = fsPromises.writeFile;
export const copyFile = fsPromises.copyFile;

// ---------------------------------------------------------------------- Method

/**
 * Read and return parsed contents of a  JSON file
 *
 * @param {string} path
 *
 * @returns {object} Parsed JSON file contents
 */
export async function readJSONFile( path )
{
  try {
    const content = await fsPromises.readFile( path );

    return JSON.parse( content );
  }
  catch( e )
  {
    console.log(`- Failed to read JSON file [${path}]`);
    console.log( e );
    console.log();
    process.exit(1);
  }
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

// ---------------------------------------------------------------------- Method

/**
 * List the names of the folders inside the specified folder path
 *
 * @param {string} containerPath - Path that contains the folders to list
 *
 * @param {function} [options.filter]
 *   Function that returns true if the folderName should be included in the
 *   list of results
 *
 * @param {string} [options.followSymlinks=true] - Follows symlinks
 *
 * @returns {array} list of folder names
 */
export async function listFolderNames( containerPath, options )
{
  let filter = options ? options.filter : null;

  try {
    const basenames = await fsPromises.readdir( containerPath );

    const folderNames = [];

    for( let j = 0, n = basenames.length; j < n; j = j + 1 )
    {
      const basename = basenames[j];

      const path = pathTool.join( containerPath, basename );

      if( !await isFolder( path, options ) )
      {
        // console.log( "not a folder", path );
        continue;
      }

      if( filter && !await filter( basename ) )
      {
        // ignore current folder name
        continue;
      }

      folderNames.push( basename );
    }

    return folderNames;
  }
  catch( e )
  {
    // throw e;
    throw new Error(
      `Failed to read folders names from [${containerPath}]`);
  }
}

// ---------------------------------------------------------------------- Method

/**
 * Make sure the specified folder exists
 * - Creates a new folder if the folder is missing
 *
 * @param {string} path - Path of the folder to create if missing
 *
 * @param {object} [options] - Options
 *
 * @returns {Promise} promise that resolves when the function is done
 */
export async function ensureFolder( path, options )
{
  let _resolve;
  let _reject;

  const promise =
    new Promise( ( resolve, reject ) =>
      {
        _resolve = resolve;
        _reject = reject
      } );

  access( path, function( err )
  {
    if( err && err.code === 'ENOENT')
    {
      try {
        // @note Promise based version fails on Mac OS (fs.ensureDir)
        // @note NodeJS not supports recursive creation of folders natively
        //fs.ensureDirSync( path );
        mkdirSync( path, { recursive: true } );

        // hk.log.info("Created local folder ["+path+"]");
      }
      catch( e )
      {
        _reject(
          new Error(`Could not create local folder [${path}]. ${e.message}`) );
        return;
      }
    }

    _resolve();
  } );

  return promise;
}