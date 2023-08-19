
/* ------------------------------------------------------------------ Imports */

import { isAbsolute } from "path";

import { expectString, expectObject } from "./expect.mjs";

import {
  resolveProjectPath,
  joinPaths,
  sandboxPath } from "./paths.mjs";

import {
  isFolder,
  ensureFolder,
  copyFile } from "./fs.mjs";

const ROOT_PATH = resolveProjectPath();

/* ---------------------------------------------------------- Dynamic imports */

let expand_glob;

/**
 * Dynamically import dependencies
 */
async function importDependencies()
{
  if( !expand_glob )
  {
    const { globSync } = await import( "glob" );

    expand_glob = globSync;
  }
}

/* ------------------------------------------------------------------ Exports */

/**
 * Expand glob of array of globs to paths of existing nodes in the
 * file system.
 *
 * @note to get a sorted list of paths, apply paths.sort() to the output array
 *
 * @param {string|string[]} globOrGlobs - Glob or list of globs
 *
 * @param {object} [options] - Options
 *
 * @param {string} [options.rootPath=ROOT_PATH]
 *   RootPath to prefix to the paths are relative
 *
 * @param {function} [options.filter]
 *   Function that returns true if the path should be included in the
 *   list of results
 *   DEPRECEATED? may return an updated path name???
 *
 * @param {string} [options.sandboxPath=ROOT_PATH]
 *   The folder to empty should not be ouside the "sandboxPath"
 *
 * @param {boolean} [options.allowProjectParentFolderAccess=false]
 *   By setting this option, the sandbox also allows paths within the
 *   parent folder of the project
 *
 * @returns {string[]} list of paths
 */
export async function expandGlobs( globOrGlobs, options )
{
  await importDependencies();

  // >> CASE 1: list of globs

  if( Array.isArray( globOrGlobs ) )
  {
    const combinedSet = new Set();

    for( let j = 0, n = globOrGlobs.length; j < n; j = j + 1 )
    {
      const glob = globOrGlobs[j];

      const list = await expandGlobs( glob, options );

      for( let k = 0, m = list.length; k < m; k = k + 1 )
      {
        combinedSet.add( list[k] );
      }
    }

    return Array.from( combinedSet.values() );
  }

  // >> CASE 2: single glob

  let glob = globOrGlobs;

  expectString( glob,
    "Missing or invalid parameter [globOrGlobs] " +
    "(expected string or string[])" );

  let filter = options ? options.filter : null;

  let rootPath = options ? options.rootPath : ROOT_PATH;

  if( !isAbsolute( glob ) )
  {
    glob = joinPaths( rootPath, glob );
  }

  const files = await expand_glob( glob );

  if( !filter )
  {
    for( let j = 0, n = files.length; j < n; j = j + 1 )
    {
      let path = files[j];

      files[ j ] = sandboxPath( path, options );
    }

    return files;
  }

  const filteredFiles = [];

  try {
    for( let j = 0, n = files.length; j < n; j = j + 1 )
    {
      let path = sandboxPath( files[j], options );

      const stats = await stats( path, options );

      if( !stats )
      {
        // file system node has been removed while processing files
        continue;
      }

      let updatedPath = await filter( path );

      if( !updatedPath )
      {
        // Ignore file
        continue;
      }

      if( updatedPath === true )
      {
        // true -> use unchanged path
        updatedPath = path;
      }
      else if( updatedPath !== path )
      {
        // console.log( { updatedPath } );
        // path has been changed by filter -> check
        path = sandboxPath( updatedPath, options );
      }

      if( path )
      {
        filteredFiles.push( path );
      }

    } // end for
  }
  catch( e )
  {
    console.log( "Failed to filter paths");
    throw e;
  }

  return filteredFiles;
}

// ---------------------------------------------------------------------- Method

/**
 * Copy files specified by the glob pattern
 *
 * @param {object} params - Params
 * @param {string|string[]} params.sourceGlob
 *   Source glob path (e.g. 'foo/*.js') of list of source glob paths
 *
 * @param {string} [params.sourceBasePath=ROOT_PATH]
 *   Base path of all the source files
 *
 * @param {string} params.targetFolder - Folder to copy the files into
 *
 * @param {object} [options] - Options
 * @param {string} [options.overwrite=false] - Overwrite existing files
 *
 * @returns {string[]} list of files that matched the glob pattern
 */
export async function copyUsingGlobs( params, options )
{
  expectObject( params,
    "Missing or invalid parameter [params]" );

  const sourceGlob = params.sourceGlob;

  let targetFolder = params.targetFolder;

  // >> CASE A: sourceGlob is an array of globs

  if( Array.isArray( sourceGlob ) )
  {
    const _params = Object.assign( {}, params );

    const results = [];

    for( let j = 0, n = sourceGlob.length; j < n; j = j + 1 )
    {
      _params.sourceGlob = sourceGlob[j];

      let result = await copyUsingGlobs( _params, options );
      results.push( result );
    }

    // Return concatenated results
    // @note concat accept array of arrays with values
    return Array.prototype.concat.apply([], results);
  }

  // >> CASE B: single glob

  expectString( sourceGlob,
    "Missing or invalid parameter [params.sourceGlob] " +
    "(expected string)" );

  let sourceBasePath;

  if( params.sourceBasePath )
  {
    sourceBasePath = sandboxPath( params.sourceBasePath );
  }
  else {
    sourceBasePath = ROOT_PATH;
  }

  expectString( sourceBasePath,
    "Missing or invalid parameter [params.sourceBasePath] " +
    "(expected string)" );

  expectString( targetFolder,
    "Missing or invalid parameter [params.targetFolder] " +
    "(expected string)" );

  options =
    Object.assign(
      {
        overwrite: false
      },
      options );

  targetFolder = sandboxPath( targetFolder, { allowRoot: true } );

  return new Promise( async function( resolve /*, reject*/ )
    {
      let files = await expandGlobs( sourceGlob );
      let allTargetPaths = [];

      // console.log("COPY USING GLOB FILES", files);

      let x = sourceBasePath.length;

      for( let j = 0, n = files.length; j < n; j = j + 1 )
      {
        let sourcePath = files[j];
        let targetPath = targetFolder + sourcePath.slice( x );

        // console.log( { sourceBasePath, sourcePath } );

        if( await isFolder( sourcePath ) )
        {
          await ensureFolder( targetPath );
        }
        else {
          await copyFile( sourcePath, targetPath, options );
        }

        allTargetPaths.push( targetPath );
      }

      resolve( allTargetPaths );
    } );
}
