# Deploy no Heroku em 5 Minutos

## Pré-requisitos

1. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) instalado
2. [Git](https://git-scm.com/) instalado
3. Conta gratuita em [heroku.com](https://heroku.com)

---

## 1 Comando para Deploy

```bash
./deploy.sh seu-app-nome-unico
```

> Substitua `seu-app-nome-unico` por um nome único (ex: `logistica-minha-empresa`).

---

## O Que Acontece (Timeline)

| # | Etapa | Tempo |
|---|-------|-------|
| 1 | Verificação de pré-requisitos | ~5s |
| 2 | Login no Heroku | ~10s |
| 3 | Criação do app | ~15s |
| 4 | Adição do PostgreSQL | ~30s |
| 5 | Adição do Redis | ~30s |
| 6 | Configuração de variáveis | ~10s |
| 7 | Deploy do código | ~60s |
| 8 | Execução das migrations | ~20s |
| 9 | Seed dos dados de teste | ~15s |
| ✅ | **App online!** | **~3 min** |

---

## Credenciais de Acesso

Após o deploy, acesse seu app com:

| Campo | Valor |
|-------|-------|
| Email | `admin@techlogistics.com` |
| Senha | `Admin@123456` |

---

## URLs do App

| Recurso | URL |
|---------|-----|
| Frontend | `https://seu-app.herokuapp.com` |
| API REST | `https://seu-app.herokuapp.com/api/v1` |
| Documentação | `https://seu-app.herokuapp.com/docs` |

---

## Comandos Úteis

```bash
# Ver logs em tempo real
heroku logs --tail --app=seu-app

# Reiniciar o app
heroku restart --app=seu-app

# Abrir no navegador
heroku open --app=seu-app

# Ver variáveis de ambiente
heroku config --app=seu-app
```

---

## Troubleshooting

### ❌ Problema: "Heroku CLI não encontrado"
```bash
# Instale o Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh
```

### ❌ Problema: "Deploy falhou"
```bash
# Verifique os logs para identificar o erro
heroku logs --tail --app=seu-app
```

### ❌ Problema: "Migration falhou"
```bash
# Execute as migrations manualmente
heroku run "cd backend && alembic upgrade head" --app=seu-app
```
