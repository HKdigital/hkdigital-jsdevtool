#!/bin/bash

echo ""
read -r -p "Push latest commit for all submodules? [y/N] " response

case "$response" in
    [yY][eE][sS]|[yY])
        echo ""
        exec git submodule foreach --quiet --recursive \
            '${toplevel}/hkdigital-devtool/scripts/git/include/git-submodule-push.sh'
        ;;
    *)
        echo "Bye"
        echo ""
        ;;
esac
