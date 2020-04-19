#!/usr/bin/env bash

unset SSH_AUTH_SOCK

master="000f00cfcd06.local"

ssh -t pi@$master "\
mkdir -p ~/.kube && \
sudo cat /etc/rancher/k3s/k3s.yaml > ~/.kube/config"

ip=$(ssh pi@$master "hostname -I | awk '{ print \$1 }'")

mkdir -p .kube
scp pi@$master:.kube/config .kube/config

sed -i "" "s/127.0.0.1/$ip/g" ./.kube/config

K3S_URL="https://$ip:6443"
export K3S_URL

K3S_TOKEN=$(ssh pi@$master "sudo cat /var/lib/rancher/k3s/server/node-token")
export K3S_TOKEN

KUBECONFIG="/Users/danhughes/src/github.com/dan1elhughes/casa/.kube/config"
export KUBECONFIG
