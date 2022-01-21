#!/bin/bash

CURRENT_LIB_PATH=$(pwd)
CURRENT_LIB_NAME=$(basename ${CURRENT_LIB_PATH})

echo ""
echo "------------------------------------------------------------"
echo ""
echo " * Checkout main and pull for submodule in folder [${CURRENT_LIB_NAME}]"
echo ""
git checkout main
git pull --no-rebase
