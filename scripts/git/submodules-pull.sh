#!/bin/bash

echo ""
read -r -p "Pull latest commit for all submodules? [y/N] " response

case "$response" in
    [yY][eE][sS]|[yY])
        echo ""
        exec git submodule foreach --quiet --recursive \
            '${toplevel}/devtools-hk/scripts/git/include/git-submodule-pull.sh'
        ;;
    *)
        echo "Bye"
        echo ""
        ;;
esac
