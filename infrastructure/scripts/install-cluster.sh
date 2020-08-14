#!/usr/bin/env bash

export MASTER_IP=192.168.1.140
declare -a ips=("192.168.1.141" "192.168.1.142")
export USER=pi
export CONTEXT=casa


k3sup install \
    --ip $MASTER_IP \
    --user $USER \
    --context $CONTEXT \
    --no-extras

for WORKER_IP in "${ips[@]}"; do
    k3sup join \
        --server-ip $MASTER_IP \
        --ip $WORKER_IP \
        --user $USER

    ssh pi@$WORKER_IP 'sudo reboot'
done

ssh pi@$MASTER_IP 'sudo reboot'

mv -v ./kubeconfig ../kubeconfig
