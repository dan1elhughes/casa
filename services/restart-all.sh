#!/usr/bin/env bash

for D in service.*/; do
    svcimage=$(echo `basename $D` | sed 's/service\.//g')
    deployment="deployment.apps/deployment-$svcimage"
    kubectl rollout restart $deployment
done
