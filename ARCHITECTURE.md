# 🏗️ Arquitetura — Logística SaaS

## Índice

- [Visão Geral](#-visão-geral)
- [Backend (FastAPI)](#-backend-fastapi)
- [Frontend (Next.js)](#-frontend-nextjs)
- [Banco de Dados](#-banco-de-dados)
- [DevOps](#-devops)
- [Segurança](#-segurança)
- [Fluxos Principais](#-fluxos-principais)
- [Diagrama de Componentes](#-diagrama-de-componentes)

---

## 🌐 Visão Geral

O sistema é uma plataforma **SaaS multi-tenant** de roteirização logística, composta por:

- **Backend:** API REST em FastAPI (Python) com processamento assíncrono
- **Frontend:** Aplicação React em Next.js 15 com App Router
- **Banco de Dados:** PostgreSQL 15 + PostGIS para dados geoespaciais
- **Cache/Queue:** Redis 7 para cache e fila de tarefas Celery
- **Proxy:** Nginx como reverse proxy e load balancer

Cada empresa (tenant) é completamente isolada das demais — todos os dados são filtrados por `company_id` em todas as queries.

---

## ⚙️ Backend (FastAPI)

### Estrutura de Diretórios

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/     # Routers HTTP por domínio
│   │       │   ├── auth.py
│   │       │   ├── companies.py
│   │       │   ├── deliveries.py
│   │       │   ├── routes.py
│   │       │   ├── vehicles.py
│   │       │   ├── drivers.py
│   │       │   ├── dashboard.py
│   │       │   └── maps.py
│   │       └── router.py      # Agregador de routers
│   ├── algorithms/            # Algoritmos de roteirização
│   │   ├── nearest_neighbor.py
│   │   ├── two_opt.py
│   │   ├── distance_matrix.py
│   │   ├── route_optimizer.py
│   │   └── fitness.py
│   ├── core/
│   │   ├── config.py          # Configurações (Pydantic Settings)
│   │   ├── database.py        # Conexão async com PostgreSQL
│   │   ├── dependencies.py    # Injeção de dependências FastAPI
│   │   ├── constants.py       # Enums e constantes
│   │   └── security/
│   │       ├── jwt.py         # Geração e validação de JWT
│   │       ├── password.py    # Hash e verificação de senha
│   │       └── permissions.py # RBAC
│   ├── models/                # SQLAlchemy ORM models
│   │   ├── base.py
│   │   ├── company.py
│   │   ├── user.py
│   │   ├── delivery.py
│   │   ├── route.py
│   │   ├── vehicle.py
│   │   └── driver.py
│   ├── schemas/               # Pydantic schemas (request/response)
│   ├── services/              # Lógica de negócio
│   ├── workers/               # Celery tasks
│   └── utils/                 # Utilitários (logger, exceptions, validators)
├── alembic/                   # Migrações de banco de dados
└── tests/
    ├── unit/
    └── integration/
```

### Padrões Arquiteturais

**Repository + Service Pattern:**
- `models/` — Entidades do banco de dados (SQLAlchemy)
- `schemas/` — Validação de dados de entrada/saída (Pydantic)
- `services/` — Lógica de negócio (sem acesso direto ao banco via ORM)
- `api/endpoints/` — Controllers HTTP (apenas orquestram services)

**Async por padrão:**
- `SQLAlchemy` com driver `asyncpg` para queries assíncronas
- `FastAPI` com suporte nativo a `async/await`
- `Celery` para tarefas de background (otimização de rotas)

### Algoritmos de Roteirização

**1. Nearest Neighbor (Heurística Construtiva)**
- Começa no depósito
- Adiciona iterativamente a entrega mais próxima ainda não visitada
- Complexidade: O(n²)
- Qualidade: solução inicial razoável

**2. 2-Opt (Melhoria Local)**
- Melhora a solução do Nearest Neighbor
- Remove cruzamentos de rotas invertendo segmentos
- Complexidade: O(n²) por iteração
- Aplica iterações até não encontrar melhoras

**3. Matriz de Distâncias**
- Pré-computada usando fórmula de Haversine (distância geodésica)
- Opcionalmente usa Google Maps Distance Matrix API para distâncias reais

---

## 🖥️ Frontend (Next.js)

### Estrutura de Diretórios

```
frontend/
└── src/
    ├── app/                          # Next.js App Router
    │   ├── (auth)/                   # Grupo: páginas sem autenticação
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   ├── (dashboard)/              # Grupo: páginas autenticadas
    │   │   ├── layout.tsx            # Layout com sidebar
    │   │   ├── page.tsx              # Dashboard principal
    │   │   ├── deliveries/
    │   │   ├── routes/
    │   │   ├── vehicles/
    │   │   ├── drivers/
    │   │   ├── reports/
    │   │   └── settings/
    │   ├── layout.tsx                # Root layout
    │   └── providers.tsx             # Context providers
    ├── components/
    │   ├── ui/                       # Componentes base (shadcn/ui)
    │   ├── layout/                   # Sidebar, Header, Nav
    │   ├── dashboard/                # KPICard, MetricsGrid
    │   ├── charts/                   # Recharts wrappers
    │   ├── forms/                    # DeliveryForm, DriverForm, etc.
    │   ├── tables/                   # DataTable components
    │   └── modals/                   # ConfirmModal, DetailModal
    ├── hooks/                        # Custom React hooks
    │   ├── useAuth.ts
    │   ├── useDeliveries.ts
    │   ├── useRoutes.ts
    │   ├── useDashboard.ts
    │   └── usePagination.ts
    ├── services/                     # Camada de API (Axios)
    │   ├── api.ts                    # Instância Axios configurada
    │   ├── auth.service.ts
    │   ├── delivery.service.ts
    │   └── route.service.ts
    ├── lib/
    │   ├── utils.ts                  # Utilitários (cn, formatDate)
    │   └── env-client.ts             # Variáveis de ambiente do cliente
    └── middleware.ts                 # Proteção de rotas (Next.js)
```

### State Management

- **React Query (TanStack Query):** Cache e sincronização de dados do servidor
- **Zustand:** Estado global do cliente (ex: usuário autenticado)
- **React Hook Form:** Estado de formulários com validação

### Autenticação no Frontend

1. Login → armazena `access_token` e `refresh_token` no `localStorage`
2. Axios interceptor adiciona `Authorization: Bearer <token>` automaticamente
3. Interceptor de resposta detecta `401` e tenta refresh automático
4. `middleware.ts` do Next.js redireciona rotas protegidas se não autenticado

---

## 🗄️ Banco de Dados

### Modelo de Dados

```
companies ────┐
              │ (1:N)
users ─────────┤
              │
deliveries ───┤
              │
routes ───────┤
              │
vehicles ─────┤
              │
drivers ──────┘
```

Todos os modelos possuem `company_id` (FK para `companies`) para isolamento multi-tenant.

### Tabelas Principais

| Tabela | Descrição | Campos Chave |
|--------|-----------|--------------|
| `companies` | Empresas (tenants) | `id`, `name`, `cnpj` |
| `users` | Usuários das empresas | `id`, `company_id`, `email`, `password_hash` |
| `deliveries` | Entregas | `id`, `company_id`, `recipient_name`, `latitude`, `longitude`, `status` |
| `routes` | Rotas otimizadas | `id`, `company_id`, `vehicle_id`, `driver_id`, `waypoints` (JSONB) |
| `vehicles` | Veículos da frota | `id`, `company_id`, `plate`, `capacity_kg` |
| `drivers` | Motoristas | `id`, `company_id`, `cnh`, `cnh_category` |

### PostGIS

A extensão PostGIS é usada para:
- Armazenar coordenadas geográficas como `GEOMETRY(Point, 4326)`
- Queries de proximidade (`ST_Distance`, `ST_DWithin`)
- Cálculo de distâncias geodésicas

---

## 🐳 DevOps

### Docker

**Desenvolvimento (`docker-compose.yml`):**
- Hot reload para backend (uvicorn --reload) e frontend (Next.js HMR)
- Volumes montados para desenvolvimento local
- Portas expostas para debugging

**Produção (`docker-compose.prod.yml`):**
- Imagens multi-stage para menor tamanho
- Sem volumes de desenvolvimento
- Usuários não-root nos containers
- Resource limits (CPU e memória)
- Logging estruturado com rotação

### CI/CD (GitHub Actions)

**Backend CI (`.github/workflows/backend-ci.yml`):**
1. Instala dependências
2. Roda linter (`ruff`)
3. Executa 52 testes com `pytest`
4. Verifica cobertura de código

**Frontend CI (`.github/workflows/frontend-ci.yml`):**
1. Instala dependências
2. Roda `eslint`
3. Executa `next build`
4. Verificação de tipos TypeScript

**Deployment (`.github/workflows/deployment.yml`):**
1. Build das imagens Docker
2. Push para registry
3. Deploy no servidor de produção via SSH

---

## 🔒 Segurança

### Autenticação e Autorização

- **JWT:** Access token (15 min) + Refresh token (7 dias)
- **Bcrypt:** Hash de senhas com salt automático
- **Multi-tenant isolation:** `company_id` em todas as queries
- **CORS:** Origens configuráveis via `CORS_ORIGINS`

### Proteções Implementadas

| Vulnerabilidade | Proteção |
|----------------|----------|
| SQL Injection | SQLAlchemy parametrizado |
| XSS | Escaping automático do React |
| CSRF | JWT stateless (sem cookies de sessão) |
| Brute Force | Rate limiting no login |
| DoS | Resource limits nos containers |
| Secrets em código | Variáveis de ambiente |

---

## 🔄 Fluxos Principais

### Fluxo de Autenticação

```
Cliente                    Frontend               Backend
  │                           │                      │
  │─── POST /register ────────│──── POST /api/v1/auth/register ──▶
  │                           │                      │ Cria company + user
  │                           │◀── {access_token, refresh_token} ─
  │◀── Redireciona para /dashboard ──────────────────│
  │                           │                      │
  │──── Requisição protegida ─│                      │
  │                           │──── Authorization: Bearer <token> ──▶
  │                           │                      │ Valida JWT
  │                           │◀─── Resposta da API ─────────────────
```

### Fluxo de Roteirização

```
Usuário          Frontend          Backend           Celery Worker
  │                 │                 │                    │
  │─ Seleciona ────▶│                 │                    │
  │  entregas       │                 │                    │
  │                 │─ POST /routes ──▶                    │
  │                 │                 │ Cria rota (pending)│
  │                 │◀─ route_id ─────│                    │
  │─ Clica "Otimizar"│                │                    │
  │                 │─ POST /routes/{id}/optimize ─────────│
  │                 │                 │ Dispara task Celery │
  │                 │                 │──── Executa ───────▶│
  │                 │                 │    Nearest Neighbor │
  │                 │                 │    + 2-Opt          │
  │                 │                 │◀── Waypoints ───────│
  │                 │                 │ Atualiza rota       │
  │                 │                 │ (status: optimized) │
  │─ Polling ───────│─ GET /routes/{id}─▶                  │
  │◀─ Rota otimizada│◀────────────────│                    │
  │  com mapa       │                 │                    │
```

---

## 📐 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │ :80 / :443
                    ┌────────▼────────┐
                    │     NGINX       │
                    │  reverse proxy  │
                    └────┬───────┬───┘
                         │       │
              /api/*      │       │  /*
                    ┌─────▼──┐  ┌─▼──────────┐
                    │FastAPI │  │  Next.js   │
                    │Backend │  │  Frontend  │
                    │ :8000  │  │   :3000    │
                    └───┬────┘  └────────────┘
                        │
           ┌────────────┼────────────┐
           │            │            │
    ┌──────▼─────┐  ┌───▼────┐  ┌───▼──────┐
    │PostgreSQL  │  │ Redis  │  │  Celery  │
    │+ PostGIS   │  │  :6379 │  │  Worker  │
    │   :5432    │  └────────┘  └──────────┘
    └────────────┘
```
