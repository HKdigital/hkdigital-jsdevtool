#!/usr/local/bin/node

import {
  viteRunInDevelopmentMode,
  viteBuildDist,
  vitePreviewProjectFromDist,
  installDeps } from "./hkdigital-devtool/helper/svelte-frontend.mjs";

/* --------------------------------------------------- Process program params */

const argv = process.argv.slice(2); // remove 'node' and 'devtool.js'

// console.log("devtool-new", argv);

if( !argv.length )
{
  showUsageAndExit();
}

switch( argv[0] )
{
  case "run":
    /* async */ viteRunInDevelopmentMode();
    break;

  case "build":
    /* async */ viteBuildDist();
    break;

  case "preview":
     /* async */  vitePreviewProjectFromDist();
    break;

  case "install-deps":
    /* async */ installDeps();
    break;

  default:
    showUsageAndExit();
}

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
  `;

  console.log( message );
  process.exit(0);
}
