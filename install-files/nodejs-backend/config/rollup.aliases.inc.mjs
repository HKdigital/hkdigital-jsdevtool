

export function getAliasEntries( { resolveSrcPath, resolveLibPath } )
{
  return {
    entries: {
      "$src": resolveSrcPath()

      // "$platform": resolveLibPath( "jslib-hk-be" ),

      // "$hk": resolveLibPath( "jslib-hk-base" ),
      // "$hk-be": resolveLibPath( "jslib-hk-be" ),

      // "$fs": resolveLibPath( "jslib-hk-be", "fs" ),

      // "$hk-be": resolveLibPath( "jslib-hk-be" ),

      // "$hk-media-be": resolveLibPath( "jslib-hk-media-be" )
    }
  };
}