#!/bin/bash

exec git submodule foreach --quiet --recursive \
  '${toplevel}/devtools-hk/scripts/git/include/git-submodule-status.sh'