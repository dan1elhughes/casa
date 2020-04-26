#!/usr/bin/env bash

svcdir=$(pwd)
svcimage=$(echo `basename $svcdir` | sed 's/service\./s-/g')

echo "Service name: $svcimage"

unset SSH_AUTH_SOCK

builder=$(sort -R ../../build-utils/builders/builders | head -n 1)
echo "Selected builder: $builder"

ssh pi@$builder "mkdir -p .workspace/$svcimage"

echo "Sending service files..."
rsync -azvhP --copy-links --delete $svcdir/ pi@$builder:.workspace/$svcimage

echo "Building image..."
ssh pi@$builder "docker build -t dan1elhughes/casa-$svcimage:latest .workspace/$svcimage"

echo "Pushing image..."
ssh pi@$builder "docker push dan1elhughes/casa-$svcimage:latest"
