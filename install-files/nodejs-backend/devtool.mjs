#!/usr/local/bin/node

import { existsSync } from "fs";

/* ---------------------------------------------------------- Dynamic imports */

let rollupRunInDevelopmentMode;
let rollupBuildDist;
let rollupPreviewProjectFromDist;
let installDeps;

let gitAddSubmodule;
let gitRemoveSubmodule;

let gitDisplaySubmodulesStatus;
let gitSubmodulesPull;
let gitSubmodulesPush;

/**
 * Dynamically import dependencies
 */
async function importDependencies()
{
  const helperPath = "./hkdigital-devtool/helper/index.mjs";

  if( !existsSync( helperPath ) )
  {
    showInstallHowtoAndExit();
  }

  const helperModule = await import( helperPath );

  rollupRunInDevelopmentMode = helperModule.rollupRunInDevelopmentMode;
  rollupBuildDist = helperModule.rollupBuildDist;
  rollupPreviewProjectFromDist = helperModule.rollupPreviewProjectFromDist;

  installDeps = helperModule.installDeps;

  gitAddSubmodule = helperModule.gitAddSubmodule;
  gitRemoveSubmodule = helperModule.gitRemoveSubmodule;

  gitDisplaySubmodulesStatus = helperModule.gitDisplaySubmodulesStatus;
  gitSubmodulesPull = helperModule.gitSubmodulesPull;
  gitSubmodulesPush = helperModule.gitSubmodulesPush;
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
    case "run":
      /* async */ rollupRunInDevelopmentMode();
      break;

    case "build":
      /* async */ rollupBuildDist();
      break;

    case "preview":
      /* async */ rollupPreviewProjectFromDist();
      break;

    case "install-deps":
      /* async */ installDeps();
      break;

    case "submodule-add":
      {
        const repositoryUrl = argv[1];
        const libFolderName = argv[2];

        /* async */ gitAddSubmodule( repositoryUrl, libFolderName );
      }
      break;

    case "submodule-remove":
      {
        const libFolderName = argv[1];
        const force = argv[2] === "force";

        /* async */ gitRemoveSubmodule( libFolderName, force );
      }
      break;

    case "submodules-status":
      /* async */ gitDisplaySubmodulesStatus();
      break;

    case "submodules-pull":
      /* async */ gitSubmodulesPull();
      break;

    case "submodules-push":
      /* async */ gitSubmodulesPush();
      break;

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
  usage:
  ./devtool.mjs <command>

  commands:

  install-deps        Merge all [package.json] files from all library folders
                      into the a single [package.json] in the project root and
                      runs [npm install] in the project root folder.

  run                 Run in development mode

  build               Build a production version in the [dist] folder

  preview             Run the production version from the [dist] folder
                      - Build the project first
                      - Development environment variables from the config
                        folder will be set

  submodule-add <repository-url> [<lib-folder-name>]

                      Add a git submodule to the [lib] folder. A repository url
                      is required. A custom lib folder name is optional.

  submodule-remove <lib-folder-name> [force]

                      Remove a git submodule from the [lib] folder. A lib folder
                      name is required. [force] is required if the sub module
                      contains changes.

  submodules-status   Displays the git status for all submodules

  submodules-pull     Pull changes for all submodules from remote repository
  submodules-push     Pull changes in all submodules to their remote repositories
  `;

  console.log( message );
  process.exit(0);
}

// -------------------------------------------------------------------- Function

/**
 * Show [hkdigital-devtool] installation instructions and exit
 */
function showInstallHowtoAndExit()
{
  const message =
    `
    Missing [hkdigital-devtool] folder. Please add the devtool to your project first.

    Run the following command in your terminal:

    --
    npx degit git@github.com:HKdigital/hkdigital-devtool.git hkdigital-devtool
    --

    More information:
    https://github.com/HKdigital/hkdigital-devtool
    `;

  console.log( message );
  process.exit(0);
}
