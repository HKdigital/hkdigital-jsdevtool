#!/bin/bash

# @note this script uses git submodules to loop over all submodule folders

exec git submodule foreach --quiet --recursive \
  '${toplevel}/devtools-hk/scripts/npm/include/npm-install.sh'