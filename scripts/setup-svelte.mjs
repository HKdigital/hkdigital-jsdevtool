#!/usr/bin/env node

// -----------------------------------------------------------------------------
// Imports

import { packageJsonExists,
         installPnpm,
         // runNpmInstallInDevtoolFolder,
         runPnpmInstallInDevtoolFolder,
         ensureLibPath,
         copyFrontendFiles,
         runGitInit,
         mergePackageJsons,
         // runNpmInstall,
         runPnpmInstall,
         showHowtoDevTool } from '../helper/index.mjs';

// -----------------------------------------------------------------------------
// Run setup

(async function setup()
{
  console.log();

  if( await packageJsonExists() )
  {
    console.log('Setup SVELTE (frontend) script will not run:');
    console.log('- A file [package.json] already exists.');
    console.log('  (setup will not install over an existing project)');
    console.log();
    return;
  }

  await installPnpm();

  // await runNpmInstallInDevtoolFolder();
  await runPnpmInstallInDevtoolFolder();

  await runGitInit();

  await ensureLibPath();

  await copyFrontendFiles();

  await mergePackageJsons();

  // await runNpmInstall();
  await runPnpmInstall();

  await showHowtoDevTool();
})();
