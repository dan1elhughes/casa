#!/usr/bin/env bash

for D in ./service.*/; do
    cd $D
    ./build.sh
    cd ..
done
