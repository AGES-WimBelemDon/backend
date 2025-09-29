# API de Cadastro de Alunos

Esta documentação descreve como usar a API para cadastro de educandos no sistema WimBelemDon+.

## Endpoints

### POST /alunos
Cadastra um novo aluno no sistema.

## FirebaseAuthGuard e @ApiBearerAuth Desabilitados

### Acessar: 
http://localhost:3000/docs#

#### Cenários de Teste

**1. Fluxo Ideal (201 Created)**
```bash
curl -X POST http://localhost:3000/alunos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token-firebase>" \
  -d '{
    "fullName": "João Silva Santos",
    "registrationNumber": "12345678901",
    "dateOfBirth": "2010-05-15",
    "socialName": "João"
  }'
```

**2. CPF já cadastrado (409 Conflict)**
```bash
curl -X POST http://localhost:3000/alunos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token-firebase>" \
  -d '{
    "fullName": "Maria Santos",
    "registrationNumber": "12345678901",
    "dateOfBirth": "2012-03-20"
  }'
```

**3. Dados inválidos (400 Bad Request)**
```bash
# CPF inválido
curl -X POST http://localhost:3000/alunos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token-firebase>" \
  -d '{
    "fullName": "Pedro Silva",
    "registrationNumber": "123456789",
    "dateOfBirth": "2011-08-10"
  }'

# Campo obrigatório ausente
curl -X POST http://localhost:3000/alunos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token-firebase>" \
  -d '{
    "registrationNumber": "98765432100",
    "dateOfBirth": "2011-08-10"
  }'
```

### GET /alunos
Lista todos os alunos ativos do sistema.

```bash
curl -X GET http://localhost:3000/alunos \
  -H "Authorization: Bearer <seu-token-firebase>"
```

### GET /alunos/:id
Busca um aluno específico por ID.

```bash
curl -X GET http://localhost:3000/alunos/1 \
  -H "Authorization: Bearer <seu-token-firebase>"
```

### GET /alunos/cpf/:registrationNumber
Busca um aluno por CPF.

```bash
curl -X GET http://localhost:3000/alunos/cpf/12345678901 \
  -H "Authorization: Bearer <seu-token-firebase>"
```

## Validações Implementadas

### CPF (registrationNumber)
- Deve conter exatamente 11 dígitos numéricos
- Validação matemática dos dígitos verificadores
- Não permite CPFs com todos os dígitos iguais (ex: 11111111111)
- Deve ser único no sistema

### Nome Completo (fullName)
- Campo obrigatório
- Mínimo 2 caracteres
- Máximo 100 caracteres

### Data de Nascimento (dateOfBirth)
- Formato: YYYY-MM-DD
- Não pode ser futura
- Campo opcional

### Nome Social (socialName)
- Campo opcional
- Máximo 50 caracteres

## Respostas da API

### Sucesso (201 Created)
```json
{
  "id": 1,
  "fullName": "João Silva Santos",
  "registrationNumber": "12345678901",
  "dateOfBirth": "2010-05-15T00:00:00.000Z",
  "socialName": "João",
  "enrollmentDate": "2025-09-07T15:30:00.000Z",
  "status": "ATIVO"
}
```

### Erro de Validação (400 Bad Request)
```json
{
  "statusCode": 400,
  "message": [
    "Nome completo é obrigatório",
    "CPF deve conter exatamente 11 dígitos numéricos"
  ],
  "error": "Bad Request"
}
```

### CPF Duplicado (409 Conflict)
```json
{
  "statusCode": 409,
  "message": "CPF já está em uso",
  "error": "Conflict"
}
```

### Erro Interno (500 Internal Server Error)
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Documentação Swagger

Após subir o servidor, acesse a documentação interativa em:
`http://localhost:3000/docs`

## Autenticação

Todas as rotas requerem autenticação via Firebase. Inclua o token no header:
```
Authorization: Bearer <seu-token-jwt>
```

Para obter o token, use o arquivo `get_token.html` conforme instruções no README principal.

## 🚀 Como Testar Passo a Passo

### **Passo 1: Obter Token de Autenticação**

1. Abra o arquivo `get_token.html` em um navegador
2. Faça login com sua conta Google
3. Copie o token JWT que aparecerá na tela

### **Passo 2: Testar com Swagger (Mais Fácil)**

1. **Acesse:** `http://localhost:3000/docs`
2. **Clique em "Authorize"** (cadeado no canto superior direito)
3. **Cole seu token** no campo "Value" (sem "Bearer ")
4. **Clique em "Authorize"**
5. **Teste os endpoints** diretamente na interface

### **Passo 3: Testar com curl (Terminal)**

**Substitua `<SEU_TOKEN>` pelo token obtido no Passo 1:**

#### Teste 1: Cadastrar um aluno (Sucesso)
```bash
curl -X POST http://localhost:3000/alunos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SEU_TOKEN>" \
  -d '{
    "fullName": "João Silva Santos",
    "registrationNumber": "12345678901",
    "dateOfBirth": "2010-05-15",
    "socialName": "João"
  }'
```

#### Teste 2: CPF inválido (Erro 400)
```bash
curl -X POST http://localhost:3000/alunos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SEU_TOKEN>" \
  -d '{
    "fullName": "Pedro Silva",
    "registrationNumber": "123",
    "dateOfBirth": "2011-08-10"
  }'
```

#### Teste 3: CPF duplicado (Erro 409)
```bash
curl -X POST http://localhost:3000/alunos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SEU_TOKEN>" \
  -d '{
    "fullName": "Maria Santos",
    "registrationNumber": "12345678901",
    "dateOfBirth": "2012-03-20"
  }'
```

#### Teste 4: Campo obrigatório ausente (Erro 400)
```bash
curl -X POST http://localhost:3000/alunos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SEU_TOKEN>" \
  -d '{
    "registrationNumber": "98765432100",
    "dateOfBirth": "2011-08-10"
  }'
```

#### Teste 5: Listar todos os alunos
```bash
curl -X GET http://localhost:3000/alunos \
  -H "Authorization: Bearer <SEU_TOKEN>"
```

### **Passo 4: Testar com Postman/Insomnia**

1. **Importe a coleção** do Swagger: `http://localhost:3000/docs-json`
2. **Configure Authentication**: Bearer Token
3. **Cole seu token** no campo Authorization
4. **Execute os testes**

### **Passo 5: Verificar Logs (Opcional)**

Para ver logs em tempo real:
```bash
docker compose logs -f api-wbd
```

### **CPFs Válidos para Teste**

Use estes CPFs válidos para seus testes:
- `11144477735`
- `12345678909`
- `98765432100`
- `11122233344`
- `55566677788`

### **Cenários de Teste Completos**

| Teste | Campo | Valor | Resultado Esperado |
|-------|-------|-------|-------------------|
| ✅ Sucesso | fullName: "João Silva", registrationNumber: "11144477735" | 201 Created |
| ❌ CPF inválido | registrationNumber: "123" | 400 Bad Request |
| ❌ Nome ausente | fullName: "" | 400 Bad Request |
| ❌ CPF duplicado | Mesmo CPF duas vezes | 409 Conflict |
| ❌ Data futura | dateOfBirth: "2030-01-01" | 400 Bad Request |

### **Dicas de Troubleshooting**

- **401 Unauthorized**: Token expirado ou inválido
- **403 Forbidden**: Token não tem permissões
- **500 Internal Server Error**: Verifique se o banco está rodando
- **404 Not Found**: Verifique se a URL está correta
