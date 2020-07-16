#!/usr/bin/env bash

declare -a ips=("192.168.1.140" "192.168.1.141" "192.168.1.142")
for IP in "${ips[@]}"; do
    ssh pi@$IP 'sudo /usr/local/bin/k3s-uninstall.sh'
    ssh pi@$IP 'sudo reboot'
done
