## Documentando o que foi feito para efetuar o deploy
Para que fosse possível se realizar a primeira comunicação com o Let's Encrypt utilizando foram cridas os seguintes secrets no Github:
- DOCKER_COMPOSE_PROD_CONTENT_HTTPS
- DOMAIN
- EMAIL
- NGINX_CONF_CONTENT
Para o primeiro deploy a variável DOCKER_COMPOSE_PROD_CONTENT_HTTPS foi setada como:
```
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

A variável NGINX_CONF_CONTENT foi setada como:
```
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
As demais variáveis são sequências simples e auto-explicáveis.
Após isso, foi dado o _build_ e _deploy_ da aplicação na AWS. 
Como não havia sido gerado um certificado para o protocolo https, sendo a primeira transação com o serviço Let's Encrypt diferente das demais, foi necessário se entrar "manualmente" na instância da AWS EC2 e se fazer o seguinte:
- 1. Editar o arquivo docker-compose.prod.yml

Substituindo --staging por --force-renewal em:
```
certonly --webroot --webroot-path=/var/www/html --email ${EMAIL} --agree-tos --no-eff-email --staging -d ${DOMAIN}
```
E logo em seguida executando o comando:
docker compose  --env-file .env.production -f docker-compose.prod.yml up -d --force-recreate --no-deps certbot

- 2. Atualizar o arquivo de configuração do Nginx

Edite manualmente o arquivo nginx-conf/nginx.conf para a versão SSL.
```
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
Após isso, o serviço foi reiniciado manualmente:
```
docker compose --env-file .env.production  -f docker-compose.prod.yml up -d --force-recreate --no-deps webserver
```

- 3. Atualizar, no Github secrets, as seguintes variáveis:
    - DOCKER_COMPOSE_PROD_CONTENT_HTTPS
    - NGINX_CONF_CONTENT
A variável `DOCKER_COMPOSE_PROD_CONTENT_HTTPS` passa a ter o seguinte conteúdo:
```
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
    command: certonly --webroot --webroot-path=/var/www/html --email ${EMAIL} --agree-tos --no-eff-email --force-renewal -d ${DOMAIN}

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
E a variável `NGINX_CONF_CONTENT` foi inserida no Github secrets com o seguinte conteúdo:
```
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


