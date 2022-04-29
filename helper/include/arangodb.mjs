
/* ------------------------------------------------------------------ Imports */

import { expectNotEmptyString } from "./expect.mjs";

import { resolveProjectPath,
         stripProjectPath } from "./paths.mjs";

import { execAsync } from "./shell.mjs";

// import { isFile } from "./fs.mjs";

// import { asyncImport } from "./import.mjs";

import { loadDeploymentConfig } from "./deploy.mjs";

import { generateFolderDateTimeStamp } from "./date.mjs";

/* ---------------------------------------------------------------- Internals */

/**
 * Convert JSONL text to an array of objects
 *
 * @param {string} str - Text containing JSON lines
 *
 * @returns {object[]}
 */
function jsonlToArray( str )
{
  const arr = [];

  const lines = str.split("\n");

  for( const line of lines )
  {
    if( !line.length )
    {
      continue;
    }

    const obj = JSON.parse( line );

    arr.push( obj );

  } // end for

  return arr;
}

/* ------------------------------------------------------------------ Exports */

export const DATABASE_ROOT_FOLDER = "database";
export const DATABASE_KIND_PREFIX = "arango-";

/**
 * Stop program execution if arangotools are not installed
 */
export async function arangoEnsureInstalled()
{
  const cmd = `arangodump --version-json`;

  try {
    // console.log( cmd );
    // const { stdout } =
    await execAsync( cmd );

    // console.log( "Arangodump version:", JSON.parse(stdout).version );
  }
  catch( e )
  {
    console.log( e );
    console.log( "- Arango tools are not installed locally" );
    process.exit();
  }
}

// -------------------------------------------------------------------- Function

/**
 * Dump the contents of the database specified by the deployment target's config
 *
 * @param {string} [deploymentTarget="local"]
 *   Name of the deployment target section.
 */
export async function arangoDump( deploymentTarget="local" )
{
  await arangoEnsureInstalled();

  if( !deploymentTarget || typeof deploymentTarget !== "string" )
  {
    throw new Error("Missing or invalid parameter [deploymentTarget]");
  }

  console.log();

  const deploymentConfig = await loadDeploymentConfig();

  if( !(deploymentTarget in deploymentConfig) )
  {
    console.log(
      `Missing deployment target [${deploymentTarget}] in ` +
      `deployment config files.`);
    process.exit();
  }

  const targetConfig = deploymentConfig[ deploymentTarget ];


  if( !("arangodb" in targetConfig) )
  {
    console.log(
      `Missing section [arangodb] in deployment target ` +
      `config [${deploymentTarget}].`);
    process.exit();
  }

  const arangoDbConfig = targetConfig.arangodb;

  const { endpoint,
          username,
          password,
          database } = arangoDbConfig;

  expectNotEmptyString( endpoint,
    `Missing or invalid deployment config ` +
    `[${deploymentTarget}.arangodb.endpoint]`);

  expectNotEmptyString( username,
    `Missing or invalid deployment config ` +
    `[${deploymentTarget}.arangodb.username]`);

  expectNotEmptyString( password,
    `Missing or invalid deployment config ` +
    `[${deploymentTarget}.arangodb.password]`);

  expectNotEmptyString( database,
    `Missing or invalid deployment config ` +
    `[${deploymentTarget}.arangodb.database]`);

  const dateTimeStamp = generateFolderDateTimeStamp();

  const destFolder =
    resolveProjectPath(
      DATABASE_ROOT_FOLDER,
      DATABASE_KIND_PREFIX + deploymentTarget,
      "dump",
      dateTimeStamp );

  console.log();
  console.log(
    `=> Dumping database [${database}] from [${endpoint}] ` +
    `to [${stripProjectPath(destFolder)}]`);
  console.log();

  const cmd =
`
arangodump \
  --server.endpoint "${endpoint}" \
  --server.username "${username}" \
  --server.password "${password}" \
  --server.authentication true \
  --server.database "${database}" \
  --output-directory "${destFolder}" \
  --log.use-json-format true`;
//   // > /dev/null 2>&1`;

  try {
    await execAsync( `mkdir -p ${destFolder}` );

    // console.log();
    // console.log( cmd );
    // console.log();

    const { stdout } = await execAsync( cmd );

    const arr = jsonlToArray( stdout );

    for( const obj of arr )
    {
      if( "message" in obj )
      {
        console.log( `* ${obj.message}` );
      }
    } // end for

    console.log();
  }
  catch( e )
  {
    if( e.stdout )
    {
      const arr = jsonlToArray( e.stdout );

      for( const obj of arr )
      {
        if( "message" in obj && obj.level === "ERROR" )
        {
          console.log();
          console.error( `ERROR: ${obj.message}` );
        }
        // console.log( obj );
      } // end for
    }
    else {
      console.log( e );
    }

    console.log();
    console.log("- Failed to dump database\n");
  }

}


// -------------------------------------------------------------------- Function

/**
 * Install the default database that has been provided with the project code
 * - Database location: `database/arango-local/default`
 */
export async function arangoInstallDefault()
{
  throw new Error("Not implemeted yet");
}

// -------------------------------------------------------------------- Function

/**
 * Restore the latest dumped database
 */
export async function arangoRestoreLatest()
{
  throw new Error("Not implemeted yet");
}

// -------------------------------------------------------------------- Function

/**
 * Restore a specific database
 */
export async function arangoRestore()
{
  throw new Error("Not implemeted yet");
}

// -------------------------------------------------------------------- Function

/**
 * ? Publish a database on a remote server
 */
export async function arangoPublish()
{
  throw new Error("Not implemeted yet");
}
