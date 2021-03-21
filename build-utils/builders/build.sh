#!/usr/bin/env bash

img="arm32v7/node:13-slim"

svcdir=$(pwd)
svcimage=$(echo `basename $svcdir` | sed 's/service\./s-/g')
service=$(basename $svcdir)
version=$(git rev-parse HEAD)

echo "Service name: $svcimage"

# Fix SSH sticking bug
unset SSH_AUTH_SOCK

# Select builder
if [ $# -eq 0 ]; then
    builder=$(sort -R ../../build-utils/builders/builders | head -n 1)
else
    builder=$1
fi
echo "Selected builder: $builder"

# Compile Node projects
if [ -f "package.json" ]; then
    echo "Compiling..."
    yarn build
fi

# Create Sentry sourcemaps
yarn run sentry-cli releases new "$service@$version" --finalize
yarn run sentry-cli releases files "$service@$version" upload-sourcemaps dist/index.js.map

# Upload files to builder
ssh pi@$builder "mkdir -p .workspace"
echo "Sending files..."
rsync -azvhP --copy-links --delete ../ pi@$builder:.workspace

# Build and push image
echo "Building image..."
ssh pi@$builder "docker build -t dan1elhughes/casa-$svcimage:latest --build-arg SERVICE=$service --build-arg IMG=$img .workspace"
echo "Pushing image..."
ssh pi@$builder "docker push dan1elhughes/casa-$svcimage:latest"
