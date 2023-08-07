
/* ------------------------------------------------------------------ Imports */

import { expectObject,
         expectNotEmptyString } from "./expect.mjs";

import { resolveProjectPath,
         stripProjectPath } from "./paths.mjs";

import { symlink,
         tryRemoveSymlink,
         isFolder } from "./fs.mjs";

import { execAsync } from "./shell.mjs";

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

// -------------------------------------------------------------------- Function

/**
 * Load the arango configuration for the specified deployment label from
 * the config files
 *
 * @param {string} [deploymentLabel="local"]
 *
 * @returns {object} arango deployment configuration
 */
async function loadArangoDeploymentConfig( deploymentLabel )
{
  expectNotEmptyString( deploymentLabel,
    "Missing or invalid parameter [deploymentLabel]" );

  const deploymentConfig = await loadDeploymentConfig( { deploymentLabel } );

  if( !("arangodb" in deploymentConfig) )
  {
    console.log(
      `Missing section [arangodb] in deployment target ` +
      `config [${deploymentLabel}].`);

    // eslint-disable-next-line no-undef
    process.exit();
  }

  const config = deploymentConfig.arangodb;

  expectObject( config,
    `Missing or invalid deployment config ` +
    `[${deploymentLabel}.arangodb` );

  expectNotEmptyString( config.endpoint,
    `Missing or invalid deployment config ` +
    `[${deploymentLabel}.arangodb.endpoint]`);

  expectNotEmptyString( config.username,
    `Missing or invalid deployment config ` +
    `[${deploymentLabel}.arangodb.username]`);

  expectNotEmptyString( config.password,
    `Missing or invalid deployment config ` +
    `[${deploymentLabel}.arangodb.password]`);

  expectNotEmptyString( config.database,
    `Missing or invalid deployment config ` +
    `[${deploymentLabel}.arangodb.database]`);


  return config;
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
    console.log();
    console.log( "- ArangoDB is not installed locally " +
                 "(required to run arangodump and arangorestore)" );
    console.log();
    console.log("For installation instructions:");
    console.log("@see https://www.arangodb.com/docs/stable/installation.html");
    console.log();

    // eslint-disable-next-line no-undef
    process.exit();
  }
}

// -------------------------------------------------------------------- Function

/**
 * Dump the contents of the database specified by the deployment target's config
 *
 * @param {string} [deploymentLabel="local"]
 *   Name of the deployment target section.
 */
export async function arangoDump( deploymentLabel="local" )
{
  await arangoEnsureInstalled();

  expectNotEmptyString( deploymentLabel,
    "Missing or invalid parameter [deploymentLabel]" );

  console.log();

  const { endpoint,
          username,
          password,
          database } = await loadArangoDeploymentConfig( deploymentLabel );

  const dateTimeStamp = generateFolderDateTimeStamp();

  const destFolder =
    resolveProjectPath(
      DATABASE_ROOT_FOLDER,
      "dumps",
      DATABASE_KIND_PREFIX + deploymentLabel,
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

    // Create of update link `latest`

    const latestSymlinkPath =
      resolveProjectPath(
        DATABASE_ROOT_FOLDER,
        "dumps",
        DATABASE_KIND_PREFIX + deploymentLabel,
        "latest" );

    await tryRemoveSymlink( latestSymlinkPath );

    await symlink( destFolder, latestSymlinkPath );

    console.log( `* Created symlink [${stripProjectPath(latestSymlinkPath)}]` );
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
 * Restore a specific database
 */
export async function arangoRestore(
  {
    deploymentLabel="local",
    dateTimeStamp="latest",
    customSourceFolder=null
  } )
{
  await arangoEnsureInstalled();

  expectNotEmptyString( deploymentLabel,
    "Missing or invalid parameter [deploymentLabel]" );

  if( customSourceFolder )
  {
    expectNotEmptyString( customSourceFolder,
      "Missing or invalid parameter [customSourceFolder]" );
  }
  else {
    expectNotEmptyString( dateTimeStamp,
      "Missing or invalid parameter [dateTimeStamp]" );
  }

  console.log();

  const { endpoint,
          username,
          password,
          database } = await loadArangoDeploymentConfig( deploymentLabel );

  let sourceFolder = customSourceFolder;

  if( !sourceFolder )
  {
    sourceFolder =
      resolveProjectPath(
        DATABASE_ROOT_FOLDER,
        "dumps",
        DATABASE_KIND_PREFIX + deploymentLabel,
        dateTimeStamp );
  }

  console.log();
  console.log(
    `=> Restoring database [${database}] from ` +
    `[${stripProjectPath(sourceFolder)}] on [${endpoint}] `);
  console.log();

  //
  // @see
  // https://www.arangodb.com/docs/stable/programs-arangorestore-examples.html
  //

  const cmd =
`
arangorestore \
  --server.endpoint "${endpoint}" \
  --server.username "${username}" \
  --server.password "${password}" \
  --server.authentication true \
  --server.database "${database}" \
  --input-directory "${sourceFolder}" \
  --create-collection true \
  --overwrite true \
  --log.use-json-format true`;

  try {
    if( !(await isFolder(sourceFolder) ) )
    {
      console.log(
        `Source folder [${stripProjectPath(sourceFolder)}] does not exist`);
      console.log();

      // eslint-disable-next-line no-undef
      process.exit();
    }

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
    console.log("- Failed to restore database\n");
  }
}

// -------------------------------------------------------------------- Function

/**
 * Install the default database that has been provided with the project code
 *
 * - The default database should be placed in the folder:
 *
 *   database/arango-default
 *
 */
export async function arangoRestoreDefault( { deploymentLabel="local" } )
{
  const customSourceFolder =
    resolveProjectPath(
      "database",
      "arango-default");

  await arangoRestore(
  {
    deploymentLabel,
    customSourceFolder
  } );
}

// -------------------------------------------------------------------- Function

/**
 * ? Publish a database on a remote server
 */
export async function arangoPublish()
{
  throw new Error("Not implemeted yet");
}
