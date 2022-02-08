
export function getAliases( { resolveSrcPath, resolveLibPath } )
{
  return [
    // {
    //   find: '@',
    //   replacement: resolveSrcPath(".")
    // },

    // -- Platform (usually jslib-hk-fe or jslib-hk-be)

    { find: "$platform",
      replacement: resolveLibPath("jslib-hk-fe") },

    // -- Project

    { find: "$src",
      replacement: resolveSrcPath(".") },

    { find: "$theme",
      replacement: resolveLibPath("jslib-hk-fe/theme") },

    { find: "$fonts-and-icons-hk",
      replacement: resolveLibPath("fonts-and-icons-hk") },

    { find: "$content-panels",
      replacement: resolveSrcPath("views/content-panels") },

    // -- Custom

    // -- Libs

    // ...getHkBaseAliases( { resolveLibPath } ),

    // ...getHkFrontendAliases( { resolveLibPath } )
  ];
}
