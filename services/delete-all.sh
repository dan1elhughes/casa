#!/usr/bin/env bash

for D in */; do
    kubectl delete -f $D/manifests
done
