
import { resolveProjectPath } from "./paths.mjs";

import { readFile } from "./fs.mjs";

export async function showReadme()
{
  const projectPath = resolveProjectPath();

  const text = await readFile( resolveProjectPath("README-DEVTOOL.md"), 'utf8' );

  console.log();
  console.log("Displaying contents of the file README-DEVTOOL.md");
  console.log("-------------------------------------------------");
  console.log();
  console.log( text );
  console.log();
  console.log("-------------------------------------------------");
  console.log();
  console.log(`=> Now you can change to project root folder and run the devtool`);
  console.log();
  console.log(`cd ${projectPath}`);

  if( !projectPath.includes(":/") )
  {
    console.log(`./devtool.mjs`);
  }
  else {
    console.log(`node devtool.mjs`);
  }
  console.log();
}