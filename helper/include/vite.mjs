
/* -------------------------------------------------------- On demand imports */

let viteModule;

/* ------------------------------------------------------------------ Imports */

import { resolveConfigPath,
         resolveSrcPath,
         resolveLibPath,
         resolveDistPath,
         stripProjectPath,
         listLibNames } from './paths.mjs';

import { getDefaultAliasesForVite } from './aliases.mjs';

import { isFile } from './fs.mjs';

import { asyncImport } from './import.mjs';

/* ---------------------------------------------------------------- Internals */

const VITE_DEV_FILE_NAME = 'vite.dev.mjs';
const VITE_BUILD_FILE_NAME = 'vite.build.mjs';
const VITE_PREVIEW_FILE_NAME = 'vite.preview.mjs';

const VITE_PUBLIC_FOLDER_PATH = 'static';

/* ---------------------------------------------------------------- Functions */

/**
 * Watch for source code changes, auto build and run the project in
 * development mode
 *
 * @see configuration in config folder
 */
export async function viteRunInDevelopmentMode()
{
  await importDependencies();

  const config = await readViteConfig( VITE_DEV_FILE_NAME );

  const server =
    await viteModule.createServer( config );

  await server.listen();

  server.printUrls();
}

// -------------------------------------------------------------------- Function

/**
 * Build a distribution version from the source
 *
 * @see configuration in config folder
 */
export async function viteBuildDist()
{
  await importDependencies();

  const config = await readViteConfig( VITE_BUILD_FILE_NAME );

  await viteModule.build( config );
}

// -------------------------------------------------------------------- Function

/**
 * Preview a distribution version from the dist folder
 *
 * @see configuration in config folder
 */
export async function vitePreviewProjectFromDist()
{
  await importDependencies();

  const config = await readViteConfig( VITE_PREVIEW_FILE_NAME );

  await viteModule.preview( config );
}

// -------------------------------------------------------------------- Function

/**
 * Get aliases for Vite from all libs in the libs folder
 * - @see viteGetAliasesFromLib for more info
 *
 * @returns {array} list of vite aliases
 */
export async function viteGetAliasesFromAllLibs()
{
  const libNames = await listLibNames();

  const allAliases = [];

  for( const libName of libNames )
  {
    const entries = await viteGetAliasesFromLib( libName, false );

    for( const entry of entries )
    {
      allAliases.push( entry );
    }

  }

  return allAliases;
}

// -------------------------------------------------------------------- Function

/**
 * Get aliases for Vite from a lib in the libs folder
 * - The lib should contain a file [build-config/vite.aliases.mjs]
 * - That file should export a function called [generateAliases], which returns
 *   an array of aliases that can be used by Vite.
 * - The function [generateAliases] receives a parameter [{resolveLibPath}],
 *   that can be used to generate the correct paths for the aliases.
 *
 * @param {string} libName - Name of the lib
 * @param {boolean} [failOnMissing=true]
 *
 * @returns {array} list of vite aliases
 */
export async function viteGetAliasesFromLib( libName )
{
  await importDependencies();

  try {
      const aliasConfigPath =
        resolveLibPath( libName, 'config', 'aliases.mjs' );

      if( !await isFile( aliasConfigPath ) )
      {
        console.log(
          '- Optional alias config file not found at ' +
          `[${stripProjectPath(aliasConfigPath)}].`);

        return [];
      }

      const module_ = await asyncImport( aliasConfigPath );

      const resolveCurrentLibPath = resolveLibPath.bind( null, libName );

      const displayPath = stripProjectPath( aliasConfigPath );

      if( typeof module_.getCustomAliases !== 'function' )
      {
        throw new Error(
          `Alias configuration file [${displayPath}] does ` +
          'not export a function [getCustomAliases]');
      }

      const viteEntries = [];

      const customAliases =
        await module_.getCustomAliases( { resolveCurrentLibPath } );

      for( const key in customAliases )
      {
        const path = customAliases[ key ];

        if( typeof path !== 'string' ||
            !path.startsWith( resolveLibPath() ) )
        {
          throw new Error(
            `Invalid value for alias [${key}] in alias configuration ` +
            `file [${displayPath}] (expected full path).`);
        }

        viteEntries.push(
          {
            find: key,
            replacement: path
          } );

      } // end for
    }
    catch( e )
    {
      if( e.code !== 'ERR_MODULE_NOT_FOUND' )
      {
        throw e;
      }
    }
}

/* ---------------------------------------------------------------- Internals */

/**
 * Read and process a vite config file
 * - Auto completes `config.root`
 * - Auto completes `config.publicDir`
 * - Auto completes `config.build.outDir`
 *
 * @param {string} configFileName - Name of a file in the config folder
 *
 * @returns {object} vite config
 */
async function readViteConfig( configFileName )
{
  const configFilePath = resolveConfigPath( configFileName );
  const configFileURI = resolveConfigPath( configFileName, { returnURI: true } );

  // console.log( { configFilePath } );

  if( !await isFile( configFilePath ) )
  {
    console.log(`- Missing config file [${configFilePath}].`);
    console.log();

     
    process.exit(1);
  }

  await importDependencies();

  // configFilePath = new URL( configFilePath );

  const defaultExport = (await import( configFileURI )).default;

  let config;

  if( typeof defaultExport === 'function' )
  {
    config = await defaultExport();
  }
  else {
    config = defaultExport;
  }

  // -- Auto complete config

  if( !config.root )
  {
    config.root = resolveSrcPath();
  }

  if( !config.publicDir )
  {
    config.publicDir = resolveSrcPath( VITE_PUBLIC_FOLDER_PATH );
  }

  if( config.build )
  {
    if( !config.build.outDir )
    {
      config.build.outDir = resolveDistPath();
    }

    if( !('emptyOutDir' in config.build) &&
         config.build.outDir.startsWith( resolveDistPath() ) )
    {
      /* needed because outDir is outside project root */
      config.build.emptyOutDir = true;
    }
  }

  // -- Debug: show main config properties

  const debugConfig = {};

  if( config.server || config.preview )
  {
    const server = config.server || config.preview;

    if( server.host )
    {
      debugConfig.host = server.host;
    }

    if( server.port )
    {
      debugConfig.port = server.port;
    }
  }

  if( config.resolve )
  {
    const resolve = config.resolve;

    if( resolve.extensions instanceof Array )
    {
      debugConfig.extensions = resolve.extensions.join(', ');
    }

    if( resolve.alias instanceof Array )
    {
      const resolveAlias = resolve.alias;

      const debugAliases = [];

      for( const current of resolveAlias )
      {
        if( typeof current === 'function' )
        {
          debugAliases.push('(custom resolver)');
        }
        else if( current instanceof Object  )
        {
          if( current.find && current.replacement )
          {
            debugAliases.push(
              `${current.find} => ${stripProjectPath(current.replacement)}` );
          }
        }
        else if( typeof current === 'string' ) {
          debugAliases.push( `${stripProjectPath(current)}` );
        }
        else {
          debugAliases.push(`unknown alias type (${typeof current})`);
        }
      } // end for

      debugConfig.aliases = debugAliases;
    }
  }

  if( config.root )
  {
    debugConfig.sourceFolder = stripProjectPath( config.root );
  }

  if( config.publicDir )
  {
    debugConfig.staticFiles = stripProjectPath( config.publicDir );
  }

  if( config.build  )
  {
    const build = config.build;

    if( build.outDir )
    {
      debugConfig.distFolder = stripProjectPath( build.outDir );
    }
  }

  // console.log("Full config", config);

  console.log();
  console.log( 'Main configuration:' );
  console.log( debugConfig );
  console.log();

  return config;
}

// -------------------------------------------------------------------- Function

/**
 * Generate config section `resolve`
 *
 * @see https://vitejs.dev/config/
 *
 * @returns {object} config section
 */
export async function generateDefaultResolveConfig()
{
  const configResolve = {

    extensions: [
      '.mjs', '.js',
      // '.ts', '.jsx', '.tsx',
      '.json',
      '.css', '.scss'
    ],

    alias: [ ...await getDefaultAliasesForVite() ]
  };

  // console.log( "configResolve", configResolve );

  return configResolve;
}

// -------------------------------------------------------------------- Function

/**
 * Dynamically import dependencies
 */
async function importDependencies()
{
  if( viteModule )
  {
    return;
  }

  viteModule = await import('vite');
}
