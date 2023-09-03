#!/usr/bin/env node

import { existsSync } from "fs";

/* ----------------------------------------------------------------- Exports  */

export const PROJECT_TYPE = "nodejs-backend";

/* ---------------------------------------------------------- Dynamic imports */

let rollupRunInDevelopmentMode;
let rollupBuildDist;
let rollupPreviewProjectFromDist;

let updateDeps;
let updateDevtool;

let gitAddSubmodule;
let gitRemoveSubmodule;

let gitDisplaySubmodulesStatus;
let gitSubmodulesPull;
let gitSubmodulesPush;

let arangoDump;
let arangoRestore;
let arangoRestoreDefault;

/**
 * Dynamically import dependencies
 */
async function importDependencies()
{
  const helperPath = "./hkdigital-jsdevtool/helper/index.mjs";

  if( !existsSync( helperPath ) )
  {
    showInstallHowtoAndExit();
  }

  const helperModule = await import( helperPath );

  rollupRunInDevelopmentMode = helperModule.rollupRunInDevelopmentMode;
  rollupBuildDist = helperModule.rollupBuildDist;
  rollupPreviewProjectFromDist = helperModule.rollupPreviewProjectFromDist;

  updateDeps = helperModule.updateDeps;
  updateDevtool = helperModule.updateDevtool;

  gitAddSubmodule = helperModule.gitAddSubmodule;
  gitRemoveSubmodule = helperModule.gitRemoveSubmodule;

  gitDisplaySubmodulesStatus = helperModule.gitDisplaySubmodulesStatus;
  gitSubmodulesPull = helperModule.gitSubmodulesPull;
  gitSubmodulesPush = helperModule.gitSubmodulesPush;

  arangoDump = helperModule.arangoDump;
  arangoRestore = helperModule.arangoRestore;
  arangoRestoreDefault = helperModule.arangoRestoreDefault;

}

/* --------------------------------------------------------------------- Main */

async function main()
{
  await importDependencies();

  const argv = process.argv.slice(2); // remove 'node' and 'devtool.js'

  // console.log("devtool-new", argv);

  if( !argv.length )
  {
    showUsageAndExit();
  }

  switch( argv[0] )
  {
    /* Development */

    case "run":
      /* async */ rollupRunInDevelopmentMode();
      break;

    case "build":
      /* async */ rollupBuildDist();
      break;

    case "preview":
      /* async */ rollupPreviewProjectFromDist();
      break;

    case "update-deps":
      /* async */ updateDeps();
      break;

    /* Lib */

    case "lib-add":
      {
        const repositoryUrl = argv[1];
        const libFolderName = argv[2];

        /* async */ gitAddSubmodule( repositoryUrl, libFolderName );
      }
      break;

    case "lib-remove":
      {
        const libFolderName = argv[1];
        const force = argv[2] === "force";

        /* async */ gitRemoveSubmodule( libFolderName, force );
      }
      break;

    /* Submodules */

    case "submodules-status":
      /* async */ gitDisplaySubmodulesStatus();
      break;

    case "submodules-pull":
      /* async */ gitSubmodulesPull();
      break;

    case "submodules-push":
      /* async */ gitSubmodulesPush();
      break;

    case "update-devtool":
      /* async */ updateDevtool( { installFilesFolderName: PROJECT_TYPE } );
      break;

    /* ArangoDB */

    case "arango-dump":
      {
        let deploymentLabel = argv[1];

        /* async */ arangoDump( deploymentLabel );
      }
      break;

    case "arango-restore":
      {
        let deploymentLabel = argv[1];
        let dateTimeStamp = argv[2];

        const params = { deploymentLabel };

        if( dateTimeStamp )
        {
          params.dateTimeStamp = dateTimeStamp;
        }

        /* async */ arangoRestore( params );
      }
      break;

    case "arango-restore-default":
      {
        let deploymentLabel = argv[1];

        /* async */ arangoRestoreDefault( {deploymentLabel } );
      }
      break;

    /* Default */

    default:
      showUsageAndExit();
  }
}

main();

// -------------------------------------------------------------------- Function

/**
 * Show usage text and exit process
 */
function showUsageAndExit()
{
  const message =
  `

  USAGE
  node devtool.mjs <command> [...params]


  --------------------
  DEVELOPMENT COMMANDS
  --------------------

  run                 Run the project in development mode

                      - Compiles a development version of the project
                      - Sets development environment variables from
                        [config/env.default.js] and [config/env.default.js]
                      - Runs the compiled development version of the project


  build               Build a production version of the project

                      - Executes the [update-deps] command.
                        This will update the package.json file from the project
                        folder before it is copied to the dist folder.
                      - Builds a production version of the project in the
                        [dist] folder


  preview             Preview the production version from the [dist] folder

                      - Builds the project in the dist folder
                      - Sets *development* environment variables from
                        [config/env.default.js] and [config/env.default.js]
                      - Runs [dist/index.mjs]


  update-deps         Update dependencies

                      - Merges all [package.json] files from all library folders
                        into the a single [package.json] in the project root
                      - Runs [npm install] in the project root folder.


  update-devtool      Copy the (newer) devtool script from the install files
                      folder to the project folder. Run this command after you
                      added a new or updated [hkdigital-jsdevtool] folder to
                      your project.


  ----------------
  LIBRARY COMMANDS
  ----------------

  lib-add             <repository-url> [<lib-folder-name>]

                      Add a git submodule to the [lib] folder. A repository
                      url is required. A custom lib folder name is optional.

  lib-remove          <lib-folder-name> [force]

                      Remove a git submodule from the [lib] folder. A lib folder
                      name is required. [force] is required if the sub module
                      contains changes or if git thinks there are changes.


  ----------------------
  GIT SUBMODULE COMMANDS
  ----------------------

  submodules-status   Displays the git status for all submodules

  submodules-pull     Pull changes for all submodules from remote repository
  submodules-push     Push changes from all submodules to their remote
                      repositories


  -----------------
  DATABASE COMMANDS
  -----------------

  arango-dump         [<deployment-label>=local]

                      Dump the contents of a database to the folder
                      [databases/arango-<deployment-label>/dump/<timestamp>]

                      Deployment labels can be configured in
                      [config/deploy.default.js] or [config/deploy.local.js]

  arango-restore      [<deployment-label>=local] [<timestamp>=latest]

                      Restore the database contents from the folder
                      [databases/arango-<deployment-label>/dump/<timestamp>]

  arango-restore-default

                      [<deployment-label>=local] [<timestamp>=latest]

                      Restore the database contents from the folder
                      [databases/arango-default/<timestamp>]

                                   ~~ * ~~

  `;

  console.log( message );
  process.exit(0);
}

// -------------------------------------------------------------------- Function

/**
 * Show [hkdigital-jsdevtool] installation instructions and exit
 */
function showInstallHowtoAndExit()
{
  const message =
    `
    Missing [hkdigital-jsdevtool] folder. Please add the devtool to your
    project first.

    Run the following command in your terminal:

    --
    npx degit git@github.com:HKdigital/hkdigital-jsdevtool.git hkdigital-jsdevtool
    --

    More information:
    https://github.com/HKdigital/hkdigital-jsdevtool
    `;

  console.log( message );
  process.exit(0);
}
