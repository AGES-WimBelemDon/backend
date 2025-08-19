# Projeto WDB

Este documento descreve os passos necessários para configurar e executar
o ambiente de desenvolvimento do projeto utilizando **Docker** e
**Docker Compose**.

------------------------------------------------------------------------

## Índice

1.  [Requisitos](#requisitos)
2.  [Configurando o ambiente de
    desenvolvimento](#configurando-o-ambiente-de-desenvolvimento)
    -   [Windows (WSL2 + Ubuntu 24.04)](#windows)
3.  [Instalação do ambiente de
    desenvolvimento](#instalação-do-ambiente-de-desenvolvimento)
4.  [Iniciando o projeto pela primeira
    vez](#iniciando-o-projeto-pela-primeira-vez)
5.  [Comandos no Docker Compose](#comandos-no-docker-compose)
6.  [Iniciando e parando containers
    individualmente](#iniciando-e-parando-containers-individualmente)
7.  [Debug - Visualizando logs da
    aplicação](#debug---visualizando-os-logs-da-aplicação)

------------------------------------------------------------------------

## Requisitos

-   Docker
-   Docker Compose

------------------------------------------------------------------------

## Configurando o ambiente de desenvolvimento

### Windows

Se o seu sistema operacional for **Windows 10 ou 11**, siga os passos
abaixo:

#### **PASSO 1: Instalação do WSL2 e da Distribuição Ubuntu 24.04**

1.  **Abra o PowerShell como Administrador:**\
    Pesquise por "PowerShell" no menu Iniciar, clique com o botão
    direito e selecione **Executar como administrador**.

2.  **Instale o WSL e o Ubuntu 24.04:**\
    Execute o comando:

    ``` powershell
    wsl --install -d Ubuntu-24.04
    ```

#### **PASSO 2: Download e Instalação do Docker Desktop**

1.  **Baixe o instalador:**\
    [Docker Desktop para
    Windows](https://www.docker.com/products/docker-desktop)
2.  **Durante a instalação:**\
    Certifique-se de que a opção **"Use WSL 2 instead of Hyper-V
    (recommended)"** esteja marcada.

#### **PASSO 3: Habilitando a Integração do Docker com o Ubuntu 24.04**

1.  Abra o **Docker Desktop**.
2.  Vá em **Settings → Resources → WSL Integration**.
3.  Ative a integração com **Ubuntu-24.04**.
4.  Clique em **Apply & Restart**.

#### **PASSO 4: Verificando a instalação**

No terminal Ubuntu 24.04, execute:

``` bash
docker --version
docker compose version
```

------------------------------------------------------------------------

## Instalação do ambiente de desenvolvimento

1. Clone o repositório:

``` bash
git clone https://github.com/AGES-WimBelemDon/backend.git
```

2.  Acesse o diretório do projeto

``` sh
cd backend
```

3.  Verifique e configure as credenciais do git para o projeto. Utilize o seu e-mail da PUC-RS.

``` sh
git config user.name "Seu Nome"
git config user.email seu_email@exemplo.com
```
------------------------------------------------------------------------

## Iniciando o projeto pela primeira vez

Na raiz do projeto (`backend`), crie o arquivo `.env.development` com o seguinte
conteúdo:

``` yaml
DATABASE_URL="postgresql://admin:admin@db-wdb:5432/wdb_database?schema=public"
NODE_ENV="development"
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=wdb_database
```
Com o Docker Desktop rodando (ou seja, como ele aberto), rode:

``` bash
docker-compose up --build -d
```

Dois containers serão iniciados:
- **api-wdb** (API da aplicação)
- **db-wdb** (Banco de dados Postgres)

Verifique os containers que estão rodando com:

``` bash
docker ps
```

Depois, execute:

``` bash
docker compose exec api-wdb yarn prisma migrate deploy
```

Isso aplicará as migrações no banco.

------------------------------------------------------------------------

## Comandos no Docker Compose

### **`docker-compose up -d --build`**

Usar quando: - iniciar o projeto pela primeira vez; - houver alterações
no `docker-compose.yml`; - precisar reiniciar o projeto; - após executar
`docker-compose down`.

------------------------------------------------------------------------

### **`docker-compose down`**

Usar quando: - precisar parar e remover os containers;
- para remover também os volumes, usar: `bash   docker-compose down -v`

------------------------------------------------------------------------

### **`docker-compose start`**

-   Reinicia containers parados.
-   Útil para liberar RAM e CPU temporariamente sem perder estado.

------------------------------------------------------------------------

### **`docker-compose stop`**

-   Para containers em execução sem removê-los.
-   Também pode ser usado para liberar recursos temporariamente.

------------------------------------------------------------------------

## Iniciando e parando containers individualmente

É possível parar ou iniciar apenas um container específico:

``` bash
docker-compose stop api-wdb
```

------------------------------------------------------------------------

## Debug - Visualizando os logs da aplicação

Para acompanhar os logs em tempo real da aplicação:

``` bash
docker compose logs -f api-wdb
```
