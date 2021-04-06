#!/usr/bin/env bash

for D in ./service.*/; do
    [ "$D" == "./service.meross/" ] && continue
    echo "Building: $D"
    cd $D
    ./build.sh
    cd ..
done
