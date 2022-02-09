
// ----------------------------------------------------------- On demand imports

let rollup;
let watch;

let run;
let sourcemaps;

// --------------------------------------------------------------------- Imports

import { resolveProjectPath,
         resolveConfigPath,
         resolveSrcPath,
         resolveDistPath } from "./paths.mjs";

import { isFile, readJSONFile } from "./fs.mjs";

import { setEnvVarsFromConfigFiles } from "./env.mjs";

import { mergePackageJsons } from "./npm.mjs";

// -------------------------------------------------------------------- Function

/**
 * Watch source code, build and run project in development mode
 */
export async function rollupRunInDevelopmentMode()
{
  await importDependencies();

  await checkPackageJsonExists();

  // ---------------------------------------------------------------------------
  // Set environment variables

  await setEnvVarsFromConfigFiles();

  // ---------------------------------------------------------------------------
  // Run rollup in watch mode

  const config =
    await readConfig(
      {
        fileName: "rollup.dev.mjs",
        production: false
      } );

  const watchOptions =
    {
      ...config,

      watch: {
        buildDelay: 0,
        // chokidar
        clearScreen: true,

        skipWrite: false, // write to disk required for plugin-run!

        exclude: ['node_modules/**', 'hkdigital-devtool/**']
      }
    };

  // console.log("DEBUG: watchOptions", watchOptions);

  const watcher = watch( watchOptions );

  let startedAt = 0;

  // This will make sure that bundles are properly closed after each run
  watcher.on('event', async ( { code, result, error } ) =>
    {
      //console.log( { code } );

      switch( code )
      {
        case "START":
          console.log();
          if( startedAt )
          {
            console.log("* Rollup: source changed -> rebundle");
          }
          startedAt = Date.now();
          break;

        // case "BUNDLE_START":
        //   console.log("Rollup: bundle start");

        //   break;

        // case "BUNDLE_END":
        //   console.log("Rollup: bundle ready");
        //   break;

        case "ERROR":
          console.log( error );
          console.log();
          break;

        case "END":
          console.log(`* Rollup: bundled in [${Date.now() - startedAt}] ms`);
          console.log();

          // restartGeneratedOutputProgram();
          break;
      }

      if( result )
      {
        result.close();
      }
    } );
}

// -------------------------------------------------------------------- Function

/**
 * Build source code and write output to the `dist` folder
 */
export async function rollupBuildDist()
{
  await importDependencies();

  const startedAt = Date.now();

  await checkPackageJsonExists();

  const config =
    await readConfig(
      {
        fileName: "rollup.build.mjs",
        production: true
      } );

  // console.log("DEBUG: rollup config", config);

  let bundle;
  let buildFailed = false;

  try {
    bundle = await rollup( config );

    await bundle.write( config.output );
  }
  catch( e )
  {
    // buildFailed = true;
    console.error( e );
  }
  if( bundle )
  {
    // closes the bundle
    await bundle.close();
  }

  if( buildFailed )
  {
    console.error("* Rollup: build failed!");
    console.log();
    process.exit( 1 );
  }

  const { updated } =
    await mergePackageJsons(
      {
        outputPath: resolveDistPath("package.json"),
        silent: true
      } );

  if( updated )
  {
    console.error("* Rollup: created package.json");
  }

  console.error(`* Rollup: build done [${Date.now() - startedAt}] ms`);
  console.log();
}

// -------------------------------------------------------------------- Function

/**
 * Execute the distribution output file (index.mjs) in the dist folder
 */
export async function rollupPreviewProjectFromDist()
{
  // const distPackageJsonPath = resolveDistPath("package.json");
  // await checkPackageJsonExists( distPackageJsonPath );

  await setEnvVarsFromConfigFiles();

  const distIndexJsPath = resolveDistPath("index.mjs");

  if( !await isFile( distIndexJsPath ) )
  {
    // Missing index file -> build first
    // await rollupBuildDist();
    console.log(`- Missing [${distIndexJsPath}]. Build project first.`);
    console.log();
    process.exit(1);
  }

  console.log();

  await import( distIndexJsPath );
}

// -------------------------------------------------------------------- Function

/**
 * Create a banner with information from the `package.json` file in the
 * project's root folder.
 * - Uses pkg.name, pkg.version, pkg.author from package.json
 *
 */
export async function createBannerFromPackageJson( )
{
  const pkg = await readJSONFile( resolveProjectPath("package.json") );

  if( !(pkg instanceof Object) )
  {
    throw new Error("Missing [pkg]");
  }

  if( typeof pkg.name !== "string" )
  {
    throw new Error("Missing or invalid [pkg.name]");
  }

  if( typeof pkg.version !== "string" )
  {
    throw new Error("Missing or invalid [pkg.version]");
  }

  if( typeof pkg.author !== "string" )
  {
    throw new Error("Missing or invalid [pkg.author]");
  }

  return `/**\n`+
        ` * ${pkg.name} (${pkg.version})\n` +
        ` * Date: ${(new Date()).toISOString()}\n` +
        ` * Author: ${pkg.author}\n` +
        ` * License: see LICENSE.txt\n` +
        ` */\n\n`;
}

// -------------------------------------------------------------------- Function

/**
 * Code to be added to banner of the generated code
 *
 * @returns {string} code
 */
export function onBootstrapReadyBannerCode()
{
  return `const onBootstrapReadyFns = [];\n\n` +
         `function onBootstrapReady( fn ) {\n` +
         `  onBootstrapReadyFns.push( fn );\n` +
         `}\n\n`;
}

// -------------------------------------------------------------------- Function

/**
 * Code to be added to footer of the generated code
 *
 * @returns {string} code
 */
export function onBootstrapReadyFooterCode()
{
  return `\nfor( const fn of onBootstrapReadyFns ) { fn(); }\n\n`;
}

// -------------------------------------------------------------------- Function

/**
 * Read rollup config file that should be used for development mode
 */
async function readConfig( { fileName, production=false })
{
  const configPath = resolveConfigPath( fileName );

  if( !await isFile( configPath ) )
  {
    const message = `Missing [${configPath}].`;
    console.log( message );
    console.log();
    process.exit(1);
  }

  const module_ = await import( configPath );

  if( typeof module_.createConfig !== "function" )
  {
    console.log(`- Invalid config file [${configPath}].`);
    console.log(`  Missing or invalid export: (async) function createConfig.`);
    console.log();
    process.exit(1);
  }

  const config = await module_.createConfig();

  try {
    await normalizeConfig( config, { production } );
  }
  catch( e )
  {
    console.log(`- Invalid config file [${configPath}].`);
    console.log( e );
    console.log();
    process.exit(1);
  }

  // console.log( "config", config );

  return config;
}

// -------------------------------------------------------------------- Function

/**
 * Check and auto complete rollup config settings
 *
 * @param {object} config
 *
 * @returns {object} updated config
 */
async function normalizeConfig( config, { production=false } )
{
  if( !config.input )
  {
    config.input = resolveSrcPath( 'index.js' );
  }

  if( !config.output )
  {
    config.output = {};
  }
  else if( !(config.output instanceof Object) )
  {
    throw new Error("Invalid config. [config.output] should be an object");
  }

  const output = config.output;

  if( !config.plugins )
  {
    config.plugins = [];
  }
  else if( !Array.isArray( config.plugins ) )
  {
    throw new Error("Invalid config. [config.plugins] should be an array");
  }

  const plugins = config.plugins;

  if( !("format" in output) )
  {
    output.format = "es";
  }

  if( production )
  {
    // production

    if( !("banner" in output) )
    {
      config.banner = await createBannerFromPackageJson();
    }

    if( !("file" in output) )
    {
      output.file = "dist/index.mjs";
    }
  }
  else {
    // dev

    if( !("file" in output) )
    {
      output.file = "generated/index.mjs";
    }


    plugins.push( sourcemaps() );
    output.sourcemap = true;

    plugins.push( run(
      {
        execArgv: ['--enable-source-maps']
      } ) );
  }

  return config;
}

// -------------------------------------------------------------------- Function

/**
 * Show a message and exit if no `package.json` was found in the project's
 * root folder
 */
async function checkPackageJsonExists()
{
  const packageJsonPath = resolveProjectPath("package.json");

  if( !await isFile( packageJsonPath ) )
  {
    const message =
    `
    Missing [package.json].

    Setup your project first by running:

    ./hkdigital-devtool/setup-nodejs-backend.mjs
    `;
    console.log( message );
    process.exit(1);
  }
}

// ------------------------------------------------------------------- Internals

/**
 * Dynamically import dependencies
 */
async function importDependencies()
{
  if( rollup )
  {
    return;
  }

  const rollupModule = await import("rollup");

  rollup = rollupModule.rollup;
  watch = rollupModule.watch;

  run = (await import( "@rollup/plugin-run" )).default;
  sourcemaps = (await import("rollup-plugin-sourcemaps")).default;
}