#!/bin/bash

exec git submodule foreach --quiet --recursive \
  '${toplevel}/hkdigital-devtool/scripts/git/include/git-submodule-status.sh'