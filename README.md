# 🚚 Logística SaaS 2026

> **Plataforma SaaS de Roteirização Logística** — Otimize rotas de entrega, gerencie frota e motoristas, e acompanhe KPIs em tempo real.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)](https://docker.com)

---

## ✨ Features Principais

| Módulo | Funcionalidades |
|--------|----------------|
| 🗺️ **Roteirização** | Algoritmos Nearest Neighbor + 2-Opt para otimização de rotas |
| 📦 **Entregas** | CRUD completo, importação via CSV/Excel, rastreamento por status |
| 🚗 **Frota** | Gerenciamento de veículos com capacidade e disponibilidade |
| 👷 **Motoristas** | Cadastro, atribuição de rotas e histórico |
| 📊 **Dashboard** | KPIs em tempo real: entregas, rotas, eficiência |
| 🏢 **Multi-tenant** | Isolamento completo por empresa com JWT |
| 🔒 **Segurança** | JWT + Bcrypt, RBAC, rate limiting |
| 🗾 **Mapas** | Visualização de rotas com Google Maps |

---

## 🛠️ Tech Stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com) — Python async API framework
- [PostgreSQL 15](https://postgresql.org) + [PostGIS](https://postgis.net) — Banco de dados geoespacial
- [SQLAlchemy](https://sqlalchemy.org) + [Alembic](https://alembic.sqlalchemy.org) — ORM + migrações
- [Celery](https://celeryproject.org) + [Redis](https://redis.io) — Tarefas assíncronas
- [JWT](https://jwt.io) + [Bcrypt](https://passlib.readthedocs.io) — Autenticação segura

**Frontend**
- [Next.js 15](https://nextjs.org) — React framework com App Router
- [TypeScript](https://typescriptlang.org) — Type safety
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) — Design system
- [Recharts](https://recharts.org) — Gráficos e dashboards
- [Google Maps API](https://developers.google.com/maps) — Mapas interativos
- [Zustand](https://zustand-demo.pmnd.rs) + [React Query](https://tanstack.com/query) — State management

**DevOps**
- [Docker](https://docker.com) + [Docker Compose](https://docs.docker.com/compose/install/) — Containerização
- [Nginx](https://nginx.org) — Reverse proxy
- [GitHub Actions](https://github.com/features/actions) — CI/CD

---

## 🚀 Quick Start (3 passos)

### Pré-requisitos
- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/) instalados
- Chave de API do [Google Maps](https://console.cloud.google.com/google/maps-apis) (opcional)

### 1. Clone e configure

```bash
git clone https://github.com/jeremiasbarros508-lang/logistica-saas-2026.git
cd logistica-saas-2026
cp .env.example .env
```

Edite o `.env` com suas configurações (especialmente `SECRET_KEY` e `GOOGLE_MAPS_API_KEY`).

### 2. Suba os containers

```bash
docker-compose up -d
```

### 3. Acesse a plataforma

| Serviço | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:3000 |
| ⚙️ API | http://localhost:8000 |
| 📖 API Docs | http://localhost:8000/docs |

Crie sua conta em http://localhost:3000/register e comece a usar!

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [SETUP.md](SETUP.md) | Guia completo de instalação e configuração |
| [API.md](API.md) | Documentação completa da API REST |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arquitetura técnica do sistema |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Deploy em produção (AWS, Heroku, DigitalOcean) |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Como contribuir com o projeto |

---

## 🏗️ Estrutura do Projeto

```
logistica-saas-2026/
├── backend/            # API FastAPI (Python)
│   ├── app/
│   │   ├── api/        # Endpoints REST
│   │   ├── algorithms/ # Algoritmos de roteirização
│   │   ├── models/     # Models SQLAlchemy
│   │   ├── schemas/    # Pydantic schemas
│   │   └── services/   # Lógica de negócio
│   └── tests/          # Testes unitários e de integração
├── frontend/           # App Next.js (TypeScript)
│   └── src/
│       ├── app/        # Pages (App Router)
│       ├── components/ # Componentes React
│       ├── hooks/      # Custom hooks
│       └── services/   # Integração com API
├── docker-compose.yml      # Dev environment
├── docker-compose.prod.yml # Prod environment
├── nginx.conf          # Nginx reverse proxy
└── .env.example        # Variáveis de ambiente (template)
```

---

## 🤝 Contributing

Contribuições são bem-vindas! Leia o [CONTRIBUTING.md](CONTRIBUTING.md) para começar.

---

## 📄 License

Este projeto está licenciado sob a [MIT License](LICENSE).

---

## 💬 Support

- 📖 [Documentação completa](SETUP.md)
- 🐛 [Abrir um issue](https://github.com/jeremiasbarros508-lang/logistica-saas-2026/issues)
- 💡 [Discussões](https://github.com/jeremiasbarros508-lang/logistica-saas-2026/discussions)