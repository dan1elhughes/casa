#!/usr/bin/env bash

# Set up a new Raspberry Pi (by hostname) as a
# prerequisite to running Ansible against it.

unset SSH_AUTH_SOCK

ssh pi@raspberrypi.local "mkdir -p ~/.ssh && \
wget -O ~/.ssh/authorized_keys https://github.com/dan1elhughes.keys && \
chmod 0644 ~/.ssh/authorized_keys"

hostname=$(ssh pi@raspberrypi.local "sed 's/://g' /sys/class/net/eth0/address")

ssh -t pi@raspberrypi.local "sudo sed -i 's/raspberrypi/$hostname/g' /etc/hostname && \
sudo sed -i 's/raspberrypi/$hostname/g' /etc/hosts"
ssh -t pi@raspberrypi.local "sudo reboot"

echo $hostname
