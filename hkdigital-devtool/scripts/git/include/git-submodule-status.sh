#!/bin/bash

CURRENT_LIB_PATH=$(pwd)
CURRENT_LIB_NAME=$(basename ${CURRENT_LIB_PATH})
BRANCH=$(git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/')

echo ""
echo "--------------------------------------------------------------------------------"
echo ""
echo "Submodule [${CURRENT_LIB_NAME}] (${BRANCH})"
echo ""
git status
