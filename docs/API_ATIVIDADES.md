# API de Atividades

Esta documentacao descreve como criar, listar e atualizar atividades no catalogo utilizado pelas turmas.

## Endpoints

### POST /activities
Cria uma nova atividade.

#### Request
```json
{
  "name": "Esporte"
}
```

#### Resposta de sucesso (201 Created)
```json
{
  "id": 1,
  "name": "Esporte"
}
```

#### Erros possiveis
- `400 Bad Request` - campo `name` ausente, vazio ou somente espacos.
- `409 Conflict` - ja existe uma atividade com o mesmo `name`.

#### Exemplos de teste
```bash
# Fluxo ideal
curl -X POST http://localhost:3000/activities \
  -H "Content-Type: application/json" \
  -d '{ "name": "Esporte" }'

# Nome duplicado
curl -X POST http://localhost:3000/activities \
  -H "Content-Type: application/json" \
  -d '{ "name": "Esporte" }'

# Nome invalido
curl -X POST http://localhost:3000/activities \
  -H "Content-Type: application/json" \
  -d '{ "name": "   " }'
```

#### BDD
- **Scenario - Successful Create**  
  Given um payload com `"name": "Esporte"`  
  When o cliente envia `POST /activities`  
  Then o sistema cria a atividade e retorna `201` com `{ id, name }`

- **Scenario - Duplicate Name**  
  Given ja existe uma atividade `"Esporte"`  
  When envia `POST /activities` com `"name": "Esporte"`  
  Then retorna `409 Conflict`

- **Scenario - Invalid Name**  
  Given um payload com `"name": " "`  
  When envia `POST /activities`  
  Then retorna `400 Bad Request`

---

### GET /activities
Lista todas as atividades cadastradas.

#### Resposta de sucesso (200 OK)
```json
[
  { "id": 1, "name": "Esporte" },
  { "id": 2, "name": "Artes" }
]
```

#### BDD
- **Scenario - List All**  
  Given existem atividades cadastradas  
  When chama `GET /activities`  
  Then retorna `200` com a lista de `{ id, name }`

---

### PATCH /activities/{id}
Atualiza uma atividade existente.

#### Request
```json
{
  "name": "Esportes"
}
```

#### Resposta de sucesso (200 OK)
```json
{
  "id": 1,
  "name": "Esportes"
}
```

#### Erros possiveis
- `400 Bad Request` - campo `name` ausente, vazio ou somente espacos.
- `404 Not Found` - atividade com o `id` informado nao existe.
- `409 Conflict` - nome ja utilizado por outra atividade.

#### Exemplos de teste
```bash
# Atualizacao bem-sucedida
curl -X PATCH http://localhost:3000/activities/1 \
  -H "Content-Type: application/json" \
  -d '{ "name": "Esportes" }'

# Nome duplicado
curl -X PATCH http://localhost:3000/activities/1 \
  -H "Content-Type: application/json" \
  -d '{ "name": "Artes" }'

# Nome invalido
curl -X PATCH http://localhost:3000/activities/1 \
  -H "Content-Type: application/json" \
  -d '{ "name": "   " }'
```

#### BDD
- **Scenario - Successful Update**  
  Given existe `Activity(id=1, name="Esporte")`  
  When envia `PATCH /activities/1` com `{ "name": "Esportes" }`  
  Then retorna `200` com `{ "id": 1, "name": "Esportes" }`

- **Scenario - Duplicate Name**  
  Given ja existe outra `Activity(name="Artes")`  
  When atualiza `Activity(id=1)` para `{ "name": "Artes" }`  
  Then retorna `409 Conflict`

- **Scenario - Invalid Name**  
  Given `Activity(id=1)`  
  When envia `{ "name": " " }`  
  Then retorna `400 Bad Request`

---

## Documentacao Swagger
Depois de iniciar o servidor, a documentacao interativa fica disponivel em `http://localhost:3000/docs`.
