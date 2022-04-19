

export async function getAliasEntries(
  {
    resolveSrcPath,
    resolveLibPath,
    resolveDevToolsPath
  } )
{

  return {
    entries: {
      "$src": resolveSrcPath()

      // "$hk": join( LIB_PATH, 'jslib-hk-base' ),
      // "$hk-be": join( LIB_PATH, 'jslib-hk-be' ),
      // "$hk-media-be": join( LIB_PATH, 'jslib-hk-media-be' ),

      // "$fs": join( LIB_PATH, 'jslib-hk-be', 'fs' ),
      // "$platform": join( LIB_PATH, 'jslib-hk-be' )
    }
  };
}