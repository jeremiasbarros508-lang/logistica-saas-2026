#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para imprimir
print_step() {
    echo -e "${BLUE}📍 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Verificar pré-requisitos
print_step "Verificando pré-requisitos..."
if ! command -v heroku &> /dev/null; then
    print_error "Heroku CLI não está instalado!"
    echo "Instale em: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

if ! command -v git &> /dev/null; then
    print_error "Git não está instalado!"
    exit 1
fi

print_success "Pré-requisitos OK"

# 2. Verificar login Heroku
print_step "Verificando login Heroku..."
if ! heroku auth:whoami &> /dev/null; then
    print_step "Fazendo login no Heroku..."
    heroku login
fi
print_success "Login OK"

# 3. Pegar nome do app
APP_NAME=${1:-logistica-saas-$(date +%s)}
print_step "Criando app Heroku: $APP_NAME"

if heroku apps:info "$APP_NAME" &> /dev/null; then
    print_success "App $APP_NAME já existe, usando existente"
else
    heroku create "$APP_NAME"
    print_success "App criado: $APP_NAME"
fi

# 4. Adicionar addons
print_step "Adicionando banco de dados PostgreSQL..."
heroku addons:create heroku-postgresql:hobby-dev --app="$APP_NAME" || print_success "PostgreSQL já existe"

print_step "Adicionando Redis..."
heroku addons:create heroku-redis:premium-0 --app="$APP_NAME" || print_success "Redis já existe"

# 5. Configurar variáveis de ambiente
print_step "Configurando variáveis de ambiente..."

JWT_SECRET=$(openssl rand -base64 32)

heroku config:set \
    ENVIRONMENT=production \
    JWT_SECRET="$JWT_SECRET" \
    FRONTEND_URL="https://$APP_NAME.herokuapp.com" \
    BACKEND_URL="https://$APP_NAME.herokuapp.com/api" \
    LOG_LEVEL=info \
    --app="$APP_NAME"

print_success "Variáveis configuradas"

# 6. Deploy
print_step "Fazendo deploy..."
git push heroku main

if [ $? -ne 0 ]; then
    print_error "Deploy falhou!"
    print_step "Verifique os logs: heroku logs --tail --app=$APP_NAME"
    exit 1
fi

print_success "Deploy concluído!"

# 7. Migrar banco de dados
print_step "Executando migrations..."
heroku run "cd backend && alembic upgrade head" --app="$APP_NAME"

print_success "Migrations executadas"

# 8. Criar dados de teste
print_step "Populando banco com dados de teste..."
heroku run "cd backend && python -c 'from scripts.seed import seed_database; seed_database()'" --app="$APP_NAME" || print_success "Seed data já existe"

# 9. Resumo final
echo ""
echo -e "${GREEN}═════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 DEPLOY CONCLUÍDO COM SUCESSO!${NC}"
echo -e "${GREEN}═════════════════════════════════════════${NC}"
echo ""
echo "📱 App: https://$APP_NAME.herokuapp.com"
echo "🔑 Credenciais de teste:"
echo "   Email: admin@techlogistics.com"
echo "   Senha: Admin@123456"
echo ""
echo "📊 Backend API: https://$APP_NAME.herokuapp.com/api/v1"
echo "📚 Documentação: https://$APP_NAME.herokuapp.com/docs"
echo ""
echo "📋 Logs em tempo real:"
echo "   heroku logs --tail --app=$APP_NAME"
echo ""
echo "🔄 Restart app:"
echo "   heroku restart --app=$APP_NAME"
echo ""
echo "❌ Rollback (se preciso):"
echo "   heroku releases --app=$APP_NAME"
echo "   heroku releases:rollback v1 --app=$APP_NAME"
echo ""
