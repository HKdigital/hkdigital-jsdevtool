
import cwebp from 'cwebp-bin';

import { execAsync } from "./shell.mjs";
import { expandGlobs } from "./glob.mjs";

import { basename,
         stripProjectPath } from "./paths.mjs";

import { expectNotEmptyString } from "./expect.mjs";

// -----------------------------------------------------------------------------

/**
 * Generate optimized images for all images found in the specified folder
 * - The function works recursively
 *
 * @param {string|string[]} [globOrGlobs=]
 *   Glob or list of globs that determine which images to convert
 */
export async function generateOptimizedImages(
  globOrGlobs="src/static/img/**/*.{jpg,png}" )
{
  const paths = await expandGlobs( globOrGlobs );

  // console.log( "generateOptimizedImages", paths );

  for( const path of paths )
  {
    await generateOptimizedImage( path );
  }
}

// -----------------------------------------------------------------------------

/**
 * Generate a webp image for the specified image
 *
 * @param {string} sourcePath
 */
export async function generateOptimizedImage( sourcePath )
{
  expectNotEmptyString( sourcePath,
    "Missing or invalid parameter [sourcePath]" );

  const outputPath = `${basename(sourcePath, { stripExtension: true })}.webp`;

  // const outputPath = `${dirname( sourcePath )}${SEPARATOR}${fileName}`;

  const cmd = `cwebp ${sourcePath} -q 90 -o "${outputPath}"]`;

  try {
    // console.log( cmd );

    const { stdout } = await execAsync( cmd );

    console.log( `Generated [${stripProjectPath(outputPath)}]`, stdout );
  }
  catch( e )
  {
    // if( e.stdout )
    // {
    //   ...
    // }

    console.log("Failed to generate optimized image");
    console.log( sourcePath );

    console.log("Command:");
    console.log( cmd );

    console.log( e );
  }
}