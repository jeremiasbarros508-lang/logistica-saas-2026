# 📦 Guia de Instalação — Logística SaaS

## Índice

- [Requisitos do Sistema](#-requisitos-do-sistema)
- [Instalação com Docker (Recomendado)](#-instalação-com-docker-recomendado)
- [Instalação sem Docker](#-instalação-sem-docker)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Primeiros Passos](#-primeiros-passos)
- [Comandos Úteis](#-comandos-úteis)
- [Testando a API](#-testando-a-api)
- [Troubleshooting](#-troubleshooting)

---

## 💻 Requisitos do Sistema

### Com Docker (recomendado)
| Ferramenta | Versão Mínima |
|------------|---------------|
| Docker | 24.x |
| Docker Compose | v2.x |
| RAM | 4 GB |
| Disco | 10 GB livre |

### Sem Docker
| Ferramenta | Versão Mínima |
|------------|---------------|
| Python | 3.12+ |
| Node.js | 20+ |
| PostgreSQL | 15 + PostGIS |
| Redis | 7 |
| RAM | 4 GB |

---

## 🐳 Instalação com Docker (Recomendado)

### 1. Clone o repositório

```bash
git clone https://github.com/jeremiasbarros508-lang/logistica-saas-2026.git
cd logistica-saas-2026
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure pelo menos:

```bash
# Gere uma chave segura com:
# openssl rand -hex 32
SECRET_KEY=sua-chave-secreta-aqui

# Google Maps (opcional para visualização de mapas)
GOOGLE_MAPS_API_KEY=sua-chave-do-google-maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua-chave-do-google-maps
```

### 3. Suba os serviços

```bash
docker-compose up -d
```

Na primeira execução, o Docker irá baixar as imagens e construir os containers. Aguarde alguns minutos.

### 4. Verifique o status

```bash
docker-compose ps
```

Todos os serviços devem estar `Up` e `healthy`:

```
NAME                STATUS          PORTS
logistica-backend   Up (healthy)    0.0.0.0:8000->8000/tcp
logistica-frontend  Up              0.0.0.0:3000->3000/tcp
logistica-db        Up (healthy)    0.0.0.0:5432->5432/tcp
logistica-redis     Up (healthy)    0.0.0.0:6379->6379/tcp
logistica-nginx     Up              0.0.0.0:80->80/tcp
```

### 5. Execute as migrações do banco

```bash
docker-compose exec backend alembic upgrade head
```

### 6. Acesse a plataforma

| Serviço | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:3000 |
| ⚙️ API | http://localhost:8000 |
| 📖 API Docs (Swagger) | http://localhost:8000/docs |
| 📖 API Docs (ReDoc) | http://localhost:8000/redoc |

---

## 🔧 Instalação sem Docker

### Backend (FastAPI)

```bash
cd backend

# Crie e ative o ambiente virtual
python3.12 -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate   # Windows

# Instale as dependências
pip install -r requirements.txt

# Configure o .env
cp .env.example .env
# Edite .env com sua DATABASE_URL e SECRET_KEY

# Execute as migrações
alembic upgrade head

# Inicie o servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Worker Celery

```bash
# Em outro terminal, com o venv ativado
cd backend
celery -A app.workers.celery_app worker --loglevel=info
```

### Frontend (Next.js)

```bash
cd frontend

# Instale as dependências
npm install

# Configure o .env.local
cp .env.example .env.local
# Configure NEXT_PUBLIC_API_URL=http://localhost:8000

# Inicie em modo desenvolvimento
npm run dev
```

---

## ⚙️ Variáveis de Ambiente

Copie `.env.example` para `.env` e configure as variáveis abaixo:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `POSTGRES_USER` | Usuário do PostgreSQL | `postgres` |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL | `senha_segura` |
| `POSTGRES_DB` | Nome do banco de dados | `logistica_saas` |
| `DATABASE_URL` | URL completa do banco | `postgresql://user:pass@db:5432/logistica_saas` |
| `SECRET_KEY` | Chave secreta JWT (64+ chars) | `openssl rand -hex 32` |
| `ALGORITHM` | Algoritmo JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiração do access token | `15` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Expiração do refresh token | `7` |
| `REDIS_URL` | URL do Redis | `redis://redis:6379/0` |
| `GOOGLE_MAPS_API_KEY` | Chave da API Google Maps | `AIzaSy...` |
| `NEXT_PUBLIC_API_URL` | URL da API no frontend | `http://localhost:8000` |
| `ENVIRONMENT` | Ambiente (`development`/`production`) | `development` |
| `CORS_ORIGINS` | Origens permitidas no CORS | `http://localhost:3000` |

---

## 🎯 Primeiros Passos

### 1. Crie uma conta

Acesse http://localhost:3000/register e preencha:
- Nome da empresa
- Seu nome
- Email
- Senha

### 2. Configure sua frota

No menu lateral:
1. **Veículos** → Adicione seus veículos (capacidade, placa)
2. **Motoristas** → Cadastre seus motoristas (nome, CNH, telefone)

### 3. Cadastre entregas

1. Vá em **Entregas** → **Nova Entrega**
2. Preencha: destinatário, endereço, coordenadas, peso, prazo
3. Ou importe um CSV em massa: **Entregas** → **Importar**

### 4. Gere uma rota otimizada

1. Vá em **Rotas** → **Nova Rota**
2. Selecione as entregas pendentes
3. Escolha o veículo e motorista
4. Clique em **Otimizar Rota**
5. Visualize no mapa e confirme

---

## 🔧 Comandos Úteis

### Docker

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend

# Reiniciar um serviço
docker-compose restart backend

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (CUIDADO: apaga o banco de dados)
docker-compose down -v

# Rebuild de um serviço após mudanças no código
docker-compose up -d --build backend

# Executar comando dentro do container
docker-compose exec backend bash
docker-compose exec db psql -U postgres -d logistica_saas
```

### Banco de Dados

```bash
# Aplicar migrações
docker-compose exec backend alembic upgrade head

# Criar uma nova migração
docker-compose exec backend alembic revision --autogenerate -m "descricao"

# Reverter última migração
docker-compose exec backend alembic downgrade -1

# Ver histórico de migrações
docker-compose exec backend alembic history
```

### Testes do Backend

```bash
# Rodar todos os testes
docker-compose exec backend pytest

# Com cobertura de código
docker-compose exec backend pytest --cov=app --cov-report=term-missing

# Testes específicos
docker-compose exec backend pytest tests/unit/
docker-compose exec backend pytest tests/integration/
```

---

## 🧪 Testando a API

### Via Swagger UI

Acesse http://localhost:8000/docs para uma interface interativa.

### Via curl

**Registrar usuário:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Minha Empresa",
    "name": "João Silva",
    "email": "joao@empresa.com",
    "password": "senha123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@empresa.com", "password": "senha123"}'
```

**Listar entregas (autenticado):**
```bash
TOKEN="seu-access-token-aqui"
curl http://localhost:8000/api/v1/deliveries/ \
  -H "Authorization: Bearer $TOKEN"
```

Consulte o [API.md](API.md) para documentação completa de todos os endpoints.

---

## 🔍 Troubleshooting

### ❌ `docker-compose up` falha com erro de porta já em uso

```
Error: Bind for 0.0.0.0:5432 failed: port is already allocated
```

**Solução:** Pare o serviço local que usa a porta:

```bash
# No Linux/macOS:
sudo lsof -i :5432   # para ver o processo
sudo kill -9 <PID>

# Ou mude a porta no docker-compose.yml:
ports:
  - "5433:5432"  # usa porta 5433 no host
```

### ❌ Backend não conecta ao banco de dados

```
Connection refused to db:5432
```

**Solução:** O banco pode não ter subido completamente. Aguarde e tente:

```bash
docker-compose logs db   # verificar se o postgres está pronto
docker-compose restart backend
```

### ❌ Migrações falham

```
alembic.exc.CommandError: Can't locate revision
```

**Solução:** Aplique as migrações a partir do início:

```bash
docker-compose exec backend alembic downgrade base
docker-compose exec backend alembic upgrade head
```

### ❌ Frontend não conecta ao backend

**Sintoma:** Requisições à API retornam erro de rede.

**Solução:** Verifique o `NEXT_PUBLIC_API_URL` no `.env`. Para desenvolvimento local, use:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### ❌ Erro `CORS` no browser

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solução:** Adicione a origem do frontend na variável `CORS_ORIGINS`:

```
CORS_ORIGINS=http://localhost:3000,http://seu-dominio.com
```

### ❌ Worker Celery não processa tarefas

**Solução:** Verifique se o Redis está rodando e o worker está ativo:

```bash
docker-compose logs redis
docker-compose logs worker
docker-compose restart worker
```

### ❌ Erro de permissão no Docker

```
Permission denied: '/app/...'
```

**Solução:** O container usa um usuário não-root. Verifique as permissões do volume:

```bash
docker-compose down
docker volume rm logistica-saas-2026_postgres_data
docker-compose up -d
```
