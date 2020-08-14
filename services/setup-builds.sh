#!/usr/bin/env bash

for D in *; do
    if [[ $D == service* ]] && [ -f "$D/package.json" ]; then
        echo -e \\n=== $D: Node service ===
        rm "$D/build.sh"
        ln -sfv ../../build-utils/builders/build.sh "$D/build.sh"
    fi
done
