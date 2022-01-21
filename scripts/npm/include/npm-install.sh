#!/bin/bash

CURRENT_PATH=$(pwd)
CURRENT_FOLDER=$(basename ${CURRENT_PATH})

if [ -f "./package.json" ]; then
  echo ""
  echo " * NPM install in folder [${CURRENT_FOLDER}]"
  echo ""
  npm install
else
  echo ""
  echo " * Skip NPM install in folder [${CURRENT_FOLDER}]"
  echo ""
fi
