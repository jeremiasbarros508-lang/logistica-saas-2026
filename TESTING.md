# 🧪 Guia de Teste Local — SaaS de Roteirização Logística

> ⏱️ **Tempo estimado:** 30 minutos para ter tudo rodando

---

## 📋 Índice

1. [Pré-requisitos](#1-pré-requisitos)
2. [Clonar e Setup](#2-clonar-e-setup)
3. [Rodar com Docker](#3-rodar-com-docker)
4. [Acessar e Testar](#4-acessar-e-testar)
5. [Teste Passo a Passo](#5-teste-passo-a-passo)
6. [Troubleshooting](#6-troubleshooting)
7. [Limpar Tudo](#7-limpar-tudo)

---

## 1. Pré-requisitos

> ⏱️ **Tempo estimado:** 5 minutos

Antes de começar, certifique-se de que você tem instalado:

| Ferramenta | Versão Mínima | Download |
|------------|--------------|----------|
| **Docker Desktop** | 4.0+ | https://www.docker.com/products/docker-desktop |
| **Git** | 2.30+ | https://git-scm.com/downloads |

### Verificar versões

```bash
# Verificar Docker
docker --version
# Esperado: Docker version 24.x.x ou superior

# Verificar Docker Compose
docker compose version
# Esperado: Docker Compose version 2.x.x ou superior

# Verificar Git
git --version
# Esperado: git version 2.x.x ou superior
```

> 💡 **Dica:** Certifique-se de que o Docker Desktop está **aberto e rodando** antes de continuar.

---

## 2. Clonar e Setup

> ⏱️ **Tempo estimado:** 2 minutos

Execute os 3 passos abaixo em sequência:

```bash
# Passo 1: Clonar o repositório
git clone https://github.com/jeremiasbarros508-lang/logistica-saas-2026

# Passo 2: Entrar na pasta do projeto
cd logistica-saas-2026

# Passo 3: Copiar as variáveis de ambiente
cp .env.example .env
```

> ⚠️ **Importante:** O arquivo `.env` contém configurações sensíveis e **não deve ser commitado** no Git. Ele já está no `.gitignore`.

---

## 3. Rodar com Docker

> ⏱️ **Tempo estimado:** 5–10 minutos (primeira vez; downloads de imagens)

```bash
docker-compose up
```

### O que acontece quando você roda esse comando?

```
[1/5] 🐘 PostgreSQL sobe na porta 5432
[2/5] 🔴 Redis sobe na porta 6379
[3/5] ⚙️  Backend FastAPI sobe na porta 8000
[4/5] ⚛️  Frontend Next.js sobe na porta 3000
[5/5] 🔄 Migrations do banco rodam automaticamente
```

### Como saber quando está pronto?

Aguarde até ver **todas** as seguintes mensagens nos logs:

```
backend_1   | INFO:     Application startup complete.
frontend_1  | ✓ Ready in Xs
db_1        | database system is ready to accept connections
```

> 💡 **Dica:** Na primeira execução pode demorar até 10 minutos para baixar as imagens Docker. Nas próximas vezes será muito mais rápido (menos de 30 segundos).

### Rodar em segundo plano (opcional)

```bash
# Rodar em background (sem travar o terminal)
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f
```

---

## 4. Acessar e Testar

> ⏱️ **Tempo estimado:** 1 minuto

Após o startup, acesse as seguintes URLs no seu navegador:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| 🖥️ **Frontend** | http://localhost:3000 | Interface visual da aplicação |
| ⚙️ **Backend** | http://localhost:8000 | API REST |
| 📚 **API Docs** | http://localhost:8000/docs | Swagger UI interativo |
| 🔍 **ReDoc** | http://localhost:8000/redoc | Documentação alternativa |

### Credenciais de Teste

| Campo | Valor |
|-------|-------|
| **Email** | admin@techlogistics.com |
| **Senha** | Admin@123456 |

---

## 5. Teste Passo a Passo

> ⏱️ **Tempo estimado:** 15 minutos

Siga o fluxo completo abaixo para validar que tudo está funcionando:

### ① Fazer Login

1. Acesse http://localhost:3000
2. Clique em **"Entrar"** ou navegue para `/login`
3. Preencha com as credenciais de teste acima
4. Clique em **"Entrar"**

✅ **Resultado esperado:** Você é redirecionado para o Dashboard

---

### ② Ver Dashboard com Dados

1. Após o login, você verá o **Dashboard** principal
2. Verifique se os cards de métricas estão visíveis:
   - Total de Entregas
   - Rotas Ativas
   - Motoristas Disponíveis
   - Taxa de Sucesso

✅ **Resultado esperado:** Gráficos e dados de exemplo carregados

---

### ③ Criar uma Nova Entrega

1. No menu lateral, clique em **"Entregas"**
2. Clique no botão **"+ Nova Entrega"**
3. Preencha os campos:
   - **Destinatário:** João da Silva
   - **Endereço:** Rua das Flores, 123 - São Paulo, SP
   - **CEP:** 01310-100
   - **Peso:** 2.5 kg
   - **Prioridade:** Normal
4. Clique em **"Salvar"**

✅ **Resultado esperado:** Entrega criada com status "Pendente"

---

### ④ Gerar Rota Otimizada

1. No menu lateral, clique em **"Rotas"**
2. Clique em **"+ Nova Rota"**
3. Selecione as entregas pendentes
4. Clique em **"Otimizar Rota"**
5. Aguarde o algoritmo calcular

✅ **Resultado esperado:** Rota otimizada gerada com distância e tempo estimado

---

### ⑤ Ver no Mapa

1. Na página de Rotas, clique em **"Ver no Mapa"**
2. O mapa interativo exibirá os pontos de entrega
3. As rotas serão desenhadas no mapa

✅ **Resultado esperado:** Mapa com marcadores de entrega e linha de rota

---

### ⑥ Testar um Endpoint via cURL

```bash
# 1. Fazer login e obter token
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@techlogistics.com",
    "password": "Admin@123456"
  }'

# Copie o "access_token" da resposta e use abaixo:

# 2. Listar entregas
curl -X GET http://localhost:8000/api/v1/deliveries \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
```

**Resposta esperada do login:**
```json
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

**Ou via Postman:**
1. Importe a collection em `docs/postman-collection.json`
2. Configure a variável `baseUrl` para `http://localhost:8000`
3. Execute as requisições na ordem: **Auth → Login → Deliveries**

---

## 6. Troubleshooting

### ❌ Porta já está em uso

**Erro:** `Bind for 0.0.0.0:3000 failed: port is already allocated`

```bash
# Verificar qual processo está usando a porta
lsof -i :3000   # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Parar o processo ou mudar a porta no docker-compose.yml
```

---

### ❌ Permissão negada

**Erro:** `permission denied while trying to connect to the Docker daemon`

```bash
# Linux: adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker

# macOS/Windows: certifique-se que o Docker Desktop está rodando
```

---

### ❌ Docker não inicia

**Erro:** `Cannot connect to the Docker daemon`

1. Verifique se o **Docker Desktop está aberto**
2. Aguarde o ícone da baleia ficar estável na barra de tarefas
3. Tente novamente

---

### ❌ Banco de dados não conecta

**Erro:** `could not connect to server: Connection refused`

```bash
# Verificar se o container do banco está rodando
docker-compose ps

# Ver logs do banco
docker-compose logs db

# Reiniciar só o banco
docker-compose restart db
```

---

### ❌ Frontend não carrega

**Erro:** Página em branco ou erro 502

```bash
# Ver logs do frontend
docker-compose logs frontend

# Reiniciar o frontend
docker-compose restart frontend

# Aguardar compilação (pode demorar até 2 minutos na primeira vez)
docker-compose logs -f frontend
```

---

## 7. Limpar Tudo

> ⏱️ **Tempo estimado:** 1 minuto

Quando terminar os testes, use os comandos abaixo para limpar o ambiente:

```bash
# Parar os containers
docker-compose down

# Parar E remover volumes (apaga o banco de dados)
docker-compose down -v

# Remover volumes sem uso no sistema (libera espaço em disco)
docker volume prune

# Remover imagens sem uso (libera ainda mais espaço)
docker image prune
```

> ⚠️ **Atenção:** `docker volume prune` remove os dados do banco de dados. Use apenas quando quiser começar do zero.

---

## 📚 Próximos Passos

- 🚀 **Fazer deploy no Heroku?** → Veja [HEROKU_DEPLOY.md](./HEROKU_DEPLOY.md)
- ✅ **Checklist antes do deploy?** → Veja [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)
- 📖 **Documentação da API?** → Acesse http://localhost:8000/docs
- 🤝 **Contribuir com o projeto?** → Veja [CONTRIBUTING.md](./docs/CONTRIBUTING.md)
