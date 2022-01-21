#!/bin/bash

read -r -p "Checkout main branch and pull latest commit for all submodules? [y/N] " response

case "$response" in
    [yY][eE][sS]|[yY])
        echo ""
        exec git submodule foreach --quiet --recursive '../hk-jslib-dev/scripts/helpers/git-submodule-checkout-master-and-pull.sh'
        ;;
    *)
        echo "Bye"
        echo ""
        ;;
esac
