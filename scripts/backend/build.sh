#!/usr/bin/env bash

export NODE_ENV="production"

# @note run using npm run to detect root folder correctly
CWD=$PWD

CONFIG_FILE="${CWD}/rollup.config.js"

PROG_NAME=$(basename $0)

# ------------------------------------------------------------------------------
# Execute setup command

"${CWD}/scripts/setup.js"

# ------------------------------------------------------------------------------
# Build rollup command

COMMAND=( "rollup" "--config" "${CONFIG_FILE}" )

#
# Show rollup command
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