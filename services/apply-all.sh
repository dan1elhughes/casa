#!/usr/bin/env bash

for D in service.*/; do
    kubectl apply -f $D/manifests
done
