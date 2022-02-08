
import { resolveProjectPath } from "./paths.mjs";

import { readFile } from "./fs.mjs";

export async function showReadme()
{
  const text = await readFile( resolveProjectPath("README-DEVTOOL.md"), 'utf8' );

  console.log();
  console.log("Displaying contents of the file README-DEVTOOL.md");
  console.log("-------------------------------------------------");
  console.log();
  console.log( text );
  console.log();
  console.log("-------------------------------------------------");
  console.log();
}