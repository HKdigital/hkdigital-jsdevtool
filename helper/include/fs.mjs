
import pathTool from 'path';

import { access,
         mkdirSync,
         promises as fsPromises,
         createReadStream,
         createWriteStream } from "fs";

const stats = fsPromises.stat;
const unlink = fsPromises.unlink;
const readlink = fsPromises.readlink;

import { promisify } from 'util';

import stream from "stream";

export const pipelineAsync = promisify( stream.pipeline );

import { expectString,
         expectObject } from "./expect.mjs";

import { stripProjectPath,
         sandboxPath,
         dirname } from "./paths.mjs";

// ------------------------------------------------------------------ Re-exports

export const readFile = fsPromises.readFile;
export const writeFile = fsPromises.writeFile;
export const symlink = fsPromises.symlink;

// ---------------------------------------------------------------------- Method

/**
 * Copy a folder and its contents to the specified location
 * - Parent folders for the target location will be created if missing.
 *
 * @param {string} sourcePath - Path of the file to copy
 * @param {string} targetPath - Destination path
 *
 * @param {object} [options] - Options
 *
 * @param {boolean} [options.overwrite=false]
 *   If set to false and the target file exists, an exception is raised
 *
 * @param {string} [options.sandboxPath=ROOT_PATH]
 *   The folder to empty should not be ouside the "sandboxPath"
 *
 * @param {boolean} [options.allowProjectParentFolderAccess=false]
 *   By setting this option, the sandbox also allows paths within the
 *   parent folder of the project
 *
 * @param {boolean} [overwrite=false]
 *   If true an existing file at the destination will be overwritten
 *
 * @returns {boolean} true after the folder has been emptied
 */
export async function copyFile( sourcePath, targetPath, options )
{
  expectString( sourcePath, "Missing or invalid parameter [sourcePath]");
  expectString( targetPath, "Missing or invalid parameter [targetPath]");

  options = Object.assign(
    {
      overwrite: false,
      sandboxPath: null,
      allowProjectParentFolderAccess: false
    },
    options );

  let overwrite = options.overwrite;

  sourcePath = sandboxPath( sourcePath, options );
  targetPath = sandboxPath( targetPath, options );

  let targetFolder = dirname(targetPath);

  // console.log("COPY FILE",
  // {
  //   sourcePath: sourcePath,
  //   targetPath: targetPath,
  //   targetFolder: targetFolder
  // } );

  await ensureFolder( targetFolder, options );

  if( !await isFile( sourcePath, options ) )
  {
    throw new Error("Source file was not found at path ["+sourcePath+"]");
  }

  let targetFileExists = await isFile( targetPath, options );

  if( !overwrite && targetFileExists )
  {
    // throw new Error(
    //   "A file system node exists at path ["+targetPath+"], " +
    //   "and overwrite is set to false");
    console.log(
      `Ignore copy over existing node [${stripProjectPath(targetPath)}]`);

    return false;
  }

  if( !targetFileExists && await exists( targetPath, options ) )
  {
    throw new Error(
      "A file system node exists at path ["+targetPath+"], " +
      "but is not a file");
  }

  let sourceStream = await tryGetReadStream( sourcePath, options );

  // await writeStream( targetPath, sourceStream, { overwrite } );
  await writeStream( targetPath, sourceStream, options );

  return true;
}

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
 * Returns a promise that returns true if a file system node exists at
 * the specified path and is a symlink
 *
 * @param {string} path - Path to check
 *
 * @return {Promise<boolean>}
 *   true if a symlink exists at the specified location
 */
export async function isSymlink( path )
{
  expectString( path, "Missing or invalid parameter [path]");

  try {
    await readlink( path );

    // Link could be read -> is symbolic link
    return true;
  }
  catch( e )
  {
    if( e && e.code === 'ENOENT')
    {
      // Link could not be read -> is not a symbolic link
      return false;
    }
    else {
      console.log(e);
      process.exit();
    }
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
 * @returns {Promise} promise that resolves when the function is done
 */
export async function ensureFolder( path )
{
  let _resolve;
  let _reject;

  const promise =
    new Promise( ( resolve, reject ) =>
      {
        _resolve = resolve;
        _reject = reject;
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

// ---------------------------------------------------------------------- Method

/**
 * Read file contents and output data via a NodeJs Stream
 * - The file contents are read as binary datas
 *
 * @param {string} path - Path of the file to read
 *
 * @param {object} [options] - Options
 *
 * @param {string} [options.sandboxPath=ROOT_PATH]
 *   The folder to empty should not be ouside the "sandboxPath"
 *
 * @param {boolean} [options.allowProjectParentFolderAccess=false]
 *   By setting this option, the sandbox also allows paths within the
 *   parent folder of the project
 *
 * @returns {Stream} read stream
 */
export async function tryGetReadStream( path, options )
{
  if( !await isFile( path, options ) )
  {
    throw new Error(
      `Cannot read file. No file found at path [${stripProjectPath(path)}].`);
  }

  try {
    // default 64 * 1024, probably better: highWaterMark: 256 * 1024

    return createReadStream( path, options );
  }
  catch( e )
  {
    /* @note ignore exceptions */
    return null;
  }
}

// ---------------------------------------------------------------------- Method

/**
 * Write file from file contents that is supplied as readble stream
 *
 * @param {string} path - File path
 * @param {Stream} fileContents - Data to write
 *
 * @param {object} [options] - Options
 *
 * @param {string} [options.overwrite=false]
 *   If false, the function will throw an exception on an overwrite attempt
 *
 * @param {string} [options.autoCreateParentFolders=true]
 *   If true, auto create parent folders if missing
 *
 * @param {boolean} [options.append=false]
 *   If set to true, data written to the file will be appended to existing
 *   file contents.
 *
 * @param {string} [options.encoding='binary'] - Encoding of file contents
 *
 * @return {Promise} promise that resolves when the file has been written
 */
export async function writeStream( path, fileContents, options={} )
{
  expectString( path,
    "Missing or invalid parameter [path]");

  if( !isReadableStream( fileContents ) )
  {
    throw new Error(
      "Missing or invalid parameter [fileContents] " +
      "(expected readable stream)");
  }

  expectObject( options,
    "Missing or invalid parameter [options]");

  const writeParams = await _prepareWrite( path, options );

  const writePath = writeParams.writePath;

  //
  // @note stream contents -> use 'binary' encoding by default
  //
  let encoding = writeParams.encoding || 'binary';

  return _finalizeWrite( writeParams, new Promise( async function( resolve, reject )
    {
      let flags = writeParams.append ? 'a' : 'w';

      //
      // @note write streams are non-blocking
      // @note flags 'w' creates a new file or truncates an existing file
      //
      let writeStream =
        createWriteStream( writePath, { encoding, flags } );

      writeStream.on('error', async ( err ) => {

       await tryRemoveFile( writeParams.outputPath, options );

       reject( err );
      } );

      // "close" event seems to work,
      // "finish" is emitted before meta data is written
      // -> to be sure, check both

      let finished = false;
      let closed = false;

      async function tryFinish()
      {
        if( !finished || !closed )
        {
          return;
        }

        resolve();
      }

      writeStream.on('finish', () =>
        {
          finished = true;
          tryFinish();
        } );

      writeStream.on('close', () =>
        {
          closed = true;
          tryFinish();
        } );

      writeStream.on('error', ( err ) =>
        {
          reject( err );
        } );

      // fileContents.on('error', function ( err )
      // {
      //   reject( err );
      // } );

      // fileContents.on('end', function ()
      // {
      //   resolve({});
      // } );

      await pipelineAsync(
        fileContents,
        writeStream
      );
    } )
  );
}

// ---------------------------------------------------------------------- Method

/**
 * Returns a promise that returns true if a file system node exists at
 * the specified path.
 *
 * @param {string} path - Path to check
 *
 * @param {object} [options] - Options
 *
 * @param {string} [options.sandboxPath=ROOT_PATH]
 *   The folder to empty should not be ouside the "sandboxPath"
 *
 * @param {boolean} [options.allowProjectParentFolderAccess=false]
 *   By setting this option, the sandbox also allows paths within the
 *   parent folder of the project
 *
 * @return {Promise<boolean>}
 *   true if a file system node exists at the specified location
 */
export async function exists( path, options )
{
  path = sandboxPath( path, options );

  return new Promise( function( resolve /*, reject*/ )
    {
      access( path, async function(err)
        {
          if( err && err.code === 'ENOENT')
          {
            // Does not exist
            resolve(false);
            return;
          }
          else {
            // Exists
            resolve(true);
          }
        });
    } );
}

// ---------------------------------------------------------------------- Method

/**
 * Returns true if a stream is a readable stream
 *
 * @param {mixed} thing - Javascript value to check
 *
 * @returns {boolean} true if the specified thing is readable
 */
export function isReadableStream( thing )
{
  if( thing instanceof stream.Readable )
  {
    return true;
  }
  else {
    return false;
  }
}


/* --------------------------------------------------------- Helper functions */

// ---------------------------------------------------------------------- Method

/**
 * Prepare writing
 * - Processes write options
 * - Checks if writing is allowed
 *
 * @param {object} options
 *
 * @returns {object} write parameters
 *  { path, outputPath, targetPath, ... }
 */
async function _prepareWrite( path, options )
{
  const writeParams =
    Object.assign(
      {
        overwrite: false,
        autoCreateParentFolders: true,
        encoding: null,
        append: false,
        allowProjectParentFolderAccess: false
      },
      options );

  if( writeParams.append )
  {
    writeParams.overwrite = true;
    writeParams.useTmp = false;
  }

  const allowProjectParentFolderAccess =
    writeParams.allowProjectParentFolderAccess;

  // console.log("writeParams", writeParams);

  const outputPath =
    sandboxPath( path, { allowProjectParentFolderAccess } );

  await _ensureAllowWrite( outputPath, writeParams.overwrite );

  if( writeParams.autoCreateParentFolders )
  {
    let outputFolder = dirname( outputPath );

    // console.log(`Create folder [${outputFolder}]`);

    await ensureFolder( outputFolder, { allowProjectParentFolderAccess } );
  }

  writeParams.outputPath = outputPath;

  writeParams.writePath = outputPath;

  return writeParams;
}

// ---------------------------------------------------------------------- Method

async function _finalizeWrite( writeParams, writeDonePromise )
{
  const { allowProjectParentFolderAccess } = writeParams;

  try {
    const writeDoneResult = await writeDonePromise;

    if( writeDoneResult && writeDoneResult.hashSha1 )
    {
      writeParams.hashSha1 = writeDoneResult.hashSha1;

      // Replace `${hash}` in output file name

      writeParams.outputPath =
        writeParams.outputPath.replace( /\${hash}/, writeParams.hashSha1 );

      // console.log( "_finalizeWrite", writeParams );
    }
  }
  catch( e )
  {
    console.log("ERROR", e);

    await tryRemoveFile(
      writeParams.outputPath, { allowProjectParentFolderAccess } );

    return null;
  }

  return writeParams;
}

// ---------------------------------------------------------------------- Method

/**
 * Throws an exception if no file can be written at the specified path
 *
 * @param {string} path
 * @param {boolean} [overwrite=false]
 *   If set to true, overwriting an existing file is permitted
 */
async function _ensureAllowWrite( path, overwrite=false )
{
  let allowProjectParentFolderAccess = true;

  if( !overwrite )
  {
    if( await exists( path, { allowProjectParentFolderAccess } ) )
    {
      throw new Error(
        `Cannot write file [${path}] (a file system node already exists)`);
    }
  }
  else if( !await isFileOrDoesNotExist(
                      path, { allowProjectParentFolderAccess } ) )
  {
    throw new Error(
      `Cannot write file [${path}] (a file node already exists that ` +
      "is not a regular file)");
  }
}

// ---------------------------------------------------------------------- Method

/**
 * Returns a promise that returns true if a file system node is a file or
 * does not exists
 *
 * @param {string} path - Path to check
 *
 * @param {object} [options] - Options
 * @param {string} [options.followSymlinks=true] - Follows symlinks
 *
 * @param {string} [options.sandboxPath=ROOT_PATH]
 *   The folder to empty should not be ouside the "sandboxPath"
 *
 * @param {boolean} [options.allowProjectParentFolderAccess=false]
 *   By setting this option, the sandbox also allows paths within the
 *   parent folder of the project
 *
 * @return {Promise<boolean>}
 *   true if a file system node is a file or does not exist
 */
export async function isFileOrDoesNotExist( path, options )
{
  expectString( path, "Missing or invalid parameter [path]");

  path = sandboxPath( path, options );

  let stats_ = await stats( path, options );

  if( !stats_ )
  {
    return true;
  }

  return stats_.isFile();
}

// ---------------------------------------------------------------------- Method

/**
 * Tries to remove a file
 * - If the file system node is not a file the method does nothing
 *
 * @param {string} path - File path to remove
 *
 * @param {object} [options] - Options
 *
 * @return {Promise<boolean>}
 *   true if a file was removed
 */
export async function tryRemoveFile( path, options )
{
  path = sandboxPath( path, options );

  return new Promise( async function( resolve /*, reject*/ )
    {
      if( await isFile( path, options ) )
      {
        try {
          await unlink( path );
          resolve( true );
        }
        catch( e )
        {
          // @note ignore errors
          // if( !err )
          // {
          //   console.log("Removed file ["+path+"]");
          // }
        }
      }
      else {
        resolve( false );
      }

    } ); // end fn Promise

}

// ---------------------------------------------------------------------- Method

/**
 * Tries to remove a symlink
 * - If the file system node is not a symlink the method does nothing
 *
 * @param {string} path - Symlink path to remove
 *
 * @param {object} [options] - Options
 *
 * @return {Promise<boolean>}
 *   true if a file was removed
 */
export async function tryRemoveSymlink( path, options )
{
  path = sandboxPath( path, options );

  return new Promise(
      /* eslint-disable no-async-promise-executor */
      async function( resolve /*, reject*/ )
    {
      if( await isSymlink( path, options ) )
      {
        try {
          await unlink( path );
          resolve( true );
        }
        catch( e )
        {
          // @note ignore errors
          // if( !err )
          // {
          //   console.log("Removed file ["+path+"]");
          // }
        }
      }
      else {
        resolve( false );
      }

    } ); // end fn Promise

}