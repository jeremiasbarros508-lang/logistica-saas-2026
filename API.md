# 📡 API Reference — Logística SaaS

## Índice

- [Overview](#-overview)
- [Autenticação](#-autenticação)
- [Auth Endpoints](#-auth-endpoints)
- [Companies](#-companies)
- [Deliveries](#-deliveries)
- [Routes](#-routes)
- [Vehicles](#-vehicles)
- [Drivers](#-drivers)
- [Dashboard](#-dashboard)
- [Maps](#-maps)
- [Error Codes](#-error-codes)
- [Rate Limiting](#-rate-limiting)

---

## 🌐 Overview

**Base URL (desenvolvimento):** `http://localhost:8000/api/v1`

**Formatos:**
- Requisições: `Content-Type: application/json`
- Respostas: JSON

**Documentação interativa:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 🔐 Autenticação

A API usa **JWT (JSON Web Tokens)**. Todos os endpoints (exceto `/auth/register` e `/auth/login`) exigem autenticação.

### Como autenticar

1. Faça login em `POST /auth/login` para obter os tokens
2. Use o `access_token` no header `Authorization: Bearer <token>`
3. Quando o access token expirar (15 min), use o `refresh_token` em `POST /auth/refresh`

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔑 Auth Endpoints

### POST `/auth/register`

Registra uma nova empresa e usuário administrador.

**Request:**
```json
{
  "company_name": "Transportadora ABC",
  "name": "João Silva",
  "email": "joao@transportadoraabc.com",
  "password": "MinhaS3nh@Segura"
}
```

**Response `201 Created`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### POST `/auth/login`

Autentica um usuário existente.

**Request:**
```json
{
  "email": "joao@transportadoraabc.com",
  "password": "MinhaS3nh@Segura"
}
```

**Response `200 OK`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### POST `/auth/refresh`

Renova os tokens usando o refresh token.

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response `200 OK`:** Mesmo formato do login.

---

### POST `/auth/logout`

Invalida os tokens do usuário atual. Requer autenticação.

**Response `200 OK`:**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

## 🏢 Companies

### GET `/companies/me`

Retorna os dados da empresa do usuário autenticado.

**Response `200 OK`:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Transportadora ABC",
  "cnpj": "11.222.333/0001-81",
  "email": "contato@transportadoraabc.com",
  "phone": "(11) 99999-9999",
  "created_at": "2026-01-15T10:00:00Z"
}
```

---

### PUT `/companies/me`

Atualiza os dados da empresa.

**Request:**
```json
{
  "name": "Transportadora ABC Ltda",
  "phone": "(11) 98888-8888"
}
```

**Response `200 OK`:** Dados atualizados da empresa.

---

## 📦 Deliveries

### GET `/deliveries/`

Lista todas as entregas da empresa com paginação.

**Query Parameters:**
| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `page` | int | 1 | Página atual |
| `page_size` | int | 20 | Itens por página (máx. 100) |
| `status` | string | null | Filtrar por status |

**Status disponíveis:** `pending`, `in_route`, `delivered`, `problem`

**Response `200 OK`:**
```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "recipient_name": "Maria Santos",
      "recipient_phone": "(11) 97777-7777",
      "address": "Rua das Flores, 123 - São Paulo, SP",
      "latitude": -23.5505,
      "longitude": -46.6333,
      "weight_kg": 5.5,
      "deadline": "2026-01-20T18:00:00Z",
      "status": "pending",
      "notes": "Entregar no período da manhã",
      "created_at": "2026-01-15T10:00:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "page_size": 20,
  "total_pages": 8
}
```

---

### POST `/deliveries/`

Cria uma nova entrega.

**Request:**
```json
{
  "recipient_name": "Maria Santos",
  "recipient_phone": "(11) 97777-7777",
  "address": "Rua das Flores, 123 - São Paulo, SP",
  "latitude": -23.5505,
  "longitude": -46.6333,
  "weight_kg": 5.5,
  "deadline": "2026-01-20T18:00:00Z",
  "notes": "Entregar no período da manhã"
}
```

**Response `201 Created`:** Objeto da entrega criada.

---

### GET `/deliveries/{id}`

Retorna uma entrega específica.

**Response `200 OK`:** Objeto da entrega.

---

### PUT `/deliveries/{id}`

Atualiza uma entrega.

**Request:** Campos a atualizar (todos opcionais).

**Response `200 OK`:** Entrega atualizada.

---

### DELETE `/deliveries/{id}`

Remove uma entrega.

**Response `204 No Content`**

---

### POST `/deliveries/import`

Importa entregas em massa via CSV.

**Request:** `multipart/form-data` com arquivo CSV.

**Formato do CSV:**
```csv
recipient_name,recipient_phone,address,latitude,longitude,weight_kg,deadline
Maria Santos,(11)97777-7777,"Rua das Flores, 123 - SP",-23.5505,-46.6333,5.5,2026-01-20
```

**Response `200 OK`:**
```json
{
  "imported": 45,
  "errors": 2,
  "error_details": ["Linha 3: latitude inválida", "Linha 7: deadline no passado"]
}
```

---

## 🗺️ Routes

### GET `/routes/`

Lista todas as rotas com paginação.

**Query Parameters:** `page`, `page_size`, `status`

**Status disponíveis:** `pending`, `processing`, `optimized`, `in_progress`, `completed`, `cancelled`

**Response `200 OK`:**
```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Rota Centro SP - 2026-01-20",
      "status": "optimized",
      "vehicle_id": "...",
      "driver_id": "...",
      "total_distance_km": 45.3,
      "total_deliveries": 12,
      "optimization_score": 87.5,
      "waypoints": [...],
      "created_at": "2026-01-15T10:00:00Z"
    }
  ],
  "total": 30,
  "page": 1,
  "page_size": 20,
  "total_pages": 2
}
```

---

### POST `/routes/`

Cria uma nova rota (sem otimização).

**Request:**
```json
{
  "name": "Rota Centro SP - 2026-01-20",
  "vehicle_id": "550e8400-e29b-41d4-a716-446655440010",
  "driver_id": "550e8400-e29b-41d4-a716-446655440011",
  "delivery_ids": [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440003"
  ]
}
```

**Response `201 Created`:** Objeto da rota criada.

---

### POST `/routes/{id}/optimize`

Otimiza uma rota usando Nearest Neighbor + 2-Opt.

**Response `202 Accepted`:**
```json
{
  "task_id": "celery-task-id-aqui",
  "message": "Otimização iniciada. Verifique o status em /routes/{id}"
}
```

A otimização é assíncrona. Monitore o status da rota consultando `GET /routes/{id}`.

---

### GET `/routes/{id}`

Retorna os detalhes de uma rota, incluindo waypoints otimizados.

**Response `200 OK`:**
```json
{
  "id": "...",
  "name": "Rota Centro SP",
  "status": "optimized",
  "total_distance_km": 45.3,
  "total_deliveries": 12,
  "optimization_score": 87.5,
  "waypoints": [
    {
      "order": 1,
      "delivery_id": "...",
      "latitude": -23.5505,
      "longitude": -46.6333,
      "estimated_arrival": "2026-01-20T09:00:00Z"
    }
  ]
}
```

---

### PUT `/routes/{id}`

Atualiza uma rota.

---

### DELETE `/routes/{id}`

Remove uma rota.

---

## 🚗 Vehicles

### GET `/vehicles/`

Lista todos os veículos.

**Response `200 OK`:**
```json
{
  "items": [
    {
      "id": "...",
      "name": "VUC-001",
      "plate": "ABC-1234",
      "type": "van",
      "capacity_kg": 1000.0,
      "is_active": true
    }
  ],
  "total": 10,
  "page": 1,
  "page_size": 20,
  "total_pages": 1
}
```

---

### POST `/vehicles/`

Cria um novo veículo.

**Request:**
```json
{
  "name": "VUC-001",
  "plate": "ABC-1234",
  "type": "van",
  "capacity_kg": 1000.0
}
```

**Tipos disponíveis:** `motorcycle`, `car`, `van`, `truck`

---

### GET `/vehicles/{id}` / `PUT /vehicles/{id}` / `DELETE /vehicles/{id}`

Operações CRUD padrão.

---

## 👷 Drivers

### GET `/drivers/`

Lista todos os motoristas.

**Response `200 OK`:**
```json
{
  "items": [
    {
      "id": "...",
      "name": "Carlos Souza",
      "cpf": "123.456.789-00",
      "cnh": "12345678901",
      "cnh_category": "B",
      "phone": "(11) 96666-6666",
      "is_active": true
    }
  ]
}
```

---

### POST `/drivers/`

Cadastra um novo motorista.

**Request:**
```json
{
  "name": "Carlos Souza",
  "cpf": "123.456.789-00",
  "cnh": "12345678901",
  "cnh_category": "B",
  "phone": "(11) 96666-6666"
}
```

**Categorias CNH disponíveis:** `A`, `B`, `C`, `D`, `E`, `AB`, `AC`, `AD`, `AE`

---

### GET `/drivers/{id}` / `PUT /drivers/{id}` / `DELETE /drivers/{id}`

Operações CRUD padrão.

---

## 📊 Dashboard

### GET `/dashboard/kpis`

Retorna os principais KPIs da empresa.

**Response `200 OK`:**
```json
{
  "deliveries": {
    "total": 1250,
    "pending": 85,
    "in_route": 42,
    "delivered": 1100,
    "problem": 23
  },
  "routes": {
    "total": 320,
    "completed": 295,
    "processing": 3
  },
  "vehicles": {
    "total": 15,
    "active": 12
  },
  "drivers": {
    "total": 18,
    "active": 15
  }
}
```

---

### GET `/dashboard/metrics`

Retorna métricas de eficiência.

**Response `200 OK`:**
```json
{
  "avg_route_distance_km": 38.7,
  "avg_optimization_score": 84.2
}
```

---

## 🗾 Maps

### GET `/maps/route/{id}`

Retorna os dados de rota no formato compatível com Google Maps Directions API.

**Response `200 OK`:**
```json
{
  "origin": {
    "lat": -23.5489,
    "lng": -46.6388
  },
  "waypoints": [
    {"lat": -23.5505, "lng": -46.6333},
    {"lat": -23.5621, "lng": -46.6558}
  ],
  "destination": {
    "lat": -23.5489,
    "lng": -46.6388
  }
}
```

---

## ❌ Error Codes

Todos os erros seguem o formato padrão:

```json
{
  "detail": "Mensagem descritiva do erro",
  "code": "ERROR_CODE"
}
```

| HTTP Status | Código | Descrição |
|-------------|--------|-----------|
| `400` | `VALIDATION_ERROR` | Dados de entrada inválidos |
| `401` | `UNAUTHORIZED` | Token ausente ou inválido |
| `401` | `TOKEN_EXPIRED` | Token expirado |
| `403` | `FORBIDDEN` | Sem permissão para o recurso |
| `404` | `NOT_FOUND` | Recurso não encontrado |
| `409` | `CONFLICT` | Conflito (ex: email já cadastrado) |
| `422` | `UNPROCESSABLE_ENTITY` | Entidade não processável |
| `429` | `RATE_LIMIT_EXCEEDED` | Muitas requisições |
| `500` | `INTERNAL_ERROR` | Erro interno do servidor |

---

## ⚡ Rate Limiting

| Endpoint | Limite |
|----------|--------|
| `POST /auth/login` | 10 req/minuto por IP |
| `POST /auth/register` | 5 req/minuto por IP |
| Demais endpoints | 100 req/minuto por usuário |

Ao exceder o limite, a resposta será `429 Too Many Requests` com o header `Retry-After` indicando quando tentar novamente.
