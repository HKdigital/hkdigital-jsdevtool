#!/usr/bin/env node

// -----------------------------------------------------------------------------
// Imports

import { packageJsonExists,
         ensureLibPath,
         copyFrontendFiles,
         runNpmInstall } from "./js-include/devtool-helper.mjs";

// -----------------------------------------------------------------------------
// Run setup

(async function setup()
{
  console.log();

  if( await packageJsonExists() )
  {
    console.log(`Setup (backend) script will not run:`);
    console.log(`- A file [package.json] already exists.`);
    console.log(`  (setup will not install in an existing project)`);
    console.log();
    return;
  }

  await ensureLibPath();

  await copyBackendFiles();

  await runNpmInstall();
})();
