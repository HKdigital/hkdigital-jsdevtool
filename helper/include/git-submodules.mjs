
import { resolveProjectPath,
         resolveLibPath } from "./paths.mjs";

import { isFolder } from "./fs.mjs";
import { execAsync } from "./shell.mjs";

// ---------------------------------------------------------------------- Method

/**
 * Displays the status of all git submodules in this project
 *
 * @param {string} repositoryUrl
 * @param {string} [libFolderName]
 */
export async function gitAddSubmodule( repositoryUrl, libFolderName )
{
  if( !repositoryUrl )
  {
    console.log();
    console.log("Missing [repository url]");
    console.log("(e.g. git@github.com:HKdigital/jslib--hkd-base.git)");
    console.log();

    // eslint-disable-next-line no-undef
    process.exit();
  }

  if( !libFolderName )
  {
    libFolderName = repositoryUrl.split(/[\\/]/).pop(); // basename

    if( libFolderName.endsWith(".git") )
    {
      libFolderName = libFolderName.slice( 0, -4 );
    }
  }

  const fullLibPath = resolveLibPath( libFolderName );

  if( await isFolder( fullLibPath ) )
  {
    console.log();
    console.log(`Folder [lib/${libFolderName}] already exists`);
    console.log();

    // eslint-disable-next-line no-undef
    process.exit();
  }

  console.log(
    `Adding git submodule from ${repositoryUrl} to [lib/${libFolderName}]` );

  const projectRootPath = resolveProjectPath();

  const cmd = `git submodule add ${repositoryUrl} lib/${libFolderName}`;

  const { stdout, stderr } = await execAsync( cmd, { cwd: projectRootPath } );

  console.log();

  if( stdout )
  {
    console.log( stdout );
  }

  if( stderr )
  {
    console.log( stderr );
  }
}

// ---------------------------------------------------------------------- Method

/**
 * Displays the status of all git submodules in this project
 *
 * @param {string} libFolderName
 * @param {boolean} [force=false]
 */
export async function gitRemoveSubmodule( libFolderName, force=false )
{
  if( !libFolderName )
  {
    console.log();
    console.log("Missing [lib folder name]");
    console.log();

    // eslint-disable-next-line no-undef
    process.exit();
  }

  const fullLibPath = resolveLibPath( libFolderName );

  if( !await isFolder( fullLibPath ) )
  {
    console.log();
    console.log(`Folder [lib/${libFolderName}] does not exists`);
    console.log();

    // eslint-disable-next-line no-undef
    process.exit();
  }

  let deinitForceStr = "";
  let rmForceStr = "";

  if( force )
  {
    deinitForceStr = "--force";
    rmForceStr = "-r --force";
  }

  console.log( `Removing git submodule [lib/${libFolderName}]` );

  const projectRootPath = resolveProjectPath();

  const cmd =
    `git submodule deinit ${deinitForceStr} lib/${libFolderName} && \
     git rm ${rmForceStr} lib/${libFolderName} && \
     rm -rf .git/modules/lib/${libFolderName}`;

  console.log( { cmd } );

  try {
    const { stdout, stderr } = await execAsync( cmd, { cwd: projectRootPath } );

    console.log();

    if( stdout )
    {
      console.log( stdout );
    }

    if( stderr )
    {
      console.log( stderr );
    }
  }
  catch( e )
  {
    const stderr = e.stderr;

    if( stderr.includes("-f to force removal") )
    {
      console.log();
      console.log(`The submodule [lib/${libFolderName}] may contain local changes.`);
      console.log();
      console.log("Add parameter [force] to discard all submodule changes");
      console.log();

      // eslint-disable-next-line no-undef
      process.exit();
    }
    else {
      console.log( stderr );
    }
  }
}

// ---------------------------------------------------------------------- Method

/**
 * Displays the status of all git submodules in this project
 */
export async function gitDisplaySubmodulesStatus()
{
  const projectRootPath = resolveProjectPath();

  const cmd = `git submodule foreach --recursive 'git status && echo "--"'`;

  const { stdout, stderr } = await execAsync( cmd, { cwd: projectRootPath } );

  console.log();

  if( stdout )
  {
    console.log( stdout );
  }

  if( stderr )
  {
    console.log( stderr );
  }
}

// ---------------------------------------------------------------------- Method

/**
 * Pull changes for all submodules in this project from their remote
 * repositories
 */
export async function gitSubmodulesPull()
{
  const projectRootPath = resolveProjectPath();

  const cmd = `git submodule foreach --recursive 'git pull --no-rebase && echo "--"'`;

  const { stdout, stderr } = await execAsync( cmd, { cwd: projectRootPath } );

  console.log();

  if( stdout )
  {
    console.log( stdout );
  }

  if( stderr )
  {
    console.log( stderr );
  }
}

// ---------------------------------------------------------------------- Method

/**
 * Push changes in all submodules in this project to the remote repository
 */
export async function gitSubmodulesPush()
{
  const projectRootPath = resolveProjectPath();

  const cmd = `git submodule foreach --recursive 'git push && echo "--"'`;

  const { stdout, stderr } = await execAsync( cmd, { cwd: projectRootPath } );

  console.log();

  if( stdout )
  {
    console.log( stdout );
  }

  if( stderr )
  {
    console.log( stderr );
  }
}