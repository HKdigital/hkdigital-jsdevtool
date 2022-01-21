#!/bin/bash

REPOSITORY_NAME=$1

if [ -z "${REPOSITORY_NAME}" ]; then
   echo "Missing parameter [repository-name]"
   exit 255
fi

GIT_BASE_URL=bitbucket.org:hk-digital

exec git submodule add \
 git@${GIT_BASE_URL}/${REPOSITORY_NAME}.git lib/${REPOSITORY_NAME}
