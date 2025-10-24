# CI/CD and HTTPS Deployment Documentation

## Overview

This document explains how the CI/CD pipeline for the **Node.js backend API** was implemented, including the automated deployment process, container orchestration, and HTTPS configuration using **Let's Encrypt (Certbot)**.

The system is hosted on **AWS EC2** and uses **GitHub Actions** for CI/CD. It is designed to automatically build and deploy the backend whenever new commits are pushed to the main branch.

---

## CI/CD Pipeline Overview

### 1. Continuous Integration (CI)

When a new commit is pushed to the main branch:

* GitHub Actions runs a **build and test workflow**.
* The workflow installs dependencies, runs the test suite, and builds the application.
* If successful, a **Docker image** is built and pushed to **AWS Elastic Container Registry (ECR)**.

### 2. Continuous Deployment (CD)

After a successful image push:

* GitHub Actions connects to the **EC2 instance** via SSH.
* It updates environment variables and configuration files using **GitHub Secrets**.
* The EC2 instance pulls the latest Docker image from ECR and recreates containers using the latest version.
* HTTPS certificates are automatically managed by **Let's Encrypt** through the **Certbot** container.

### 3. Secrets and Environment Variables

The following secrets are required in GitHub:

* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`
* `AWS_ECR_REPOSITORY`
* `EC2_SSH_KEY`
* `EC2_HOST`
* `DOCKER_COMPOSE_PROD_CONTENT_HTTPS`
* `DOMAIN`
* `EMAIL`
* `NGINX_CONF_CONTENT`

These are injected into the EC2 instance during deployment to dynamically generate Docker Compose and Nginx configuration files.

---

## HTTPS Configuration and Deployment Steps

### 1. Domain Setup

Before deployment, ensure the API is linked to a specific domain. This is essential since the **frontend** and **backend** run on separate servers and domains.

### 2. Initial Let's Encrypt Certificate Request

To enable HTTPS for the first time, the following services were configured in Docker Compose:

* **Nginx**: Acts as a reverse proxy for routing requests to the API.
* **Certbot**: Handles HTTPS certificate generation and renewal.

#### Example `DOCKER_COMPOSE_PROD_CONTENT_HTTPS` (Initial Version)

```yaml
version: '3.8'

services:
  api-wbd:
    image: 179388324778.dkr.ecr.us-east-2.amazonaws.com/wbd-mais-ages:latest
    restart: unless-stopped
    env_file:
      - .env.production
    depends_on:
      db-wbd:
        condition: service_healthy
    command: sh -c "yarn prisma:migrate:prod && node dist/main.js"
    networks:
      - app-network

  db-wbd:
    image: postgres:16-alpine
    restart: unless-stopped
    env_file:
      - .env.production
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d wbd_database"]
      interval: 5s
      retries: 5
    volumes:
      - wbd_database:/var/lib/postgresql/data
    networks:
      - app-network

  webserver:
    image: nginx:latest
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-conf:/etc/nginx/conf.d
      - certbot-etc:/etc/letsencrypt
      - certbot-var:/var/lib/letsencrypt
      - web-root:/var/www/html
      - dhparam:/etc/ssl/certs
    depends_on:
      - api-wbd
    networks:
      - app-network

  certbot:
    image: certbot/certbot
    volumes:
      - certbot-etc:/etc/letsencrypt
      - certbot-var:/var/lib/letsencrypt
      - web-root:/var/www/html
    depends_on:
      - webserver
    command: certonly --webroot --webroot-path=/var/www/html --email ${EMAIL} --agree-tos --no-eff-email --staging -d ${DOMAIN}

volumes:
  wbd_database:
  certbot-etc:
  certbot-var:
  web-root:
    driver: local
    driver_opts:
      type: none
      device: /home/ec2-user/app/web-root/
      o: bind
  dhparam:
    driver: local
    driver_opts:
      type: none
      device: /home/ec2-user/app/dhparam/
      o: bind

networks:
  app-network:
    driver: bridge
```

#### Example `NGINX_CONF_CONTENT`

```nginx
server {
    listen 80;
    server_name ${DOMAIN};

    location ~ /.well-known/acme-challenge {
      allow all;
      root /var/www/html;
    }

    location / {
      proxy_pass http://api-wbd:3000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host $host;
    }
}
```

---

## Manual Steps for the First HTTPS Certificate

After the deployment process was triggered via GitHub Actions and the containers were successfully launched on the AWS EC2 instance, a few additional steps were necessary.  
Because this was the first time the application interacted with **Let's Encrypt**, no SSL certificate had been issued yet. Therefore, the following manual actions were performed:

### Step 1: Edit the `docker-compose.prod.yml`

Replace `--staging` with `--force-renewal` in the Certbot command:

```bash
certonly --webroot --webroot-path=/var/www/html --email ${EMAIL} --agree-tos --no-eff-email --staging -d ${DOMAIN}
```

Then run:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --force-recreate --no-deps certbot
```

### Step 2: Update Nginx Configuration for SSL

Manually edit `nginx-conf/nginx.conf` to include SSL directives:

```nginx
server {
    listen 80;
    server_name ages-wimbelemdon-api.duckdns.org;

    location ~ /.well-known/acme-challenge {
      allow all;
      root /var/www/html;
    }

    location / {
        rewrite ^ https://$host$request_uri? permanent;
    }
}

server {
    listen 443 ssl;
    server_name ages-wimbelemdon-api.duckdns.org;

    ssl_certificate /etc/letsencrypt/live/ages-wimbelemdon-api.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ages-wimbelemdon-api.duckdns.org/privkey.pem;
    ssl_dhparam /etc/ssl/certs/dhparam-2048.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:AES:CAMELLIA:DES-CBC3-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA;

    location / {
      proxy_pass http://api-wbd:3000;
      proxy_http_version 1.1;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Restart the webserver:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --force-recreate --no-deps webserver
```

---

## Automation for Future Deployments

Once the initial certificate is issued, future deployments are fully automated.

### Updated `DOCKER_COMPOSE_PROD_CONTENT_HTTPS`

The updated configuration automatically renews certificates every 12 hours:

```yaml
version: '3.8'

services:
  api-wbd:
    image: 179388324778.dkr.ecr.us-east-2.amazonaws.com/wbd-mais-ages:latest
    restart: unless-stopped
    env_file:
      - .env.production
    depends_on:
      db-wbd:
        condition: service_healthy
    command: sh -c "yarn prisma:migrate:prod && node dist/main.js"
    networks:
      - app-network

  db-wbd:
    image: postgres:16-alpine
    restart: unless-stopped
    env_file:
      - .env.production
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d wbd_database"]
      interval: 5s
      retries: 5
    volumes:
      - wbd_database:/var/lib/postgresql/data
    networks:
      - app-network

  webserver:
    image: nginx:latest
    restart: unless-stopped
    env_file:
      - .env.production
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-conf:/etc/nginx/conf.d
      - certbot-etc:/etc/letsencrypt
      - certbot-var:/var/lib/letsencrypt
      - web-root:/var/www/html
      - dhparam:/etc/ssl/certs
    depends_on:
      - api-wbd
    networks:
      - app-network

  certbot:
    image: certbot/certbot
    env_file:
      - .env.production
    volumes:
      - certbot-etc:/etc/letsencrypt
      - certbot-var:/var/lib/letsencrypt
      - web-root:/var/www/html
    depends_on:
      - webserver
    entrypoint: /bin/sh
    command: >
      -c "
        sleep 5s  # wait Nginx to boot before challenge;
        certbot certonly --webroot --webroot-path=/var/www/html --email ${EMAIL} --agree-tos --no-eff-email -d ${DOMAIN} --non-interactive --quiet || true;
        echo 'Starting Certbot renewal loop...';
        while true; do 
          echo "Running scheduled Certbot renewal check";
          certbot renew --webroot --webroot-path=/var/www/html --quiet;
          sleep 12h;
        done
      "
volumes:
  wbd_database:
  certbot-etc:
  certbot-var:
  web-root:
    driver: local
    driver_opts:
      type: none
      device: /home/ec2-user/app/web-root/
      o: bind
  dhparam:
    driver: local
    driver_opts:
      type: none
      device: /home/ec2-user/app/dhparam/
      o: bind

networks:
  app-network:
    driver: bridge
```

### Updated `NGINX_CONF_CONTENT`

```nginx
server {
    listen 80;
    server_name ${DOMAIN};

    location ~ /.well-known/acme-challenge {
      allow all;
      root /var/www/html;
    }

    location / {
        rewrite ^ https://$host$request_uri? permanent;
    }
}

server {
    listen 443 ssl;
    server_name ${DOMAIN};

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    ssl_dhparam /etc/ssl/certs/dhparam-2048.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:AES:CAMELLIA:DES-CBC3-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA;

    location / {
      proxy_pass http://api-wbd:3000;
      proxy_http_version 1.1;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Summary

This setup provides:

* **Automatic HTTPS management** via Let's Encrypt (Certbot).
* **Secure routing** through Nginx as a reverse proxy.
* **Continuous integration and deployment** using GitHub Actions.
* **Container orchestration** and isolation through Docker Compose.
* **Persistent storage** for SSL certificates and database data.

This ensures that the backend API remains secure, maintainable, and automatically deployable with minimal manual intervention.
