#!/usr/bin/env bash

unset SSH_AUTH_SOCK

builder="000f00cfcd06.local"

rsync -azP . pi@$builder:.workspace/

ssh pi@$builder "docker build -t dan1elhughes/casa-s-meross:latest .workspace/"
ssh pi@$builder "docker save dan1elhughes/casa-s-meross:latest" | pv > img.tar

docker load < img.tar
docker push dan1elhughes/casa-s-meross:latest

rm -v img.tar
