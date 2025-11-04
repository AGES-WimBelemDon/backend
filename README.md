# Projeto WimBelemDon+ - backend

Este documento descreve os passos necessários para configurar e executar
o ambiente de desenvolvimento do projeto utilizando **Docker** e
**Docker Compose**.

------------------------------------------------------------------------

## Índice

1.  [Tecnologias utilizadas](#tecnologias-utilizadas)
2.  [Clonando o repositório](#clonando-o-repositório)
3.  [Configuração ambiente de desenvolvimento - OPÇÃO 1 - Windows (nativo)](#configuração-ambiente-de-desenvolvimento---opção-1---windows-nativo)

4. [Configuração ambiente de desenvolvimento - OPÇÃO 2 - Windows(WSL2 + Ubuntu 24.04)](#configuração-ambiente-de-desenvolvimento---opção-2---windowswsl2--ubuntu-2404)

5.  [Comandos no Docker Compose](#comandos-no-docker-compose)
6.  [Iniciando e parando containers
    individualmente](#iniciando-e-parando-containers-individualmente)
7.  [Debug - Visualizando logs da
    aplicação](#debug---visualizando-os-logs-da-aplicação)
8.  [Autenticação pelo Firebase](#autenticação-pelo-firebase)

------------------------------------------------------------------------

## Tecnologias utilizadas

-   Docker
-   Docker Compose
-   Yarn
-   Prisma
-   Node.js (v. 22.18.0)

## Clonando o repositório

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
------------------------------------------------------------------------
## Configuração ambiente de desenvolvimento - OPÇÃO 1 - Windows (nativo)

### Passo 1: Download e Instalação do Docker Desktop
1.  **Baixe o instalador:**\
    [Docker Desktop para
    Windows](https://www.docker.com/products/docker-desktop)
2.  **Durante a instalação:**\
    Certifique-se de que a opção **"Use WSL 2 instead of Hyper-V
    (recommended)"** esteja marcada.
3. **Verifique a instalação do Docker e Docker Compose:**
``` bash
docker --version
docker-compose version
```

Como resultado algo semelhante ao que segue abaixo será apresentado no terminal:
```
Docker version 28.3.0, build xxxx
```
E
```
docker-compose version 1.29.2, build xxxx
```
### Passo 2: Download do nvm para Windows
1. Verifique se o nvm já está instalado:
    ```
    nvm version
    ```
    Se não estiver, faça o download e a instalação do nvm para Windows, siga os passos abaixo:

2. Acesse o repositório oficial do nvm-windows no GitHub:
https://github.com/coreybutler/nvm-windows/releases

3. Baixe o arquivo instalador:
- Procure pelo arquivo nvm-setup.exe (ex: nvm-setup.exe).
4. Verifique se o NVM foi instalado corretamente
- Abra o Prompt de Comando e digite:
    ```
    nvm version
    ```
    Você deverá ver algo como:
    ```
    1.1.12
    ```

### Passo 3: Instale versões específicas do Node.js
Instale a versão 22.18.0 do Node.js
```
nvm install 22.18.0
```
Uma mensagem de sucesso deve aparecer, indicando que a versão foi instalada corretamente.
A versão instalada pode ser ativada com o comando:
```
nvm use 22.18.0
```
### Passo 4: Instale o Yarn
1. Verifique se o Yarn já está instalado:
```
yarn --version
```
2. Se não estiver, faça a instalação:
```
npm install -g yarn
```

### Iniciando o projeto pela primeira vez com Windows (nativo)

1. Na raiz do projeto (`backend`), crie o arquivo `.env.development` com o seguinte
conteúdo:

    ``` yaml
    DATABASE_URL="postgresql://admin:admin@localhost:5432/wbd_database?schema=public"
    NODE_ENV="development"
    POSTGRES_USER=admin
    POSTGRES_PASSWORD=admin
    POSTGRES_DB=wbd_database
    DEV_ROLE=teacher
    DEV_ROLE_OVERRIDE=false
    FIREBASE_PROJECT_ID="your-project-id"
    FIREBASE_CLIENT_EMAIL="firebase-adminsdk-...@your-project-id.iam.gserviceaccount.com"
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...your-private-key...\n-----END PRIVATE KEY-----\n"
    ```
    > O valor das variáveis relacionadas ao Firebase serão disponibilizados através de um canal privado. A variável `FIREBASE_PRIVATE_KEY` não deve ser compartilhada.

As variáveis DEV_ são utilizadas para facilitar o teste em ambiente de desenvolvimento, permitindo a simulação de diferentes papéis de usuário sem a necessidade de atualizar o banco. Ainda é necessário fazer o login com um usuário válido.

1. Com o Docker Desktop rodando (ou seja, com ele aberto), rode:

    ``` bash
    docker-compose up --build -d db-wbd
    ```

    Um container será iniciado:
    - **db-wbd** (Banco de dados Postgres)

    Verifique os containers que estão rodando com:

    ``` bash
    docker ps
    ```
2. Instale as dependências do projeto:

    ``` bash
    yarn install
    ```
3. Gere o cliente Prisma:

    ```bash
    yarn prisma generate
    ```
4. Realize as migrações do banco de dados:

    ```bash
    yarn prisma:migrate:deploy
    ```
5. Inicie a aplicação:
    ```bash
    yarn start:dev
    ```
6. Acesse a aplicação:
   - A API estará disponível em `http://localhost:3000/`.
   - A documentação Swagger estará disponível em `http://localhost:3000/docs`.

------------------------------------------------------------------------
## Configuração ambiente de desenvolvimento - OPÇÃO 2 - Windows(WSL2 + Ubuntu 24.04)

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
docker-compose version
```

Como resultado algo semelhante ao que segue abaixo será apresentado no terminal:
```
Docker version 28.3.0, build xxxx
```
E
```
docker-compose version 1.29.2, build xxxx
```

------------------------------------------------------------------------

### Instalação do ambiente de desenvolvimento
O repositório deve ser clonado dentro do Ubuntu (WSL2), e não no PowerShell ou CMD. Por isso, abra o Ubuntu (WSL2) a partir da linha de comando do Windows. No PowerShell ou Prompt de Comando (CMD), execute:

    wsl -d Ubuntu-24.04

Isso abrirá um terminal Linux (Ubuntu 24.04) dentro do WSL2.

### Iniciando o projeto pela primeira vez

1. Na raiz do projeto (`backend`), crie o arquivo `.env.development` com o seguinte
conteúdo:

    ``` yaml
    DATABASE_URL="postgresql://admin:admin@db-wbd:5432/wbd_database?schema=public"
    NODE_ENV="development"
    POSTGRES_USER=admin
    POSTGRES_PASSWORD=admin
    POSTGRES_DB=wbd_database
    DEV_ROLE=teacher
    DEV_ROLE_OVERRIDE=false
    FIREBASE_PROJECT_ID="your-project-id"
    FIREBASE_CLIENT_EMAIL="firebase-adminsdk-...@your-project-id.iam.gserviceaccount.com"
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...your-private-key...\n-----END PRIVATE KEY-----\n"
    ```
    > O valor das variáveis relacionadas ao Firebase serão disponibilizados através de um canal privado. A variável `FIREBASE_PRIVATE_KEY` não deve ser compartilhada.

As variáveis DEV_ são utilizadas para facilitar o teste em ambiente de desenvolvimento, permitindo a simulação de diferentes papéis de usuário sem a necessidade de atualizar o banco. Ainda é necessário fazer o login com um usuário válido.

2. Com o Docker Desktop rodando (ou seja, com ele aberto), rode:

    ``` bash
    docker-compose up --build -d
    ```

    Dois containers serão iniciados:
    - **api-wbd** (API da aplicação)
    - **db-wbd** (Banco de dados Postgres)

    Verifique os containers que estão rodando com:

    ``` bash
    docker ps
    ```

3. Depois, execute:

    ``` bash
    docker-compose exec api-wbd yarn prisma migrate deploy
    ```

    Isso aplicará as migrações no banco.

4. Acesse a aplicação:
   - A API estará disponível em `http://localhost:3000/`.
   - A documentação Swagger estará disponível em `http://localhost:3000/docs`.

------------------------------------------------------------------------
## Principais comandos no Docker Compose

#### - **`docker-compose up -d --build <nome_do_serviço>`**

Usar quando: 
- iniciar o projeto pela primeira vez; 
- houver alterações
no `docker-compose.yml`;
- precisar reiniciar o projeto; - após executar
`docker-compose down`.
OBS.: na opção Windows com WSL2, utilize o comando `docker-compose up -d --build` para reconstruir o projeto.
------------------------------------------------------------------------

#### - **`docker-compose down`**

Usar quando: - precisar parar e remover os containers;
- para remover também os volumes, usar: `bash   docker-compose down -v`

------------------------------------------------------------------------

#### - **`docker-compose start <nome_do_serviço>`**

-   Reinicia containers parados.
-   Útil para liberar RAM e CPU temporariamente sem perder estado.
OBS.: na opção Windows com WSL2, utilize o comando `docker-compose start` para reiniciar ambos os containers
------------------------------------------------------------------------

#### - **`docker-compose stop`**

-   Para containers em execução sem removê-los.
-   Também pode ser usado para liberar recursos temporariamente.

------------------------------------------------------------------------

## Iniciando e parando containers individualmente

É possível iniciar apenas um container específico:

``` bash
docker-compose start api-wbd
```
Ou então pare o container:

``` bash
docker-compose stop api-wbd
```
------------------------------------------------------------------------

## Debug - Visualizando os logs da aplicação

Para acompanhar os logs em tempo real da aplicação:

``` bash
docker-compose logs -f api-wbd
```


## Autenticação pelo Firebase
Quando uma rota ou controller é protegido com a classe FirebaseAuthGuard, como no exemplo abaixo:
```ts
@Get("endpoint")
@UseGuards(FirebaseAuthGuard)
@ApiOperation({ summary: "Protected route" })
get_protect(@Request() req: any) {
    const user = req.user;
    return user;
}
```
isso significa que, para acessá-la, será necessário enviar um ID token gerado pelo Firebase.

Para obter esse token, siga os passos:

1. Abra o arquivo get_token.html em um servidor HTTP local (por exemplo, utilizando a extensão Live Server no VSCode).

2. Faça login com sua conta do Google vinculada ao Firebase.

3. O Firebase retornará um token JWT, que poderá ser usado para acessar as rotas protegidas.

> Atenção: o token expira em aproximadamente 1 hora. Após esse período, será necessário gerar um novo.
