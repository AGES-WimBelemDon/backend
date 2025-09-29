#!/bin/bash -xe
exec > /var/log/user-data.log 2>&1
echo "Hello from user data"

dnf update -y
dnf install -y docker

systemctl enable --now docker

usermod -a -G docker ec2-user

DOCKER_CONFIG=/home/ec2-user/.docker
mkdir -p $DOCKER_CONFIG/cli-plugins
chown -R ec2-user:ec2-user /home/ec2-user/.docker

curl -SL https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-linux-x86_64 \
  -o $DOCKER_CONFIG/cli-plugins/docker-compose
chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose

echo "Setup complete. Reboot or re-login for ec2-user to use docker group"
