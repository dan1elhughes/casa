#!/usr/bin/env bash

for D in ./service.*/; do
    cd $D
    pwd
    npm rm @dan1elhughes/micro-loggly
    npm i @dan1elhughes/micro-loggly
    # ./build.sh
    cd ..
done
