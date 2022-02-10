
/* -------------------------------------------------------- On demand imports */

let viteModule;

/* ------------------------------------------------------------------ Imports */

import { resolveConfigPath,
         resolveSrcPath,
         resolveLibPath,
         resolveDistPath,
         stripProjectPath } from "./paths.mjs";

import { isFile } from "./fs.mjs";

/* ---------------------------------------------------------------- Internals */

const VITE_DEV_FILE_NAME = "vite.dev.mjs";
const VITE_BUILD_FILE_NAME = "vite.build.mjs";
const VITE_PREVIEW_FILE_NAME = "vite.preview.mjs";

const VITE_PUBLIC_FOLDER_PATH = "static";

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
 * Get aliases for Vite from a lib in the libs folder
 * - The lib should contain a file [build-config/vite.aliases.mjs]
 * - That file should export a function called [generateAliases], which returns
 *   an array of aliases that can be used by Vite.
 * - The function [generateAliases] receives a parameter [{resolveLibPath}],
 *   that can be used to generate the correct paths for the aliases.
 *
 * @param {string} libName - Name of the lib
 *
 * @returns {array} list of vite aliases
 */
export async function viteGetAliasesFromLib( libName )
{
  await importDependencies();

  const path = resolveLibPath( libName, "build-config", "vite.aliases.mjs" );

  if( !await isFile( path ) )
  {
    console.log(`- Missing config file [${path}].`);
    console.log();
    process.exit(1);
  }

  const module_ = await import( path );

  if( typeof module_.generateAliases !== "function" )
  {
    console.log(
      `- Config file [${path}] should export a function [generateAliases].`);
    console.log();
    process.exit(1);
  }

  /**
   * Helper function to generate paths inside the current lib
   *
   * @param {...string} pathParts
   *
   * @returns {string} path
   */
  function resolveCurrentLibPath()
  {
    return resolveLibPath( libName, ...arguments );
  }

  return await module_.generateAliases( { resolveCurrentLibPath } );
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

  if( !await isFile( configFilePath ) )
  {
    console.log(`- Missing config file [${configFilePath}].`);
    console.log();
    process.exit(1);
  }

  await importDependencies();

  const defaultExport = (await import( configFilePath )).default;

  let config;

  if( typeof defaultExport === "function" )
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

    if( !("emptyOutDir" in config.build) &&
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
      debugConfig.extensions = resolve.extensions.join(", ");
    }

    if( resolve.alias instanceof Array )
    {
      const resolveAlias = resolve.alias;

      const debugAliases = [];

      for( const current of resolveAlias )
      {
        if( typeof current === "function" )
        {
          debugAliases.push(`(custom resolver)`);
        }
        else if( current instanceof Object  )
        {
          if( current.find && current.replacement )
          {
            debugAliases.push(
              `${current.find} => ${stripProjectPath(current.replacement)}` );
          }
        }
        else if( typeof current === "string" ) {
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
  console.log( "Main configuration:" );
  console.log( debugConfig );
  console.log();

  return config;
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

  viteModule = await import("vite");
}
