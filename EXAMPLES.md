# 📖 Exemplos Práticos — Logística SaaS 2026

Exemplos reais de como usar a API e o frontend do sistema.

> **Base URL**: `http://localhost:8000/api/v1`
> **Formato**: Todos os exemplos usam cURL e JavaScript (fetch)

---

## 📋 Índice

### API
1. [Autenticação](#-autenticação)
   - [Registrar Empresa](#registrar-empresa)
   - [Login](#login)
   - [Refresh Token](#refresh-token)
   - [Logout](#logout)
2. [Empresas](#-empresas)
3. [Entregas](#-entregas)
   - [Listar](#listar-entregas)
   - [Criar](#criar-entrega)
   - [Atualizar](#atualizar-entrega)
   - [Deletar](#deletar-entrega)
   - [Importar CSV](#importar-csv)
4. [Rotas](#-rotas)
   - [Gerar Rota Otimizada](#gerar-rota-otimizada)
   - [Listar](#listar-rotas)
   - [Detalhes](#detalhes-da-rota)
5. [Veículos](#-veículos)
6. [Motoristas](#-motoristas)
7. [Dashboard](#-dashboard)

### Frontend
8. [Exemplos de Frontend](#-exemplos-de-frontend)

---

## 🔐 Autenticação

### Registrar Empresa

Cria uma nova empresa e retorna o token JWT.

**cURL:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "TechLogistics Inc",
    "email": "admin@techlogistics.com",
    "password": "Admin@123456",
    "full_name": "Administrador"
  }'
```

**JavaScript:**
```js
const response = await fetch('http://localhost:8000/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    company_name: 'TechLogistics Inc',
    email: 'admin@techlogistics.com',
    password: 'Admin@123456',
    full_name: 'Administrador'
  })
});
const data = await response.json();
```

**Resposta (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "admin@techlogistics.com",
    "full_name": "Administrador",
    "role": "admin",
    "company_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Erros comuns:**
| Status | Erro | Solução |
|--------|------|---------|
| 409 | `Email already registered` | Use outro email ou faça login |
| 422 | `Password too weak` | Mínimo 8 chars, 1 maiúscula, 1 número, 1 especial |

---

### Login

**cURL:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@techlogistics.com",
    "password": "Admin@123456"
  }'
```

**JavaScript:**
```js
const response = await fetch('http://localhost:8000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@techlogistics.com',
    password: 'Admin@123456'
  })
});
const { access_token, refresh_token } = await response.json();

// Salvar token no localStorage
localStorage.setItem('access_token', access_token);
localStorage.setItem('refresh_token', refresh_token);
```

**Resposta (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

**Erros comuns:**
| Status | Erro | Solução |
|--------|------|---------|
| 401 | `Invalid credentials` | Verifique email e senha |
| 404 | `User not found` | Registre-se primeiro |

---

### Refresh Token

Use quando o `access_token` expirar (após 1 hora).

**cURL:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**JavaScript (com auto-refresh):**
```js
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');

  const response = await fetch('http://localhost:8000/api/v1/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });

  if (response.ok) {
    const { access_token } = await response.json();
    localStorage.setItem('access_token', access_token);
    return access_token;
  }

  // Refresh token expirou — redirecionar para login
  window.location.href = '/login';
}
```

---

### Logout

**cURL:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🏢 Empresas

### Obter Empresa Atual

```bash
curl -X GET http://localhost:8000/api/v1/companies/me \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "TechLogistics Inc",
  "email": "admin@techlogistics.com",
  "plan": "premium",
  "created_at": "2026-01-15T10:00:00Z",
  "settings": {
    "timezone": "America/Sao_Paulo",
    "currency": "BRL",
    "distance_unit": "km"
  }
}
```

---

## 📦 Entregas

### Listar Entregas

```bash
# Todas as entregas pendentes
curl -X GET "http://localhost:8000/api/v1/deliveries?status=pending&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Parâmetros de query:**
| Param | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `status` | string | Filtrar por status | `pending`, `in_progress`, `delivered`, `cancelled` |
| `priority` | string | Filtrar por prioridade | `low`, `medium`, `high`, `urgent` |
| `page` | int | Página (default: 1) | `1` |
| `limit` | int | Itens por página (max: 100) | `10` |
| `search` | string | Buscar por cliente/endereço | `João` |
| `date_from` | date | Data inicial | `2026-01-01` |
| `date_to` | date | Data final | `2026-12-31` |

**Resposta (200 OK):**
```json
{
  "items": [
    {
      "id": "delivery-uuid-001",
      "customer_name": "João Silva",
      "customer_phone": "(11) 99999-1111",
      "address": "Rua Augusta, 500 - Consolação, São Paulo, SP",
      "latitude": -23.5505,
      "longitude": -46.6333,
      "weight_kg": 15.5,
      "priority": "high",
      "status": "pending",
      "notes": "Entregar no portão lateral",
      "scheduled_date": "2026-01-20",
      "created_at": "2026-01-15T10:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10,
  "pages": 5
}
```

---

### Criar Entrega

```bash
curl -X POST http://localhost:8000/api/v1/deliveries \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Empresa ABC Ltda",
    "customer_phone": "(11) 3333-4444",
    "customer_email": "contato@empresaabc.com.br",
    "address": "Av. Faria Lima, 3000 - Itaim Bibi, São Paulo, SP",
    "address_complement": "Andar 10",
    "latitude": -23.5680,
    "longitude": -46.6918,
    "weight_kg": 25.0,
    "volume_m3": 0.5,
    "priority": "high",
    "notes": "Ligar antes de entregar",
    "scheduled_date": "2026-01-22"
  }'
```

**JavaScript:**
```js
const token = localStorage.getItem('access_token');

const delivery = await fetch('http://localhost:8000/api/v1/deliveries', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    customer_name: 'Empresa ABC Ltda',
    customer_phone: '(11) 3333-4444',
    address: 'Av. Faria Lima, 3000 - Itaim Bibi, São Paulo, SP',
    latitude: -23.5680,
    longitude: -46.6918,
    weight_kg: 25.0,
    priority: 'high',
    scheduled_date: '2026-01-22'
  })
}).then(r => r.json());

console.log('Entrega criada:', delivery.id);
```

**Resposta (201 Created):**
```json
{
  "id": "delivery-uuid-002",
  "customer_name": "Empresa ABC Ltda",
  "address": "Av. Faria Lima, 3000 - Itaim Bibi, São Paulo, SP",
  "status": "pending",
  "priority": "high",
  "created_at": "2026-01-16T14:30:00Z"
}
```

---

### Atualizar Entrega

```bash
curl -X PATCH http://localhost:8000/api/v1/deliveries/delivery-uuid-001 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "delivered",
    "notes": "Entregue com sucesso. Assinatura: João Silva"
  }'
```

---

### Deletar Entrega

```bash
curl -X DELETE http://localhost:8000/api/v1/deliveries/delivery-uuid-001 \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta (204 No Content)**

---

### Importar CSV

Importe múltiplas entregas de uma vez.

**Formato do CSV:**
```csv
customer_name,customer_phone,address,weight_kg,priority,notes
"João Silva","(11) 99999-1111","Rua Augusta 500, São Paulo",15.5,high,""
"Maria Santos","(11) 99999-2222","Av. Paulista 1000, São Paulo",8.0,medium,"Fragil"
"Pedro Oliveira","(11) 99999-3333","Rua Oscar Freire 200, São Paulo",30.0,low,""
```

**cURL:**
```bash
curl -X POST http://localhost:8000/api/v1/deliveries/import \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@entregas.csv"
```

**Resposta (200 OK):**
```json
{
  "imported": 3,
  "failed": 0,
  "errors": [],
  "deliveries": ["uuid-1", "uuid-2", "uuid-3"]
}
```

---

## 🗺️ Rotas

### Gerar Rota Otimizada

Este é o endpoint principal! Gera uma rota otimizada usando o algoritmo **Nearest Neighbor + 2-Opt**.

**cURL:**
```bash
curl -X POST http://localhost:8000/api/v1/routes/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "driver_id": "driver-uuid-001",
    "vehicle_id": "vehicle-uuid-001",
    "delivery_ids": [
      "delivery-uuid-001",
      "delivery-uuid-002",
      "delivery-uuid-003",
      "delivery-uuid-004"
    ],
    "start_location": {
      "latitude": -23.5505,
      "longitude": -46.6333,
      "address": "Depósito Central - Rua da Consolação, 1000, São Paulo"
    },
    "optimization": "distance"
  }'
```

**JavaScript:**
```js
const route = await fetch('http://localhost:8000/api/v1/routes/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    driver_id: 'driver-uuid-001',
    vehicle_id: 'vehicle-uuid-001',
    delivery_ids: ['delivery-uuid-001', 'delivery-uuid-002'],
    start_location: {
      latitude: -23.5505,
      longitude: -46.6333,
      address: 'Depósito Central'
    },
    optimization: 'distance'  // ou 'time'
  })
}).then(r => r.json());

console.log(`Rota gerada! ${route.total_distance_km} km, ~${route.estimated_duration_min} min`);
```

**Resposta (201 Created):**
```json
{
  "id": "route-uuid-001",
  "status": "optimized",
  "driver": {
    "id": "driver-uuid-001",
    "name": "João Silva"
  },
  "vehicle": {
    "id": "vehicle-uuid-001",
    "name": "Van 1",
    "plate": "ABC-1234"
  },
  "total_distance_km": 42.7,
  "estimated_duration_min": 95,
  "stops": [
    {
      "order": 1,
      "delivery_id": "delivery-uuid-003",
      "customer_name": "Pedro Oliveira",
      "address": "Rua Oscar Freire, 200 - Jardins, São Paulo",
      "latitude": -23.5621,
      "longitude": -46.6695,
      "estimated_arrival": "2026-01-20T09:15:00Z"
    },
    {
      "order": 2,
      "delivery_id": "delivery-uuid-001",
      "customer_name": "João Silva",
      "address": "Rua Augusta, 500 - Consolação, São Paulo",
      "latitude": -23.5505,
      "longitude": -46.6590,
      "estimated_arrival": "2026-01-20T09:45:00Z"
    },
    {
      "order": 3,
      "delivery_id": "delivery-uuid-002",
      "customer_name": "Empresa ABC",
      "address": "Av. Faria Lima, 3000 - Itaim Bibi, São Paulo",
      "latitude": -23.5680,
      "longitude": -46.6918,
      "estimated_arrival": "2026-01-20T10:30:00Z"
    }
  ],
  "created_at": "2026-01-20T08:00:00Z"
}
```

---

### Listar Rotas

```bash
curl -X GET "http://localhost:8000/api/v1/routes?status=active&date=2026-01-20" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Detalhes da Rota

```bash
curl -X GET http://localhost:8000/api/v1/routes/route-uuid-001 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🚐 Veículos

### Listar Veículos

```bash
curl -X GET http://localhost:8000/api/v1/vehicles \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta:**
```json
{
  "items": [
    {
      "id": "vehicle-uuid-001",
      "name": "Van 1",
      "plate": "ABC-1234",
      "type": "van",
      "capacity_kg": 1000,
      "volume_m3": 8.0,
      "fuel_consumption_km_l": 12.5,
      "status": "available",
      "current_driver_id": null
    }
  ],
  "total": 3
}
```

---

### Criar Veículo

```bash
curl -X POST http://localhost:8000/api/v1/vehicles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Van 3",
    "plate": "XYZ-9876",
    "type": "van",
    "capacity_kg": 800,
    "volume_m3": 6.0,
    "fuel_type": "flex",
    "fuel_consumption_km_l": 11.0,
    "year": 2023,
    "model": "Fiat Fiorino",
    "color": "Branco"
  }'
```

---

### Atualizar Veículo

```bash
curl -X PATCH http://localhost:8000/api/v1/vehicles/vehicle-uuid-001 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "maintenance",
    "notes": "Revisão de 20.000 km"
  }'
```

---

### Deletar Veículo

```bash
curl -X DELETE http://localhost:8000/api/v1/vehicles/vehicle-uuid-001 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 👨‍✈️ Motoristas

### Listar Motoristas

```bash
curl -X GET "http://localhost:8000/api/v1/drivers?status=available" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Criar Motorista

```bash
curl -X POST http://localhost:8000/api/v1/drivers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Carlos Eduardo Souza",
    "email": "carlos@empresa.com.br",
    "phone": "(11) 97777-5555",
    "cnh_number": "12345678901",
    "cnh_category": "B",
    "cnh_expiry": "2028-06-15",
    "notes": "Experiência em entregas urbanas"
  }'
```

**Resposta (201 Created):**
```json
{
  "id": "driver-uuid-004",
  "full_name": "Carlos Eduardo Souza",
  "email": "carlos@empresa.com.br",
  "phone": "(11) 97777-5555",
  "cnh_category": "B",
  "status": "available",
  "created_at": "2026-01-16T15:00:00Z"
}
```

---

### Atualizar Motorista

```bash
curl -X PATCH http://localhost:8000/api/v1/drivers/driver-uuid-001 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "on_route",
    "current_vehicle_id": "vehicle-uuid-001"
  }'
```

---

## 📊 Dashboard

### Obter KPIs e Métricas

```bash
curl -X GET "http://localhost:8000/api/v1/dashboard/metrics?period=today" \
  -H "Authorization: Bearer $TOKEN"
```

**Parâmetros:**
| Param | Valores | Descrição |
|-------|---------|-----------|
| `period` | `today`, `week`, `month`, `year` | Período de análise |
| `date_from` | `2026-01-01` | Data inicial (custom range) |
| `date_to` | `2026-01-31` | Data final (custom range) |

**Resposta (200 OK):**
```json
{
  "period": "today",
  "deliveries": {
    "total": 45,
    "pending": 12,
    "in_progress": 8,
    "delivered": 23,
    "cancelled": 2,
    "delivery_rate": 92.0
  },
  "routes": {
    "total": 5,
    "active": 3,
    "completed": 2,
    "total_distance_km": 215.4
  },
  "vehicles": {
    "total": 3,
    "available": 1,
    "on_route": 2,
    "maintenance": 0
  },
  "drivers": {
    "total": 3,
    "available": 1,
    "on_route": 2
  },
  "performance": {
    "avg_delivery_time_min": 35,
    "on_time_rate": 88.5,
    "fuel_cost_brl": 450.00
  }
}
```

---

## 🖥️ Exemplos de Frontend

### Login com Credenciais

1. Acesse `http://localhost:3000/login`
2. Preencha:
   ```
   Email: admin@techlogistics.com
   Senha: Admin@123456
   ```
3. Clique em **"Entrar"**
4. Você será redirecionado para o Dashboard

---

### Acessar o Dashboard

Após login, o dashboard mostra automaticamente:

```
┌─────────────────────────────────────────────────────────┐
│  📊 TechLogistics Inc — Dashboard                       │
├──────────────┬──────────────┬──────────────┬────────────┤
│  45 Entregas │  5 Rotas     │  3 Veículos  │ 3 Motorist.│
│  📦 Hoje     │  🗺️ Ativas   │  🚐 Total    │ 👨‍✈️ Total  │
├──────────────┴──────────────┴──────────────┴────────────┤
│                                                         │
│  📈 Gráfico de Entregas (últimos 7 dias)                │
│  ─────────────────────────────────────                  │
│  35 ┤          ╭──╮                                     │
│  30 ┤        ╭─╯  ╰──╮                                  │
│  25 ┤    ╭───╯        ╰─╮                               │
│  20 ┤╭───╯              ╰───                            │
│     └──┬──┬──┬──┬──┬──┬──                              │
│       Seg Ter Qua Qui Sex Sab Dom                       │
│                                                         │
│  🗺️ Mapa ao vivo com posições dos veículos             │
└─────────────────────────────────────────────────────────┘
```

---

### Criar uma Entrega pelo Frontend

1. Clique em **"Entregas"** no menu lateral
2. Clique no botão **"+ Nova Entrega"**
3. Preencha o formulário:
   - **Cliente**: Nome do cliente
   - **Endereço**: Digite e selecione da lista (autocompletar com Google Maps)
   - **Peso**: Peso em kg
   - **Prioridade**: Baixa / Média / Alta / Urgente
4. Clique em **"Salvar"**

---

### Gerar uma Rota Otimizada pelo Frontend

1. Clique em **"Rotas"** no menu lateral
2. Clique em **"+ Nova Rota"**
3. Configure:
   - **Motorista**: Selecione um motorista disponível
   - **Veículo**: Selecione um veículo disponível
   - **Entregas**: Marque as entregas a incluir na rota
   - **Ponto de Partida**: Endereço do depósito/base
4. Clique em **"Gerar Rota Otimizada"** 🚀
5. O sistema processa e mostra:
   - Ordem otimizada das paradas
   - Distância total
   - Tempo estimado

---

### Visualizar Rota no Mapa

1. Na lista de Rotas, clique em uma rota
2. O mapa mostra:
   - 📍 **Pins numerados** para cada parada
   - 🟦 **Linha azul** com o trajeto otimizado
   - 🏁 **Ponto de partida** marcado
   - ℹ️ **Clique em cada pin** para ver detalhes da entrega

---

## 🔰 Helper JavaScript — Cliente da API

Classe reutilizável para fazer chamadas autenticadas:

```js
class LogisticaAPI {
  constructor(baseUrl = 'http://localhost:8000/api/v1') {
    this.baseUrl = baseUrl;
  }

  get token() {
    return localStorage.getItem('access_token');
  }

  get headers() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  async request(method, path, body = null) {
    const options = { method, headers: this.headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${this.baseUrl}${path}`, options);

    if (response.status === 401) {
      await this.refreshToken();
      return this.request(method, path, body); // retry
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro na requisição');
    }

    return response.status === 204 ? null : response.json();
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    const { access_token } = await response.json();
    localStorage.setItem('access_token', access_token);
  }

  // Métodos de conveniência
  login(email, password) {
    return this.request('POST', '/auth/login', { email, password });
  }

  listDeliveries(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/deliveries?${query}`);
  }

  createDelivery(data) {
    return this.request('POST', '/deliveries', data);
  }

  generateRoute(data) {
    return this.request('POST', '/routes/generate', data);
  }

  getMetrics(period = 'today') {
    return this.request('GET', `/dashboard/metrics?period=${period}`);
  }
}

// Uso:
const api = new LogisticaAPI();
const { access_token } = await api.login('admin@techlogistics.com', 'Admin@123456');
localStorage.setItem('access_token', access_token);

const metrics = await api.getMetrics('week');
console.log(`Entregas esta semana: ${metrics.deliveries.total}`);
```

---

*Precisa de mais exemplos? Consulte o [Swagger UI](http://localhost:8000/docs) para explorar todos os endpoints interativamente!* 🎯
