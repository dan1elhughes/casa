#!/usr/bin/env bash

svcdir=$(pwd)
svcimage=$(echo `basename $svcdir` | sed 's/service\./s-/g')
service=$(basename $svcdir)

echo "Service directory: $svcdir"
echo "Service image: $svcimage"
echo "Service: $service"

unset SSH_AUTH_SOCK

if [ $# -eq 0 ]; then
    builder=$(sort -R ../../build-utils/builders/builders | head -n 1)
else
    builder=$1
fi

echo "Selected builder: $builder"

ssh pi@$builder "mkdir -p .workspace"

echo "Sending files..."
rsync -azvhP --copy-links --delete ../ pi@$builder:.workspace

echo "Building image..."
ssh pi@$builder "docker build -t dan1elhughes/casa-$svcimage:latest .workspace/$service"

echo "Pushing image..."
ssh pi@$builder "docker push dan1elhughes/casa-$svcimage:latest"
