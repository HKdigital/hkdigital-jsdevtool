
import { resolveProjectPath } from './paths.mjs';

// import { readFile } from './fs.mjs';

export async function showHowtoDevTool()
{
  // const projectPath = resolveProjectPath();

  // const text = await readFile( resolveProjectPath("README-DEVTOOL.md"), 'utf8' );

  // console.log();
  // console.log("Displaying contents of the file README-DEVTOOL.md");
  // console.log("-------------------------------------------------");
  // console.log();
  // console.log( text );
  // console.log();
  // console.log("-------------------------------------------------");
  console.log();
  console.log('Next steps:');
  console.log();
  console.log('=> Change to project root folder');
  console.log();
  console.log('cd ..');
  console.log();
  console.log('=> Run the devtool');
  console.log();
  console.log('node devtool.mjs');
  console.log();
}