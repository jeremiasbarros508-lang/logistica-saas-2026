# 🚀 Deployment Guide — Logística SaaS

## Índice

- [Overview](#-overview)
- [Checklist Pré-Produção](#-checklist-pré-produção)
- [Deploy no Heroku](#-deploy-no-heroku)
- [Deploy na AWS EC2](#-deploy-na-aws-ec2)
- [Deploy no DigitalOcean](#-deploy-no-digitalocean)
- [Deploy no Railway](#-deploy-no-railway)
- [Domínio Customizado](#-domínio-customizado)
- [SSL/HTTPS](#-sslhttps)
- [Monitoramento](#-monitoramento)
- [Backups](#-backups)
- [Scaling](#-scaling)

---

## 🎯 Overview

A aplicação é dockerizada e pode ser implantada em qualquer provedor de nuvem. Os arquivos de configuração para produção são:

- `docker-compose.prod.yml` — Orquestração de todos os serviços
- `.env` — Variáveis de ambiente (gerado a partir de `.env.example`)
- `nginx.conf` — Configuração do reverse proxy

---

## ✅ Checklist Pré-Produção

Antes de fazer deploy, verifique:

**Segurança:**
- [ ] `SECRET_KEY` é uma string aleatória e segura (`openssl rand -hex 32`)
- [ ] `POSTGRES_PASSWORD` é uma senha forte
- [ ] `ENVIRONMENT=production` está definido
- [ ] Swagger UI está desativado em produção (`/docs` retorna 404)
- [ ] `CORS_ORIGINS` contém apenas domínios autorizados

**Banco de Dados:**
- [ ] Backup strategy definida
- [ ] Migrações testadas (`alembic upgrade head`)
- [ ] Conexão SSL com o banco configurada

**Infraestrutura:**
- [ ] SSL/HTTPS configurado
- [ ] Domínio apontando para o servidor
- [ ] Firewall configurado (apenas portas 80 e 443 abertas)
- [ ] Monitoramento configurado

**Testes:**
- [ ] Todos os testes passando (`pytest` + `npm test`)
- [ ] Build do frontend funcionando (`npm run build`)

---

## 🟣 Deploy no Heroku

### Pré-requisitos
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) instalado
- Conta no Heroku

### Backend

```bash
# Login no Heroku
heroku login

# Crie o app
heroku create meu-saas-backend

# Adicione os addons
heroku addons:create heroku-postgresql:mini
heroku addons:create heroku-redis:mini

# Configure as variáveis de ambiente
heroku config:set SECRET_KEY=$(openssl rand -hex 32)
heroku config:set ENVIRONMENT=production
heroku config:set ALGORITHM=HS256
heroku config:set ACCESS_TOKEN_EXPIRE_MINUTES=15
heroku config:set CORS_ORIGINS=https://meu-saas-frontend.herokuapp.com

# Deploy
cd backend
heroku container:push web
heroku container:release web

# Execute as migrações
heroku run alembic upgrade head
```

### Frontend

```bash
heroku create meu-saas-frontend

heroku config:set NEXT_PUBLIC_API_URL=https://meu-saas-backend.herokuapp.com

cd frontend
heroku container:push web
heroku container:release web
```

---

## 🟠 Deploy na AWS EC2

### 1. Crie e configure a instância

```bash
# Recomendado: t3.medium (2 vCPU, 4GB RAM)
# SO: Ubuntu 22.04 LTS
# Security Group: porta 22 (SSH), 80 (HTTP), 443 (HTTPS)
```

### 2. Instale as dependências

```bash
# Conecte via SSH
ssh -i sua-chave.pem ubuntu@seu-ip-publico

# Atualize o sistema
sudo apt update && sudo apt upgrade -y

# Instale Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu

# Instale Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Instale Git
sudo apt install git -y

# Relogin para aplicar grupos
exit
ssh -i sua-chave.pem ubuntu@seu-ip-publico
```

### 3. Clone e configure

```bash
git clone https://github.com/jeremiasbarros508-lang/logistica-saas-2026.git
cd logistica-saas-2026

# Configure as variáveis de ambiente
cp .env.example .env
nano .env
# Configure: SECRET_KEY, POSTGRES_PASSWORD, CORS_ORIGINS, etc.
```

### 4. Suba os serviços

```bash
docker-compose -f docker-compose.prod.yml up -d

# Execute as migrações
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

### 5. Configure SSL com Let's Encrypt

Veja a seção [SSL/HTTPS](#-sslhttps) abaixo.

---

## 🔵 Deploy no DigitalOcean

### Opção A: Droplet (VPS)

Mesmo processo da AWS EC2. Use o Droplet:
- **Tamanho:** Basic 4GB / 2 CPUs ($24/mês)
- **Imagem:** Ubuntu 22.04 LTS
- **Região:** Escolha a mais próxima dos seus usuários

### Opção B: App Platform (PaaS)

```bash
# Instale a CLI da DigitalOcean
snap install doctl
doctl auth init

# Crie o app (via dashboard ou YAML)
# https://cloud.digitalocean.com/apps
```

Crie um arquivo `app.yaml` na raiz:

```yaml
name: logistica-saas
region: nyc

services:
  - name: backend
    source_dir: /backend
    github:
      repo: jeremiasbarros508-lang/logistica-saas-2026
      branch: main
    run_command: uvicorn app.main:app --host 0.0.0.0 --port 8080
    environment_slug: python
    instance_count: 1
    instance_size_slug: basic-xs
    envs:
      - key: ENVIRONMENT
        value: production

  - name: frontend
    source_dir: /frontend
    github:
      repo: jeremiasbarros508-lang/logistica-saas-2026
      branch: main
    build_command: npm run build
    run_command: npm start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xs

databases:
  - name: db
    engine: PG
    version: "15"
    size: db-s-1vcpu-1gb

  - name: redis
    engine: REDIS
    version: "7"
    size: db-s-1vcpu-1gb
```

```bash
doctl apps create --spec app.yaml
```

---

## 🟢 Deploy no Railway

Railway suporta deploy direto do GitHub com zero configuração.

### 1. Crie o projeto

1. Acesse [railway.app](https://railway.app)
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Escolha `logistica-saas-2026`

### 2. Configure os serviços

No dashboard do Railway, adicione:

**Banco de dados:**
- Clique em "+ New" → "Database" → "Add PostgreSQL"
- Clique em "+ New" → "Database" → "Add Redis"

**Backend:**
- Clique em "+ New" → "GitHub Repo" → selecione `backend/`
- Em "Variables", adicione as variáveis do `.env`

**Frontend:**
- Clique em "+ New" → "GitHub Repo" → selecione `frontend/`
- Configure `NEXT_PUBLIC_API_URL` com a URL do backend

### 3. Configure as variáveis de ambiente

```
SECRET_KEY=<openssl rand -hex 32>
ENVIRONMENT=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
```

---

## 🌐 Domínio Customizado

### Com Nginx (EC2/DigitalOcean)

```bash
# Atualize o nginx.conf com seu domínio
server_name api.seudominio.com www.api.seudominio.com;
```

### DNS

Configure os registros DNS no seu provedor (ex: Cloudflare, Route53):

```
Tipo    Nome              Valor
A       @                 <IP do servidor>
A       www               <IP do servidor>
CNAME   api               <IP do servidor>
```

---

## 🔒 SSL/HTTPS

### Com Let's Encrypt (Certbot)

```bash
# Instale o Certbot
sudo snap install certbot --classic

# Gere o certificado
sudo certbot certonly --standalone \
  -d seudominio.com \
  -d www.seudominio.com \
  --email seu@email.com \
  --agree-tos

# Certificados ficam em:
# /etc/letsencrypt/live/seudominio.com/fullchain.pem
# /etc/letsencrypt/live/seudominio.com/privkey.pem
```

### Atualize o nginx.conf para SSL

```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name seudominio.com www.seudominio.com;

    ssl_certificate /etc/letsencrypt/live/seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # ... resto da configuração
}
```

### Renovação Automática

```bash
# O certbot já configura renovação automática via cron
# Verifique com:
sudo certbot renew --dry-run
```

---

## 📊 Monitoramento

### Logs dos Containers

```bash
# Ver logs em tempo real
docker-compose -f docker-compose.prod.yml logs -f

# Logs de um serviço específico
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Health Checks

O `docker-compose.prod.yml` configura health checks automáticos. Verifique com:

```bash
docker-compose -f docker-compose.prod.yml ps
# STATUS deve ser "Up (healthy)"
```

### Métricas do Sistema

```bash
# Uso de recursos dos containers
docker stats

# Verificar espaço em disco
df -h
du -sh /var/lib/docker/volumes/
```

### Alertas Recomendados

Configure alertas para:
- CPU > 80% por 5 minutos
- Memória > 90%
- Disco > 85%
- Endpoint `/api/v1/health` retornando erro
- Erros 5xx no Nginx

---

## 💾 Backups

### Backup do PostgreSQL

```bash
# Backup manual
docker-compose -f docker-compose.prod.yml exec db \
  pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker-compose -f docker-compose.prod.yml exec -T db \
  psql -U $POSTGRES_USER $POSTGRES_DB < backup_20260120_120000.sql
```

### Backup Automático (Cron)

```bash
# Adicione ao crontab: crontab -e
# Backup diário às 2h da manhã, mantém últimos 7 dias
0 2 * * * /home/ubuntu/logistica-saas-2026/scripts/backup.sh

# Conteúdo de scripts/backup.sh:
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

docker-compose -f /home/ubuntu/logistica-saas-2026/docker-compose.prod.yml exec -T db \
  pg_dump -U postgres logistica_saas > "$BACKUP_DIR/db_$TIMESTAMP.sql"

# Mantém apenas últimos 7 backups
ls -t $BACKUP_DIR/db_*.sql | tail -n +8 | xargs rm -f
```

---

## 📈 Scaling

### Horizontal (múltiplas instâncias)

Para escalar o backend horizontalmente:

```yaml
# docker-compose.prod.yml
backend:
  deploy:
    replicas: 3  # 3 instâncias
```

E configure o Nginx para load balancing:

```nginx
upstream backend {
    least_conn;
    server backend_1:8000;
    server backend_2:8000;
    server backend_3:8000;
}
```

### Vertical (mais recursos por container)

```yaml
# docker-compose.prod.yml
backend:
  deploy:
    resources:
      limits:
        cpus: '4.0'     # Aumente conforme necessário
        memory: 2G
```

### Workers Celery

Para processar mais rotas simultaneamente, aumente a concorrência:

```yaml
worker:
  command: celery -A app.workers.celery_app worker --loglevel=warning --concurrency=8
  deploy:
    replicas: 2  # 2 workers com 8 processos cada = 16 tarefas paralelas
```
