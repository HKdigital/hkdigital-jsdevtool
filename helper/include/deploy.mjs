
/* ------------------------------------------------------------------ Imports */

import { resolveProjectPath,
         resolveSrcPath,
         resolveLibPath,
         stripProjectPath,
         resolveConfigPath } from "./paths.mjs";

import { isFile } from "./fs.mjs";

import { asyncImport } from "./import.mjs";

// -------------------------------------------------------------------- Function

/**
 * Read deployment config files from the project's config folder
 *
 * - Reads variables from project config files `deploy.default.js` and
 *   `deploy.local.js`
 * - Variables defined in `deploy.local.js` override variables in
 *   `deploy.default.js`
 *
 * @returns {object} deployment config
 */
export async function loadDeploymentConfig( silent=false )
{
let defaultDeploymentVars = {};
  let localDeploymentVars = {};

  const defaultDeploymentVarsPath =
    resolveConfigPath("deploy.default.js");

  const localDeploymentVarsPath =
    resolveConfigPath("deploy.local.js");

  if( await isFile( defaultDeploymentVarsPath ) )
  {
    const module_ = await asyncImport( defaultDeploymentVarsPath );

    if( !(module_.default instanceof Object) )
    {
      console.log(`- Invalid config file [${defaultDeploymentVarsPath}]`);
      console.log(`  (should export settings via [default])`);
      console.log();
      process.exit(1);
    }

    defaultDeploymentVars = module_.default;

    if( !silent )
    {
      console.log( `* Loaded deployment variables from ` +
                   `[${stripProjectPath(defaultDeploymentVarsPath)}]` );
    }
  }
  else if( !silent ) {
    console.log( `- Missing config file [${defaultDeploymentVarsPath}]`);
  }

  if( await isFile( localDeploymentVarsPath ) )
  {
    const module_ = await asyncImport( localDeploymentVarsPath );

    if( !(module_.default instanceof Object) )
    {
      console.log(`- Invalid config file [${localDeploymentVarsPath}]`);
      console.log(`  (should export settings via [default])`);
      console.log();
      process.exit(1);
    }

    localDeploymentVars = module_.default;

    if( !silent )
    {
      console.log( `* Loaded deployment variables from ` +
                   `[${stripProjectPath(localDeploymentVarsPath)}]` );
    }
  }
  else if( !silent ) {
    console.log();
    console.log(`- Missing (optional) config file [${localDeploymentVarsPath}`);
    console.log();
  }

  // Merge default and local environment variables into process.env

  const mergedDeploymentVars = {};

  Object.assign( mergedDeploymentVars, defaultDeploymentVars, localDeploymentVars );

  // Object.assign( process.env, mergedDeploymentVars );

  return mergedDeploymentVars;
}
