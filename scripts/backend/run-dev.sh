#!/usr/bin/env bash

export NODE_ENV="dev"

# ------------------------------------------------------------------------------
# Read rollup config
#
# @note run this script via `npm run` to detect the root folder correctly
#
CWD=$PWD
CONFIG_FILE="${CWD}/rollup.config.js"

# ------------------------------------------------------------------------------
# Execute setup command

"${CWD}/scripts/setup.js"

# ------------------------------------------------------------------------------
# Build rollup command

COMMAND=( "rollup" "--config" "${CONFIG_FILE}" "--watch" )

#
# Show command
#
echo "ROLLUP COMMAND >>"
echo "${COMMAND[*]}"

# ------------------------------------------------------------------------------
# Execute rollup command

#
# Execute command
# @eg rollup --config "${CONFIG_FILE}" --watch
#
echo
"${COMMAND[@]}"
echo

exit 0