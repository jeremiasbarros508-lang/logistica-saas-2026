# 🤝 Contributing — Logística SaaS

## Índice

- [Como Contribuir](#-como-contribuir)
- [Configurando o Ambiente](#-configurando-o-ambiente)
- [Workflow de PRs](#-workflow-de-prs)
- [Code Style](#-code-style)
- [Testes](#-testes)
- [Convenções de Commit](#-convenções-de-commit)

---

## 🌟 Como Contribuir

Contribuições são bem-vindas! Você pode contribuir de diversas formas:

- 🐛 Reportar bugs
- 💡 Sugerir novas features
- 📖 Melhorar a documentação
- 🔧 Enviar pull requests com correções ou melhorias

### Antes de Começar

1. Leia este documento completamente
2. Veja os [issues abertos](https://github.com/jeremiasbarros508-lang/logistica-saas-2026/issues) para evitar trabalho duplicado
3. Para features grandes, abra um issue primeiro para discussão

---

## ⚙️ Configurando o Ambiente

```bash
# 1. Fork o repositório no GitHub

# 2. Clone seu fork
git clone https://github.com/<YOUR_USERNAME>/logistica-saas-2026.git
cd logistica-saas-2026

# 3. Adicione o upstream remoto
git remote add upstream https://github.com/jeremiasbarros508-lang/logistica-saas-2026.git

# 4. Configure o ambiente
cp .env.example .env
# Edite .env com suas configurações locais

# 5. Suba os serviços
docker-compose up -d

# 6. Execute as migrações
docker-compose exec backend alembic upgrade head
```

---

## 🔄 Workflow de PRs

### 1. Sincronize com o upstream

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Crie uma branch

```bash
# Use o formato: tipo/descricao-curta
git checkout -b feat/importacao-xml
git checkout -b fix/erro-calculo-distancia
git checkout -b docs/melhorar-setup-md
```

### 3. Faça as alterações

- Escreva código limpo e seguindo o code style do projeto
- Adicione testes para novos comportamentos
- Atualize a documentação se necessário

### 4. Teste suas alterações

```bash
# Backend
docker-compose exec backend pytest
docker-compose exec backend ruff check .

# Frontend
docker-compose exec frontend npm run lint
docker-compose exec frontend npm run build
```

### 5. Commit e push

```bash
git add .
git commit -m "feat: adiciona importação de entregas via XML"
git push origin feat/importacao-xml
```

### 6. Abra o Pull Request

- Título claro e descritivo
- Descreva o que foi feito e por quê
- Referencie o issue relacionado (`Closes #42`)
- Adicione screenshots para mudanças visuais

### Critérios de Aprovação

- [ ] Testes passando (CI verde)
- [ ] Sem conflitos com `main`
- [ ] Code style adequado
- [ ] Documentação atualizada se necessário
- [ ] Revisão aprovada por ao menos 1 mantenedor

---

## 🎨 Code Style

### Backend (Python)

- **Formatador:** `ruff format` (compatível com Black)
- **Linter:** `ruff check`
- **Type hints:** obrigatório em funções públicas
- **Docstrings:** Google style para funções complexas
- **Imports:** `isort` (gerenciado pelo ruff)

```python
# ✅ Bom
async def create_delivery(
    db: AsyncSession,
    company_id: UUID,
    data: DeliveryCreate,
) -> Delivery:
    """Cria uma nova entrega para a empresa.

    Args:
        db: Sessão do banco de dados.
        company_id: ID da empresa.
        data: Dados da entrega.

    Returns:
        Entrega criada.
    """
    delivery = Delivery(company_id=company_id, **data.model_dump())
    db.add(delivery)
    await db.commit()
    await db.refresh(delivery)
    return delivery

# ❌ Ruim
def createDelivery(db, company, data):
    d = Delivery(**data)
    db.add(d)
    db.commit()
    return d
```

### Frontend (TypeScript/React)

- **Formatador:** Prettier (configurado no `.prettierrc`)
- **Linter:** ESLint com regras Next.js
- **Componentes:** Functional components com TypeScript
- **Imports:** Absolutos usando alias `@/`
- **Nomes:** PascalCase para componentes, camelCase para funções/variáveis

```typescript
// ✅ Bom
interface DeliveryCardProps {
  delivery: Delivery;
  onEdit: (id: string) => void;
}

export function DeliveryCard({ delivery, onEdit }: DeliveryCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">{delivery.recipient_name}</h3>
      <p className="text-sm text-muted-foreground">{delivery.address}</p>
    </div>
  );
}

// ❌ Ruim
export default function delivery_card(props: any) {
  return <div>{props.delivery.recipient_name}</div>
}
```

---

## 🧪 Testes

### Backend

```bash
# Rodar todos os testes
docker-compose exec backend pytest

# Com cobertura
docker-compose exec backend pytest --cov=app --cov-report=term-missing

# Testes específicos
docker-compose exec backend pytest tests/unit/test_algorithms.py -v
```

**Estrutura de testes:**
```
tests/
├── unit/               # Testes unitários (sem banco de dados)
│   ├── test_algorithms.py
│   ├── test_validators.py
│   └── test_security.py
└── integration/        # Testes de integração (com banco em memória)
    ├── test_auth.py
    ├── test_deliveries.py
    └── test_routes.py
```

**Diretrizes:**
- Novos comportamentos devem ter testes
- Use fixtures do pytest para dados de teste
- Mocks para serviços externos (Google Maps, etc.)
- Cobertura mínima: 80%

### Frontend

```bash
# Verificação de tipos
docker-compose exec frontend npx tsc --noEmit

# Linting
docker-compose exec frontend npm run lint
```

---

## 📝 Convenções de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org):

```
<tipo>(<escopo>): <descrição curta>

[corpo opcional]

[rodapé opcional]
```

**Tipos:**

| Tipo | Descrição |
|------|-----------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Mudanças na documentação |
| `style` | Formatação, sem mudança de lógica |
| `refactor` | Refatoração sem nova funcionalidade ou fix |
| `test` | Adição ou correção de testes |
| `chore` | Tarefas de manutenção (deps, build, etc.) |
| `perf` | Melhoria de performance |
| `ci` | Mudanças no CI/CD |

**Exemplos:**

```bash
feat(routes): adiciona algoritmo 3-opt para otimização
fix(auth): corrige expiração do refresh token
docs(api): documenta endpoint de importação CSV
test(algorithms): adiciona testes para nearest neighbor
chore(deps): atualiza fastapi para 0.115.6
```

### Breaking Changes

Para mudanças que quebram compatibilidade:

```bash
feat!: remove suporte ao formato CSV legado

BREAKING CHANGE: O endpoint POST /deliveries/import agora requer
o header Content-Type: multipart/form-data ao invés de
application/json.
```
