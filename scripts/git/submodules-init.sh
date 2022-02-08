#!/bin/bash

echo ""
read -r -p "Initialize all submodules (and switch to a branch)? [y/N] " response

git submodule update --init

case "$response" in
    [yY][eE][sS]|[yY])
        echo ""
        exec git submodule foreach -q --recursive \
          'git switch $(git config -f $toplevel/.gitmodules submodule.$name.branch || echo main)'
        ;;
    *)
        echo "Bye"
        echo ""
        ;;
esac
