
/* -------------------------------------------------------- On demand imports */

let viteModule;

/* ------------------------------------------------------------------ Imports */

import { resolveProjectPath,
         resolveConfigPath,
         resolveSrcPath,
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

  const config = (await import( configFilePath )).default;

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
      const alias = resolve.alias;

      const labels = [];

      for( const current of alias )
      {
        if( current instanceof Object && current.find )
        {
          labels.push( current.find );
        }
      }

      if( labels.length === alias.length )
      {
        debugConfig.aliases = labels.join(", ");
      }
      else {
        debugConfig.aliases = `(${alias.length})`;
      }
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
