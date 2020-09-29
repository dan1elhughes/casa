#!/usr/bin/env bash

img="arm32v7/node:13-slim"

svcdir=$(pwd)
svcimage=$(echo `basename $svcdir` | sed 's/service\./s-/g')
service=$(basename $svcdir)

echo "Service name: $svcimage"

unset SSH_AUTH_SOCK

if [ $# -eq 0 ]; then
    builder=$(sort -R ../../build-utils/builders/builders | head -n 1)
else
    builder=$1
fi

echo "Selected builder: $builder"

if [ -f "package.json" ]; then
    echo "Compiling..."
    yarn build
fi

ssh pi@$builder "mkdir -p .workspace"

echo "Sending files..."
rsync -azvhP --copy-links --delete ../ pi@$builder:.workspace

echo "Building image..."
ssh pi@$builder "docker build -t dan1elhughes/casa-$svcimage:latest --build-arg SERVICE=$service --build-arg IMG=$img .workspace"

echo "Pushing image..."
ssh pi@$builder "docker push dan1elhughes/casa-$svcimage:latest"
