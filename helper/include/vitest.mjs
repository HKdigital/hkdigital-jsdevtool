/* ------------------------------------------------------------------ Imports */

import { resolveConfigPath } from './paths.mjs';

import { spawn } from 'node:child_process';

/* ---------------------------------------------------------------- Internals */

const VITE_DEV_FILE_NAME = 'vite.dev.mjs';

// const MODE_TEST = 'test';

/* ---------------------------------------------------------------- Functions */

/**
 * Start vitest test runner
 *
 * @param {boolean} [watch=true]
 */
export async function runVitest( watch=true )
{
  const configPath = resolveConfigPath(VITE_DEV_FILE_NAME);

  const args = ['vitest', '--config', configPath ];

  if( watch )
  {
    args.push( '--watch');
  }

  const vitest =
    spawn( 'npx', args, { stdio: 'inherit' } );

  vitest.on('exit', () => {
    console.log('exit' );
    process.exit()
  })
}