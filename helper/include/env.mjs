
import { resolveConfigPath } from "./paths.mjs";
import { isFile } from "./fs.mjs";

import { asyncImport } from "./import.mjs";

// -------------------------------------------------------------------- Function

/**
 * Set environment variables defined in `env.default.js` and `env.local`
 */
export async function setEnvVarsFromConfigFiles( silent=false )
{
  let defaultEnvVars = {};
  let localEnvVars = {};

  const defaultEnvVarsPath = resolveConfigPath("env.default.js");
  const localEnvVarsPath = resolveConfigPath("env.local.js");

  if( await isFile( defaultEnvVarsPath ) )
  {
    const module_ = await asyncImport( defaultEnvVarsPath );

    if( !(module_.default instanceof Object) )
    {
      console.log(`- Invalid config file [${defaultEnvVarsPath}]`);
      console.log(`  (should export settings via [default])`);
      console.log();
      process.exit(1);
    }

    defaultEnvVars = module_.default;

    ensureEnvVarsAreStrings(
      {
        vars: defaultEnvVars,
        debugPath: defaultEnvVarsPath }  );
  }
  else if( !silent ) {
    console.log( `- Missing config file [${defaultEnvVarsPath}]`);
  }

  if( await isFile( localEnvVarsPath ) )
  {
    const module_ = await asyncImport( localEnvVarsPath );

    if( !(module_.default instanceof Object) )
    {
      console.log(`- Invalid config file [${localEnvVarsPath}]`);
      console.log(`  (should export settings via [default])`);
      console.log();
      process.exit(1);
    }

    localEnvVars = module_.default;

    ensureEnvVarsAreStrings(
      {
        vars: localEnvVars,
        debugPath: localEnvVarsPath }  );
  }
  else if( !silent ) {
    console.log();
    console.log(`- Missing (optional) config file [${localEnvVarsPath}`);
    console.log();
  }

  // Merge default and local environment variables into process.env

  const mergedEnvVars = {};

  Object.assign( mergedEnvVars, defaultEnvVars, localEnvVars );

  Object.assign( process.env, mergedEnvVars );

  if( !silent && Object.keys(mergedEnvVars).length > 0 )
  {
    // console.log( "* Set environment variables:", mergedEnvVars );
    console.log( "* Set environment variables from [config] folder" );
  }
}

// -------------------------------------------------------------------- Function

/**
 * If one of the environment variables is not a string, a console message
 * will be generated and the process will exit.
 *
 * @param {object} options.vars - Variables
 * @param {string} options.debugPath - Path of the config file
 */
function ensureEnvVarsAreStrings( { vars, debugPath } )
{
  try {
    if( !(vars instanceof Object) )
    {
      throw new Error("Expected object [vars]");
    }

    for( const key in vars )
    {
      const value = vars[ key ];

      if( typeof value !== "string" )
      {
        throw new Error(`The value of variable [${key}] should be a string`);
      }
    } // end for
  }
  catch( e )
  {
    console.log(`Invalid config file [${debugPath}]`);
    console.log(e);
    console.log();
    process.exit(1);
  }
}
