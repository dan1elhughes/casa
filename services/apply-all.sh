#!/usr/bin/env bash

for D in */; do
    kubectl apply -f $D/manifests | grep configured
done
