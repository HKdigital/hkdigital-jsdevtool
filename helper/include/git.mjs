
import { resolveProjectPath } from './paths.mjs';
import { execAsync } from './shell.mjs';

// ---------------------------------------------------------------------- Method

/**
 * Run `git init` in the project root folder
 */
export async function runGitInit( silent=false )
{
  if( !silent )
  {
    console.log('* Run `git init`');
  }

  const projectRootPath = resolveProjectPath();

  const cmd = 'git init';

  const { stdout, stderr } = await execAsync( cmd, { cwd: projectRootPath } );

  if( !silent )
  {
    if( stdout )
    {
      console.log( stdout );
    }

    if( stderr )
    {
      console.log( stderr );
    }
  }
}