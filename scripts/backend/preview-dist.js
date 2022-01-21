#!/usr/bin/env node

// -----------------------------------------------------------------------------
// Load ENV variables

import defaultEnvVars from "../env.default.js";

import localEnvVars from "../env.local.js";

process.env.NODE_ENV = "production";

// Merge default and local environment variables into process.env

Object.assign( process.env, defaultEnvVars, localEnvVars );

console.log( process.env );

// -----------------------------------------------------------------------------
// Run script from distribution folder

(async ( )=> {
  await import( "../dist/index.mjs" );
})();