#!/usr/bin/env bash

for D in service.*/; do
    kubectl delete -f $D/manifests
done
