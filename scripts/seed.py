"""
Script para popular o banco de dados com dados de teste.
Execute com: python -c 'from scripts.seed import seed_database; seed_database()'
"""

import os
import hashlib
import secrets
from datetime import datetime, timedelta


def hash_password(password: str) -> str:
    """Gera hash simples para senha de teste (use bcrypt em produção)."""
    salt = secrets.token_hex(16)
    hashed = hashlib.sha256(f"{salt}{password}".encode()).hexdigest()
    return f"{salt}:{hashed}"


def seed_database():
    """Popula o banco de dados com dados de teste."""
    try:
        # Importações do projeto (ajuste conforme a estrutura real)
        from database import SessionLocal, engine
        from models import Base, Company, User, Vehicle, Driver, Delivery, Route

        Base.metadata.create_all(bind=engine)
        db = SessionLocal()

        # Verificar se dados já existem
        if db.query(Company).first():
            print("✅ Dados de teste já existem, pulando seed.")
            db.close()
            return

        print("📦 Inserindo dados de teste...")

        # 1. Empresa de teste
        company = Company(
            name="TechLogistics Demo",
            email="contato@techlogistics.com",
            phone="+55 11 99999-0000",
            address="Av. Paulista, 1000, São Paulo, SP",
            active=True,
            created_at=datetime.utcnow(),
        )
        db.add(company)
        db.flush()

        # 2. Usuários
        admin_user = User(
            company_id=company.id,
            name="Administrador",
            email="admin@techlogistics.com",
            password_hash=hash_password("Admin@123456"),
            role="admin",
            active=True,
            created_at=datetime.utcnow(),
        )
        operator_user = User(
            company_id=company.id,
            name="Operador Logística",
            email="operador@techlogistics.com",
            password_hash=hash_password("Operador@123456"),
            role="operator",
            active=True,
            created_at=datetime.utcnow(),
        )
        db.add_all([admin_user, operator_user])
        db.flush()

        # 3. Veículos
        vehicles = [
            Vehicle(
                company_id=company.id,
                plate="ABC-1234",
                model="Fiat Fiorino",
                year=2022,
                capacity_kg=650,
                active=True,
            ),
            Vehicle(
                company_id=company.id,
                plate="DEF-5678",
                model="VW Saveiro",
                year=2021,
                capacity_kg=750,
                active=True,
            ),
            Vehicle(
                company_id=company.id,
                plate="GHI-9012",
                model="Ford Transit",
                year=2023,
                capacity_kg=1500,
                active=True,
            ),
        ]
        db.add_all(vehicles)
        db.flush()

        # 4. Motoristas
        drivers = [
            Driver(
                company_id=company.id,
                name="João Silva",
                license="12345678901",
                phone="+55 11 91111-1111",
                active=True,
            ),
            Driver(
                company_id=company.id,
                name="Maria Santos",
                license="98765432100",
                phone="+55 11 92222-2222",
                active=True,
            ),
            Driver(
                company_id=company.id,
                name="Carlos Oliveira",
                license="11122233344",
                phone="+55 11 93333-3333",
                active=True,
            ),
        ]
        db.add_all(drivers)
        db.flush()

        # 5. Entregas de teste
        deliveries = []
        addresses = [
            ("Rua das Flores, 100", "São Paulo", "SP", "-23.550520", "-46.633308"),
            ("Av. Brigadeiro Faria Lima, 200", "São Paulo", "SP", "-23.568168", "-46.691263"),
            ("Rua Oscar Freire, 300", "São Paulo", "SP", "-23.561040", "-46.672910"),
            ("Av. Rebouças, 400", "São Paulo", "SP", "-23.558370", "-46.660750"),
            ("Rua Haddock Lobo, 500", "São Paulo", "SP", "-23.554230", "-46.664480"),
            ("Av. Paulista, 600", "São Paulo", "SP", "-23.561414", "-46.655881"),
            ("Rua Augusta, 700", "São Paulo", "SP", "-23.554870", "-46.657430"),
            ("Av. Consolação, 800", "São Paulo", "SP", "-23.551180", "-46.658250"),
            ("Rua da Consolação, 900", "São Paulo", "SP", "-23.549260", "-46.651980"),
            ("Av. São Luís, 1000", "São Paulo", "SP", "-23.543690", "-46.642540"),
        ]
        statuses = ["pending", "in_transit", "delivered", "pending", "pending",
                    "in_transit", "delivered", "pending", "pending", "delivered"]

        for i, (street, city, state, lat, lng) in enumerate(addresses):
            delivery = Delivery(
                company_id=company.id,
                recipient_name=f"Cliente {i + 1}",
                recipient_phone=f"+55 11 9{i}000-000{i}",
                address=street,
                city=city,
                state=state,
                latitude=float(lat),
                longitude=float(lng),
                weight_kg=round(1.5 + i * 0.5, 1),
                status=statuses[i],
                scheduled_date=(datetime.utcnow() + timedelta(days=i % 3)).date(),
                created_at=datetime.utcnow(),
            )
            deliveries.append(delivery)

        db.add_all(deliveries)
        db.flush()

        # 6. Rotas otimizadas
        routes = [
            Route(
                company_id=company.id,
                vehicle_id=vehicles[0].id,
                driver_id=drivers[0].id,
                name="Rota Centro SP - Manhã",
                status="active",
                date=datetime.utcnow().date(),
                created_at=datetime.utcnow(),
            ),
            Route(
                company_id=company.id,
                vehicle_id=vehicles[1].id,
                driver_id=drivers[1].id,
                name="Rota Zona Sul SP - Tarde",
                status="active",
                date=datetime.utcnow().date(),
                created_at=datetime.utcnow(),
            ),
        ]
        db.add_all(routes)
        db.commit()

        print("✅ Dados de teste inseridos com sucesso!")
        print(f"   🏢 Empresa: {company.name}")
        print(f"   👤 Admin: admin@techlogistics.com / Admin@123456")
        print(f"   👤 Operador: operador@techlogistics.com / Operador@123456")
        print(f"   🚗 Veículos: {len(vehicles)}")
        print(f"   🧑 Motoristas: {len(drivers)}")
        print(f"   📦 Entregas: {len(deliveries)}")
        print(f"   🗺️  Rotas: {len(routes)}")
        db.close()

    except ImportError:
        # Fallback: exibe mensagem informativa se os modelos não existirem ainda
        print("⚠️  Módulos do projeto não encontrados.")
        print("   Este script deve ser executado dentro do container do backend.")
        print("   Uso: heroku run \"cd backend && python -c 'from scripts.seed import seed_database; seed_database()'\"")
    except Exception as e:
        print(f"❌ Erro ao popular banco de dados: {e}")
        raise


if __name__ == "__main__":
    seed_database()
