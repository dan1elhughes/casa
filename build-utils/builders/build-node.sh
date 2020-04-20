#!/usr/bin/env bash

rm -f img.tar

svcdir=$(pwd)
svcimage=$(echo `basename $svcdir` | sed 's/service\./s-/g')

unset SSH_AUTH_SOCK

builder="000f02365bce.local"

rsync -azvhP --copy-links --delete $svcdir/ pi@$builder:.workspace/

ssh pi@$builder "docker build -t dan1elhughes/casa-$svcimage:latest .workspace/"
ssh pi@$builder "docker save dan1elhughes/casa-$svcimage:latest" | pv > img.tar

docker load < img.tar
docker push dan1elhughes/casa-$svcimage:latest

