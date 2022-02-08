#!/bin/bash

CMD=("$1" "$2" "$3" "$4" "$5" "$6" "$7" "$8" "$9")

if [ -z "${CMD}" ]; then
   echo "Missing parameter [CMD]"
   exit 255
fi

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

exec "${SCRIPT_DIR}/submodules-${CMD}.sh"
