#!/usr/bin/env bash

for D in ./service.*/; do
    cd $D
    pwd
    ./build.sh
    cd ..
done
