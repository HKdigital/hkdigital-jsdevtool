
/* ------------------------------------------------------------------ Imports */

import { resolveProjectPath,
         resolveSrcPath,
         resolveLibPath,
         stripProjectPath,
         listLibNames } from "./paths.mjs";

import { isFile } from "./fs.mjs";

import { asyncImport } from "./import.mjs";

/* ------------------------------------------------------------------ Exports */

/**
 * Get a list of default aliases in Vite format
 *
 * @returns {} [description]
 */
export async function getDefaultAliasesForVite()
{
  const entries = await getDefaultAliasEntriesForRollup();

  console.log("TODO: convert alias entries to vite format". entries);

  throw new Error("Not implemented yet");

  // return entries;
}

// -------------------------------------------------------------------- Function

/**
 * Get a list of default aliases
 * - Includes "@src" for the `src` folder
 * - Includes an alias for each lib `$<libname>`
 * - Includes an alias for each lib `$<libname>` (minus the `jslib-` part)
 *
 * @returns {object} a list of alias entries as used by rollup
 *   e.g.
 *   {
 *     @src: "...",
 *     @jslib--hkd-base": "...",
 *     @hkd-base": "...",
 *     @jslib--hkd-be": "...",
 *     @hkd-be": "...",
 *     @platform: "..."
 *   }
 */
export async function getDefaultAliasEntriesForRollup()
{
  const libEntries = await getAliasEntriesForAllLibs();
  const projectEntries = await getProjectAliasEntries();

  // -  Copy lib alias entries into entries

  const entries = { ...libEntries };

  // - Merge project alias entries into entries

  for( const key in projectEntries )
  {
    if( key in entries )
    {
      throw new Error(`Alias [${key}] has already been defined`);
    }
  } // end for

  // -- Add default alias "@src" if not set

  if( !("@src" in entries) )
  {
    entries["@src"] = resolveSrcPath();
  }

  return entries;
}

// -------------------------------------------------------------------- Function

/**
 * Get a list of aliases configured in the project's config folder
 *
 * @returns {object} alias entries
 */
export async function getProjectAliasEntries()
{
  const entries = [];

  // Add aliases from config file to `entries`
  await tryImportAliasesFromConfigFile(
    {
      libName: null, // no lib name => take aliases from project's config folder
      entries
    } );

  return entries;
}

// -------------------------------------------------------------------- Function

/**
 * Get a list of aliases for all libs
 *
 * @returns {object} alias entries
 */
export async function getAliasEntriesForAllLibs()
{
  const libNames = await listLibNames();

  const entries =
    {
      "@src": resolveSrcPath()
    };

  for( const libName of libNames )
  {
    const libPath = resolveLibPath( libName );

    entries[ "@" + libName ] = libPath;

    if( libName.startsWith("jslib-") || libName.startsWith("eslib-") )
    {
      let skip = libName.indexOf("-") + 1;

      if( "-" === libName.charAt( skip ) )
      {
        // lib name continas double dash token: e.g. jslib--hkd-base
        // -> skip extra dash
        skip = skip + 1;
      }

      const shortName = "@" + libName.slice( skip );

      if( shortName in entries )
      {
        throw new Error(`Alias [${shortName}] has already been defined`);
      }

      entries[ shortName ] = libPath;
    }

    // Add aliases from config file to `entries`
    await tryImportAliasesFromConfigFile(
      {
        libName,
        entries
      } );

  } // end for

  // console.log("entries", entries);

  return entries;
}

// -------------------------------------------------------------------- Function

/**
 * Read aliases from the specified alias config file and add them to the
 * supplied existing `entries`
 *
 * @param {string} [libName]
 *   If a lib nam ehas been specified, the the alias file in the lib's config
 *   folder will be used. Otherwise the alias file from the projects'config
 *   folder will be used.
 *
 * @param {object[]} entries
 *   List of existing entries. Newly read entries will be added to this list.
 *   In case of duplicate entries, an exception will be raised.
 */
export async function tryImportAliasesFromConfigFile(
  {
    libName,
    entries
  } )
{
  const aliasConfigPath =
    resolveLibPath( libName, "config", "aliases.mjs" );

  if( !await isFile( aliasConfigPath ) )
  {
    console.log(
      `- Optional alias config file not found at ` +
      `[${stripProjectPath(aliasConfigPath)}].`);
    return;
  }

  try {
    const module_ = await asyncImport( aliasConfigPath );

    let resolveCurrentLibPath = null;

    if( libName )
    {
      resolveCurrentLibPath = resolveLibPath.bind( null, libName );
    }

    const displayPath = stripProjectPath( aliasConfigPath );

    if( typeof module_.getAliases !== "function" )
    {
      throw new Error(
        `Alias configuration file [${displayPath}] does ` +
        `not export a function [getAliases]`);
    }

    const customAliases =
      await module_.getAliases(
        {
          resolveProjectPath,
          resolveSrcPath,
          resolveLibPath,
          resolveCurrentLibPath
        } );

    for( const key in customAliases )
    {
      if( key in entries )
      {
        throw new Error(
          `Alias [${key}] from alias configuration ` +
          `file [${displayPath}] has already been defined`);
      }

      const path = customAliases[ key ];

      if( typeof path !== "string" ||
          !path.startsWith( resolveLibPath() ) )
      {
        throw new Error(
          `Invalid value for alias [${key}] in alias configuration ` +
          `file [${displayPath}] (expected full path).`);
      }

      entries[ key ] = path;

    } // end for
  }
  catch( e )
  {
    if( e.code !== "ERR_MODULE_NOT_FOUND" )
    {
      throw e;
    }
  }
}