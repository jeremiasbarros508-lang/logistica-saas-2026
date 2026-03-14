# 🚀 Deploy no Heroku — SaaS de Roteirização Logística

> ⏱️ **Tempo estimado:** 20 minutos para app em produção

---

## 📋 Índice

1. [Pré-requisitos](#1-pré-requisitos)
2. [Criar App no Heroku](#2-criar-app-no-heroku)
3. [Configurar Variáveis de Ambiente](#3-configurar-variáveis-de-ambiente)
4. [Deploy](#4-deploy)
5. [Verificar Deploy](#5-verificar-deploy)
6. [Problemas Comuns](#6-problemas-comuns)
7. [Próximos Passos](#7-próximos-passos)

---

## 1. Pré-requisitos

> ⏱️ **Tempo estimado:** 5 minutos

Antes de fazer o deploy, você precisa:

| Requisito | Como Obter |
|-----------|-----------|
| ✅ **Heroku CLI instalado** | https://devcenter.heroku.com/articles/heroku-cli |
| ✅ **Conta no Heroku** | https://signup.heroku.com (gratuita) |
| ✅ **Projeto testado localmente** | Veja [TESTING.md](./TESTING.md) |
| ✅ **Git instalado** | https://git-scm.com/downloads |

### Instalar Heroku CLI

```bash
# macOS (via Homebrew)
brew tap heroku/brew && brew install heroku

# Ubuntu / Debian
curl https://cli-assets.heroku.com/install-ubuntu.sh | sh

# Windows
# Baixe o instalador em: https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli
```

### Verificar instalação

```bash
heroku --version
# Esperado: heroku/8.x.x ou superior
```

---

## 2. Criar App no Heroku

> ⏱️ **Tempo estimado:** 3 minutos

Execute os 3 passos abaixo:

```bash
# Passo 1: Fazer login no Heroku
heroku login
# Um navegador abrirá para autenticação — faça login lá

# Passo 2: Criar o app (escolha um nome único!)
heroku create seu-app-nome-unico
# Exemplo: heroku create techlogistics-app-2026

# Passo 3: Adicionar banco de dados PostgreSQL (plano gratuito)
heroku addons:create heroku-postgresql:essential-0
```

> 💡 **Dica:** O nome do app precisa ser único no Heroku. Se `seu-app-nome-unico` já existir, tente adicionar números ou variações: `techlogistics-2026`, `logistica-saas-demo`, etc.

### Verificar que foi criado

```bash
# Ver apps criados
heroku apps

# Ver addons do seu app
heroku addons --app seu-app-nome-unico
```

---

## 3. Configurar Variáveis de Ambiente

> ⏱️ **Tempo estimado:** 3 minutos

```bash
heroku config:set \
  JWT_SECRET=$(openssl rand -hex 32) \
  ENVIRONMENT=production \
  LOG_LEVEL=info \
  --app seu-app-nome-unico
```

> 💡 **Nota:** `DATABASE_URL` é configurado **automaticamente** pelo add-on do PostgreSQL. Você não precisa configurar manualmente.

### Variáveis obrigatórias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `JWT_SECRET` | Chave secreta para tokens JWT | String aleatória de 64 chars |
| `ENVIRONMENT` | Ambiente de execução | `production` |
| `DATABASE_URL` | URL do banco (automático) | Configurado pelo Heroku |
| `LOG_LEVEL` | Nível de log | `info` |

### Variáveis opcionais

```bash
heroku config:set \
  FRONTEND_URL=https://seu-app-nome-unico.herokuapp.com \
  BACKEND_URL=https://seu-app-nome-unico.herokuapp.com/api \
  --app seu-app-nome-unico
```

### Verificar configurações

```bash
heroku config --app seu-app-nome-unico
```

---

## 4. Deploy

> ⏱️ **Tempo estimado:** 5 minutos

```bash
# Deploy com 1 comando
git push heroku main
```

### O que acontece durante o deploy?

```
remote: -----> Building on the Heroku-22 stack
remote: -----> Detecting buildpacks...
remote: -----> Python app detected
remote: -----> Installing dependencies from requirements.txt
remote: -----> Discovering process types
remote: -----> Compressing...
remote: -----> Launching...
remote:        Released v1
remote:        https://seu-app-nome-unico.herokuapp.com/ deployed to Heroku
remote: Verifying deploy... done.
```

> ⏱️ O build demora em média **3–5 minutos** na primeira vez.

---

## 5. Verificar Deploy

> ⏱️ **Tempo estimado:** 2 minutos

### Ver logs em tempo real

```bash
heroku logs --tail --app seu-app-nome-unico
```

### Abrir o app no navegador

```bash
heroku open --app seu-app-nome-unico
```

### Testar a API

```bash
# Verificar health check
curl https://seu-app-nome-unico.herokuapp.com/health

# Resposta esperada:
# {"status": "healthy", "environment": "production"}
```

### URLs de acesso

| Serviço | URL |
|---------|-----|
| 🖥️ **App** | https://seu-app-nome-unico.herokuapp.com |
| 📚 **API Docs** | https://seu-app-nome-unico.herokuapp.com/docs |
| ⚙️ **Admin** | https://dashboard.heroku.com/apps/seu-app-nome-unico |

---

## 6. Problemas Comuns

### ❌ Build falhou

**Erro:** `Error: Build failed`

```bash
# Ver logs detalhados do build
heroku builds:output --app seu-app-nome-unico

# Verificar se o Procfile existe
cat Procfile

# Verificar se o requirements.txt existe
cat backend/requirements.txt
```

**Possíveis causas:**
- `requirements.txt` faltando ou com erro de sintaxe
- `Procfile` não encontrado
- Versão do Python incompatível (adicione `runtime.txt` com `python-3.11.x`)

---

### ❌ App crashes (H10 error)

**Erro:** `Error R10 (Boot timeout)` ou `H10 - App crashed`

```bash
# Ver logs de erro
heroku logs --tail --app seu-app-nome-unico

# Reiniciar o app
heroku restart --app seu-app-nome-unico

# Verificar variáveis de ambiente
heroku config --app seu-app-nome-unico
```

**Possíveis causas:**
- `JWT_SECRET` não configurado
- App tentando conectar em porta diferente de `$PORT`
- Dependência faltando no `requirements.txt`

---

### ❌ Banco de dados não conecta

**Erro:** `could not connect to server: Connection refused`

```bash
# Verificar se o addon está ativo
heroku addons --app seu-app-nome-unico

# Ver URL do banco
heroku config:get DATABASE_URL --app seu-app-nome-unico

# Rodar migrations manualmente
heroku run "cd backend && alembic upgrade head" --app seu-app-nome-unico
```

---

### ❌ Variáveis de ambiente não setadas

**Erro:** `KeyError: 'JWT_SECRET'`

```bash
# Listar todas as variáveis configuradas
heroku config --app seu-app-nome-unico

# Configurar variável específica
heroku config:set JWT_SECRET=minha-chave-secreta --app seu-app-nome-unico
```

---

### ❌ Heroku push rejeitado

**Erro:** `! [rejected] main -> main (non-fast-forward)`

```bash
# Verificar branch atual
git branch

# Se estiver em outra branch (ex: master)
git push heroku master:main

# Forçar push (use com cuidado!)
git push heroku main --force
```

---

## 7. Próximos Passos

### 🌐 Configurar domínio próprio

```bash
# Adicionar domínio customizado
heroku domains:add www.seudominio.com --app seu-app-nome-unico

# Ver instruções de DNS
heroku domains --app seu-app-nome-unico
```

Depois, configure seu DNS apontando o CNAME para o endereço que o Heroku fornecer.

---

### 🔒 SSL (HTTPS)

O Heroku oferece **SSL automático e gratuito** para todos os apps no domínio `*.herokuapp.com`.

Para domínio próprio, ative o SSL:

```bash
# Ativar SSL gerenciado pelo Heroku (plano pago)
heroku certs:auto:enable --app seu-app-nome-unico
```

---

### 📊 Monitoramento

```bash
# Ver métricas do app
heroku ps --app seu-app-nome-unico

# Ver logs históricos
heroku logs -n 200 --app seu-app-nome-unico

# Adicionar Papertrail para logs persistentes (gratuito)
heroku addons:create papertrail:choklad --app seu-app-nome-unico
```

---

### 📈 Scaling

```bash
# Escalar web dynos (ex: 2 instâncias)
heroku ps:scale web=2 --app seu-app-nome-unico

# Ver dynos ativos
heroku ps --app seu-app-nome-unico
```

---

## 📚 Recursos Úteis

- 📖 [Heroku Dev Center](https://devcenter.heroku.com/)
- 🐍 [Deploying Python Apps](https://devcenter.heroku.com/articles/getting-started-with-python)
- 🐘 [Heroku Postgres Docs](https://devcenter.heroku.com/articles/heroku-postgresql)
- 🔧 [Heroku CLI Commands](https://devcenter.heroku.com/articles/heroku-cli-commands)

---

## 📚 Links Relacionados

- 🧪 **Testar localmente primeiro?** → [TESTING.md](./TESTING.md)
- ✅ **Checklist de deploy?** → [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)
- 📖 **Documentação geral?** → [README.md](./README.md)
