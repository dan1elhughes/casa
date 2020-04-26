#!/usr/bin/env bash

rm -f img.tar

svcdir=$(pwd)
svcimage=$(echo `basename $svcdir` | sed 's/service\./s-/g')

unset SSH_AUTH_SOCK

builder=$(sort -R ../../build-utils/builders/builders | head -n 1)
echo "Selected builder: $builder"

ssh pi@$builder "mkdir -p .workspace/$svcimage"

echo "Sending service files..."
rsync -azqhP --copy-links --delete $svcdir/ pi@$builder:.workspace/$svcimage

echo "Building image..."
ssh pi@$builder "docker build --quiet -t dan1elhughes/casa-$svcimage:latest .workspace/$svcimage"

echo "Pushing image..."
ssh pi@$builder "docker push dan1elhughes/casa-$svcimage:latest"
