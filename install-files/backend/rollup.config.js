
// --------------------------------------------------------------------- Imports

import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import copy from "rollup-plugin-copy";
import json from '@rollup/plugin-json';

import sourcemaps from 'rollup-plugin-sourcemaps';

import alias from '@rollup/plugin-alias';
import nodemon from '@rollup/plugin-run';

// -- Import PROJECT variables from [package.json]

import pkg from './package.json';


// ------------------------------------- Import environment variables from files
//
// @note in production: set environment variables using e.g. docker-compose
//

// -- Import default environment variables from [env.default.js]

import defaultEnvVars from "./env.default.js";

// -- Import local environment variables from [env.local.js]

// @note Execute `npm run setup` if missing
import localEnvVars from "./env.local.js";

// -- Merge default and local environment variables into process.env

Object.assign( process.env, defaultEnvVars, localEnvVars );

console.log( "envVars (combined)", { ... defaultEnvVars, ...localEnvVars } );

// -- Detect PROJECT_PATH

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname(__filename);

// const PROJECT_PATH = dirname(__dirname);
const PROJECT_PATH = __dirname;

const SRC_PATH = join( PROJECT_PATH, 'src' );
const LIB_PATH = join( PROJECT_PATH, 'shared-libs' );

// -- Config

if( !(pkg instanceof Object) )
{
  throw new Error("Missing [pkg]");
}

if( typeof pkg.name !== "string" )
{
  throw new Error("Missing or invalid [pkg.name]");
}

if( typeof pkg.version !== "string" )
{
  throw new Error("Missing or invalid [pkg.version]");
}

if( typeof pkg.author !== "string" )
{
  throw new Error("Missing or invalid [pkg.author]");
}

const ROLLUP_CONFIG = {
  input: 'src/index.js',
  output: {
    // DEV: file: 'generated/index.js', PRODUCTION: 'dist/index.mjs'
    format: 'es',
    banner: `/**\n`+
            ` * ${pkg.name} (${pkg.version})\n` +
            ` * Build: ${(new Date()).toISOString()}\n` +
            ` * Author: ${pkg.author}\n` +
            ` * License: see LICENSE.txt\n` +
            ` */\n\n` +
            `const onBootstrapReadyFns = [];\n\n` +
            `function onBootstrapReady( fn ) {\n` +
            `  onBootstrapReadyFns.push( fn );\n` +
            `}\n\n`,
    footer:
      `\n` +
      `for( const fn of onBootstrapReadyFns ) { fn(); }\n\n`
  },
  plugins: [
    // so Rollup can find modules from `node_modules`
    nodeResolve( { preferBuiltins: true } ),

    json(),

    // commonjs helps Rollup to convert modules from `node_modules` to ES
    commonjs(),

    alias({
      entries: {
        "$src": SRC_PATH

        // "$hk": join( LIB_PATH, 'jslib-hk-base' ),
        // "$hk-be": join( LIB_PATH, 'jslib-hk-be' ),
        // "$hk-media-be": join( LIB_PATH, 'jslib-hk-media-be' ),

        // "$fs": join( LIB_PATH, 'jslib-hk-be', 'fs' ),
        // "$platform": join( LIB_PATH, 'jslib-hk-be' )
      }
    })
  ]
};

// -- Process NODE_ENV

const NODE_ENV = process.env.NODE_ENV;

switch( NODE_ENV )
{
  case "dev":
    {
      ROLLUP_CONFIG.output.file = "generated/index.js";

      ROLLUP_CONFIG.plugins.push( nodemon(
        {
          execArgv: ['--enable-source-maps']
        } ) );

      ROLLUP_CONFIG.plugins.push( sourcemaps() );
      ROLLUP_CONFIG.output.sourcemap = true;

      // ROLLUP_CONFIG.plugins.push( mergePackageJson );
    }
    break;

  case "test":
    break;

  case "production":
    ROLLUP_CONFIG.output.file = "dist/index.mjs";

    ROLLUP_CONFIG.plugins.push(
      copy({
        targets: [
          { src: 'package.json', dest: 'dist/' },
          { src: 'LICENSE.txt', dest: 'dist/' }
        ]
      })
    );

    // import babel from 'rollup-plugin-babel';
    break;

  default:
    if( !NODE_ENV )
    {
      throw new Error(`Missing value for NODE_ENV`);
    }
    else {
      throw new Error(`Invalid value for NODE_ENV=${NODE_ENV}`);
    }
}

// ---------------------------------------------------------------------- Export

export default ROLLUP_CONFIG;