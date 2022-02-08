#!/bin/bash

CURRENT_LIB_PATH=$(pwd)
CURRENT_LIB_NAME=$(basename ${CURRENT_LIB_PATH})
BRANCH=$(git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/')

echo ""
echo " * Pull submodule in folder [${CURRENT_LIB_NAME}] (branch:${BRANCH})"
echo ""
git pull --no-rebase
