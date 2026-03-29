# 🚀 Quick Start — Logística SaaS 2026

Guia passo a passo para rodar o projeto **localmente em menos de 5 minutos**.

---

## 📋 Índice

1. [Pré-requisitos](#-pré-requisitos)
2. [Clone do Repositório](#-clone-do-repositório)
3. [Variáveis de Ambiente](#-variáveis-de-ambiente)
4. [Subindo com Docker Compose](#-subindo-com-docker-compose)
5. [Como Acessar](#-como-acessar)
6. [Credenciais de Teste](#-credenciais-de-teste)
7. [Fluxo Básico de Uso](#-fluxo-básico-de-uso)
8. [Populando com Dados de Teste](#-populando-com-dados-de-teste)
9. [Troubleshooting](#-troubleshooting)
10. [Próximos Passos](#-próximos-passos)

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

| Ferramenta | Versão Mínima | Download |
|------------|--------------|---------|
| **Docker** | 24.x | [docs.docker.com](https://docs.docker.com/get-docker/) |
| **Docker Compose** | 2.x | Incluso no Docker Desktop |
| **Git** | 2.x | [git-scm.com](https://git-scm.com/) |

> 💡 **Não precisa** instalar Python, Node.js ou PostgreSQL — o Docker cuida de tudo!

Verifique as versões:

```bash
docker --version        # Docker version 24.x.x
docker compose version  # Docker Compose version v2.x.x
git --version           # git version 2.x.x
```

---

## 📥 Clone do Repositório

```bash
git clone https://github.com/jeremiasbarros508-lang/logistica-saas-2026.git
cd logistica-saas-2026
```

---

## ⚙️ Variáveis de Ambiente

Copie o arquivo de exemplo e edite conforme necessário:

```bash
cp .env.example .env
```

Para testes locais, **o arquivo padrão já funciona** sem alterações. As variáveis mais importantes são:

```env
# Banco de Dados
DATABASE_URL=postgresql://saas_user:saas_pass@postgres:5432/logistica_saas

# Segurança — MUDE em produção!
SECRET_KEY=dev-secret-key-change-in-production
JWT_SECRET_KEY=dev-jwt-secret-change-in-production

# Google Maps (opcional para testes)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# URLs
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

> ⚠️ **Atenção**: Para produção, gere chaves seguras com:
> ```bash
> openssl rand -hex 32
> ```

---

## 🐳 Subindo com Docker Compose

```bash
# Sobe todos os serviços (backend, frontend, banco, redis, nginx)
docker compose up

# Ou em background (detached mode)
docker compose up -d
```

Na primeira execução, o Docker vai:
1. 📦 Baixar as imagens (pode demorar 2-5 min na primeira vez)
2. 🔨 Buildar os containers
3. 🗄️ Criar o banco de dados e rodar as migrations
4. ✅ Iniciar todos os serviços

Você verá algo assim quando estiver pronto:

```
✔ Container postgres   Started
✔ Container redis      Started
✔ Container backend    Started
✔ Container frontend   Started
✔ Container nginx      Started
```

---

## 🌐 Como Acessar

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:3000 | Interface web |
| **Backend API** | http://localhost:8000 | API REST |
| **Docs da API** | http://localhost:8000/docs | Swagger UI interativo |
| **Docs (ReDoc)** | http://localhost:8000/redoc | Documentação alternativa |
| **Adminer** (DB) | http://localhost:8080 | Interface do banco de dados |

---

## 🔑 Credenciais de Teste

Após popular o banco com o [seed data](#-populando-com-dados-de-teste):

### Admin
```
Email:    admin@techlogistics.com
Senha:    Admin@123456
Perfil:   Acesso total ao sistema
```

### Operador
```
Email:    operador@techlogistics.com
Senha:    Operador@123456
Perfil:   Acesso operacional (entregas, rotas)
```

### Banco de Dados (Adminer)
```
Sistema:    PostgreSQL
Servidor:   postgres
Usuário:    saas_user
Senha:      saas_pass
Base:       logistica_saas
```

---

## 🗺️ Fluxo Básico de Uso

### 1️⃣ Criar uma Empresa e Fazer Login

```
http://localhost:3000/register
```

Preencha:
- **Nome da Empresa**: Minha Empresa Ltda
- **Email**: meu@email.com
- **Senha**: MinhaSenh@123

Ou use as [credenciais de teste](#-credenciais-de-teste) se já populou o banco.

---

### 2️⃣ Explorar o Dashboard

```
http://localhost:3000/dashboard
```

Visualize:
- 📊 Total de entregas do dia
- 🚗 Veículos disponíveis
- 👨‍✈️ Motoristas ativos
- 📍 Mapa com posições em tempo real

---

### 3️⃣ Cadastrar um Veículo

```
http://localhost:3000/vehicles/new
```

Campos obrigatórios:
- **Nome**: Van 01
- **Placa**: ABC-1234
- **Capacidade (kg)**: 1000
- **Combustível**: Gasolina

---

### 4️⃣ Cadastrar um Motorista

```
http://localhost:3000/drivers/new
```

Campos obrigatórios:
- **Nome**: João Silva
- **Email**: joao@empresa.com
- **Telefone**: (11) 99999-9999
- **CNH**: A, B

---

### 5️⃣ Criar uma Entrega

```
http://localhost:3000/deliveries/new
```

Preencha:
- **Cliente**: Empresa ABC
- **Endereço de Entrega**: Av. Paulista, 1000 - São Paulo, SP
- **Peso (kg)**: 50
- **Prioridade**: Alta
- **Observações**: Entregar até 18h

---

### 6️⃣ Gerar uma Rota Otimizada

```
http://localhost:3000/routes/new
```

Selecione:
1. ✅ Motorista disponível
2. ✅ Veículo disponível
3. ✅ Entregas pendentes
4. Clique em **"Gerar Rota Otimizada"** 🚀

O sistema usa o algoritmo **Nearest Neighbor + 2-Opt** para minimizar a distância total!

---

### 7️⃣ Visualizar no Mapa

```
http://localhost:3000/routes/{id}
```

- 📍 Visualize o trajeto no mapa
- 📏 Distância total calculada
- ⏱️ Tempo estimado de entrega
- 📋 Lista de paradas na ordem otimizada

---

## 🌱 Populando com Dados de Teste

Para ter dados prontos para explorar, execute o script de seed:

```bash
# Com o projeto rodando, execute:
docker compose exec postgres psql -U saas_user -d logistica_saas -f /tmp/seed-data.sql

# Ou copie o arquivo e execute:
docker compose cp seed-data.sql postgres:/tmp/seed-data.sql
docker compose exec postgres psql -U saas_user -d logistica_saas -f /tmp/seed-data.sql
```

O seed cria:
- 🏢 1 empresa de teste (TechLogistics Inc)
- 👥 2 usuários (admin + operador)
- 🚐 3 veículos (Van 1, Van 2, Truck 1)
- 👨‍✈️ 3 motoristas (João, Maria, Pedro)
- 📦 10 entregas em São Paulo
- 🗺️ 2 rotas otimizadas de exemplo

---

## 🔧 Troubleshooting

### ❌ Porta 3000 ou 8000 já está em uso

```bash
# Verificar qual processo está usando a porta
lsof -i :3000
lsof -i :8000

# Matar o processo
kill -9 <PID>

# Ou mudar a porta no docker-compose.yml
ports:
  - "3001:3000"  # usa porta 3001 no host
```

---

### ❌ Container não inicia / erro de permissão

```bash
# Verificar logs do container com problema
docker compose logs backend
docker compose logs frontend
docker compose logs postgres

# Rebuild dos containers
docker compose down
docker compose build --no-cache
docker compose up
```

---

### ❌ Erro de conexão com o banco de dados

```bash
# Verificar se o PostgreSQL está rodando
docker compose ps postgres

# Verificar logs do banco
docker compose logs postgres

# Aguardar o banco inicializar (pode demorar alguns segundos)
# O backend tenta reconectar automaticamente
```

---

### ❌ Migration falhou

```bash
# Rodar migrations manualmente
docker compose exec backend alembic upgrade head

# Ver histórico de migrations
docker compose exec backend alembic history

# Resetar banco (CUIDADO: apaga todos os dados!)
docker compose down -v
docker compose up
```

---

### ❌ Frontend não conecta ao backend

Verifique o arquivo `.env` na raiz:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

E no `.env` do frontend:

```env
BACKEND_URL=http://backend:8000
```

---

### ❌ Google Maps não aparece

O mapa requer uma API Key válida. Para testes sem o mapa:
1. As rotas ainda são geradas normalmente
2. Apenas a visualização do mapa fica desabilitada

Para habilitar: [Criar API Key no Google Cloud](https://developers.google.com/maps/documentation/javascript/get-api-key)

---

### ❌ `docker compose` não reconhecido

Versões antigas usam `docker-compose` (com hífen):

```bash
docker-compose up  # versão antiga
docker compose up  # versão nova (v2)
```

---

## 🚀 Próximos Passos

Depois de ter o projeto rodando localmente:

1. 📚 **Leia os exemplos de API**: [`EXAMPLES.md`](./EXAMPLES.md)
2. 🧪 **Teste os endpoints**: [`api-test.http`](./api-test.http) (VS Code REST Client)
3. 📬 **Use o Postman**: [`postman-collection.json`](./postman-collection.json)
4. 🏗️ **Entenda a arquitetura**: [`ARCHITECTURE.md`](./ARCHITECTURE.md)
5. 🚢 **Faça deploy**: [`DEPLOYMENT.md`](./DEPLOYMENT.md)
6. 🤝 **Contribua**: [`CONTRIBUTING.md`](./CONTRIBUTING.md)

---

## 💬 Suporte

- 🐛 **Bug?** [Abra uma issue](https://github.com/jeremiasbarros508-lang/logistica-saas-2026/issues)
- 💡 **Sugestão?** [Inicie uma discussão](https://github.com/jeremiasbarros508-lang/logistica-saas-2026/discussions)
- 📧 **Email**: suporte@logisticasaas.com.br

---

*Feito com ❤️ para simplificar a logística brasileira* 🇧🇷
