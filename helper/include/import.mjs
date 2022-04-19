
/**
 * Dynamic import
 * - This method can be used instead of `await import(...)`
 * - This method is needed because of issues with paths and URI's on Windows:
 *   Paths are converted to URI's before they are passed to `import(...)`
 *
 * @param {string} pathOrURI
 *
 * @returns {object} module
 */
export async function asyncImport( pathOrURI )
{
  if( typeof pathOrURI !== "string" )
  {
    throw new Error("Missing or invalid parameter [pathOrURI]");
  }

  // console.log( 123, { pathOrURI } );

  if( pathOrURI.charAt(1) === ":" && pathOrURI.charAt(2) === "\\" )
  {
    // on windows pathname looks like `/C:/Users/.../....`
    // => remove first slash
    // pathOrURI = pathOrURI.slice( 1 );

    // Windows doesn't like e.g. %20 for space
    // => decode URI
    // pathOrURI = decodeURI( pathOrURI );

    // pathname = "file://" + pathname;

    pathOrURI = "file://" + pathOrURI;
  }

  // console.log( 789, { pathOrURI } );

  return await import( pathOrURI );
}