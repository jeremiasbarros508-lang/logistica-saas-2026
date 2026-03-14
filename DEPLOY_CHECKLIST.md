# ✅ Checklist de Deploy — SaaS de Roteirização Logística

> Use este checklist antes e depois de cada deploy para garantir que tudo está funcionando corretamente.

---

## 📋 Índice

- [Antes do Deploy](#antes-do-deploy)
- [Durante o Deploy](#durante-o-deploy)
- [Depois do Deploy](#depois-do-deploy)
- [Se der erro](#se-der-erro)

---

## Antes do Deploy

> ⏱️ **Tempo estimado:** 10 minutos

Execute cada item abaixo antes de fazer o deploy:

### Código e Testes

- [ ] ✅ **Testado localmente com sucesso** — `docker-compose up` funcionou sem erros
- [ ] ✅ **Testes automatizados passando** — `pytest` (ou equivalente) com 0 falhas
- [ ] ✅ **Código commitado no branch correto** — geralmente `main`

```bash
# Verificar status do git
git status

# Verificar branch atual
git branch

# Commitar tudo pendente
git add .
git commit -m "chore: preparar para deploy"
```

### Banco de Dados

- [ ] ✅ **Migrations criadas** para todas as alterações de schema
- [ ] ✅ **Migrations testadas localmente** — `alembic upgrade head` sem erros
- [ ] ✅ **Banco de dados validado** — dados de teste inseridos e consultados com sucesso

```bash
# Verificar migrations pendentes
cd backend && alembic current
cd backend && alembic heads
```

### Segurança

- [ ] ✅ **Arquivo `.env` NÃO foi commitado** — verifique com `git status`
- [ ] ✅ **Arquivo `.env.local` NÃO foi commitado**
- [ ] ✅ **Senhas e secrets não estão no código-fonte**
- [ ] ✅ **`JWT_SECRET` configurado** com valor aleatório e seguro (mínimo 32 chars)

```bash
# Verificar se arquivos sensíveis não estão sendo rastreados
git ls-files | grep -E "\.env$|\.env\.local$|secrets"

# Gerar JWT_SECRET seguro
openssl rand -hex 32
```

### Variáveis de Ambiente

- [ ] ✅ **Todas as variáveis obrigatórias configuradas** no Heroku:
  - `JWT_SECRET`
  - `ENVIRONMENT=production`
  - `DATABASE_URL` (automático via add-on)

```bash
# Verificar variáveis configuradas
heroku config --app seu-app-nome
```

### Build

- [ ] ✅ **`Procfile` existe** na raiz do projeto
- [ ] ✅ **`requirements.txt` atualizado** com todas as dependências
- [ ] ✅ **`runtime.txt` correto** (ex: `python-3.11.x`)

---

## Durante o Deploy

> ⏱️ **Tempo estimado:** 5 minutos (aguardando)

```bash
# Fazer o deploy
git push heroku main

# Acompanhar logs do build em tempo real
heroku logs --tail --app seu-app-nome
```

**O que observar nos logs:**

- [ ] ✅ `Installing dependencies from requirements.txt` — sem erros
- [ ] ✅ `Running release command: alembic upgrade head` — migrations OK
- [ ] ✅ `Launching...` — app iniciado
- [ ] ✅ `deployed to Heroku` — deploy concluído

---

## Depois do Deploy

> ⏱️ **Tempo estimado:** 5 minutos

Verifique cada item abaixo após o deploy:

### Disponibilidade

- [ ] ✅ **App está online** — `heroku open` abre o navegador sem erro
- [ ] ✅ **Health check responde** — `https://seu-app.herokuapp.com/health` retorna `{"status": "healthy"}`
- [ ] ✅ **Frontend carrega** — página principal renderiza corretamente

### Funcionalidades Principais

- [ ] ✅ **Login funciona** — credenciais de teste autenticam com sucesso
- [ ] ✅ **Dashboard mostra dados** — cards e gráficos carregam
- [ ] ✅ **API responde corretamente** — `https://seu-app.herokuapp.com/docs` carrega o Swagger

### Segurança

- [ ] ✅ **SSL está ativo** — URL começa com `https://`
- [ ] ✅ **Logs não mostram erros** — nenhum `ERROR` ou `CRITICAL` nos logs

```bash
# Verificar logs após deploy
heroku logs -n 100 --app seu-app-nome

# Testar health check
curl https://seu-app.herokuapp.com/health

# Testar login
curl -X POST https://seu-app.herokuapp.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@techlogistics.com", "password": "Admin@123456"}'
```

---

## Se der erro

> Não entre em pânico! Siga os passos abaixo:

### Diagnóstico rápido

- [ ] 📋 **Ver logs** para identificar o erro:

```bash
heroku logs --tail --app seu-app-nome
```

- [ ] 🔄 **Reiniciar o app** (resolve muitos problemas transitórios):

```bash
heroku restart --app seu-app-nome
```

- [ ] ⏪ **Rollback** para a versão anterior (se o erro for crítico):

```bash
# Ver versões disponíveis
heroku releases --app seu-app-nome

# Fazer rollback para versão específica
heroku releases:rollback v42 --app seu-app-nome
```

- [ ] 🆘 **Contactar suporte** do Heroku se o problema persistir:
  - Status do Heroku: https://status.heroku.com
  - Suporte: https://help.heroku.com

### Erros comuns e soluções rápidas

| Erro | Causa Provável | Solução |
|------|---------------|---------|
| H10 - App crashed | Variável de ambiente faltando | `heroku config --app` |
| H14 - No web dynos running | Dyno não foi iniciado | `heroku ps:scale web=1` |
| R10 - Boot timeout | App demora muito para subir | Verificar logs de startup |
| H12 - Request timeout | Endpoint muito lento | Otimizar query ou aumentar timeout |
| Banco não conecta | `DATABASE_URL` incorreto | Verificar add-on PostgreSQL |

---

## 📚 Links Relacionados

- 🧪 **Testar localmente?** → [TESTING.md](./TESTING.md)
- 🚀 **Guia completo de deploy?** → [HEROKU_DEPLOY.md](./HEROKU_DEPLOY.md)
- 📖 **Documentação geral?** → [README.md](./README.md)
- 🔧 **Heroku Status** → https://status.heroku.com
- 📚 **Heroku Dev Center** → https://devcenter.heroku.com
