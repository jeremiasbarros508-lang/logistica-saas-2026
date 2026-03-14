-- =============================================================
-- Logística SaaS 2026 — Seed Data para Testes
-- =============================================================
-- Uso:
--   docker compose cp seed-data.sql postgres:/tmp/seed-data.sql
--   docker compose exec postgres psql -U saas_user -d logistica_saas -f /tmp/seed-data.sql
--
-- Credenciais dos usuários gerados:
--   Admin:    admin@techlogistics.com   / Admin@123456
--   Operador: operador@techlogistics.com / Operador@123456
--
-- Para gerar novos hashes bcrypt em Python:
--   import bcrypt
--   print(bcrypt.hashpw(b'SuaSenha', bcrypt.gensalt(12)).decode())
-- =============================================================

BEGIN;

-- =============================================================
-- 1. COMPANY (Empresa de Teste)
-- =============================================================

INSERT INTO companies (
    id,
    name,
    email,
    plan,
    is_active,
    settings,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'TechLogistics Inc',
    'admin@techlogistics.com',
    'premium',
    TRUE,
    '{"timezone": "America/Sao_Paulo", "currency": "BRL", "distance_unit": "km", "language": "pt-BR"}',
    NOW() - INTERVAL '30 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- 2. USERS (Usuários)
-- =============================================================

-- Admin
-- Senha: Admin@123456
INSERT INTO users (
    id,
    company_id,
    email,
    full_name,
    hashed_password,
    role,
    is_active,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    'admin@techlogistics.com',
    'Administrador TechLogistics',
    '$2b$12$3kD/b4ojmeCtN27PnX1LJuUquKCuHBaxWRNiw3NPlxyjyM8rXUbtK',
    'admin',
    TRUE,
    NOW() - INTERVAL '30 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Operador
-- Senha: Operador@123456
INSERT INTO users (
    id,
    company_id,
    email,
    full_name,
    hashed_password,
    role,
    is_active,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    'operador@techlogistics.com',
    'Operador Logístico',
    '$2b$12$ir.VbC8yBA66T8xhzSQIseGxeonkIQ20stUw2HvVBwYHS7ikdJpWO',
    'operator',
    TRUE,
    NOW() - INTERVAL '25 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- 3. VEHICLES (Veículos)
-- =============================================================

-- Van 1
INSERT INTO vehicles (
    id,
    company_id,
    name,
    plate,
    type,
    capacity_kg,
    volume_m3,
    fuel_type,
    fuel_consumption_km_l,
    year,
    model,
    color,
    status,
    notes,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440000',
    'Van 1',
    'ABC-1234',
    'van',
    1000.00,
    8.0,
    'flex',
    12.5,
    2022,
    'Fiat Ducato',
    'Branco',
    'available',
    'Veículo principal para entregas urbanas',
    NOW() - INTERVAL '20 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Van 2
INSERT INTO vehicles (
    id,
    company_id,
    name,
    plate,
    type,
    capacity_kg,
    volume_m3,
    fuel_type,
    fuel_consumption_km_l,
    year,
    model,
    color,
    status,
    notes,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440000',
    'Van 2',
    'DEF-5678',
    'van',
    800.00,
    6.0,
    'gasoline',
    11.0,
    2021,
    'Renault Master',
    'Prata',
    'available',
    'Veículo secundário para demanda extra',
    NOW() - INTERVAL '20 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Truck 1
INSERT INTO vehicles (
    id,
    company_id,
    name,
    plate,
    type,
    capacity_kg,
    volume_m3,
    fuel_type,
    fuel_consumption_km_l,
    year,
    model,
    color,
    status,
    notes,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440000',
    'Truck 1',
    'GHI-9012',
    'truck',
    5000.00,
    30.0,
    'diesel',
    8.0,
    2020,
    'Mercedes Atego',
    'Branco',
    'available',
    'Caminhão para cargas pesadas e grandes volumes',
    NOW() - INTERVAL '20 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- 4. DRIVERS (Motoristas)
-- =============================================================

-- João Silva
INSERT INTO drivers (
    id,
    company_id,
    full_name,
    email,
    phone,
    cnh_number,
    cnh_category,
    cnh_expiry,
    status,
    notes,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440020',
    '550e8400-e29b-41d4-a716-446655440000',
    'João Silva',
    'joao.silva@techlogistics.com',
    '(11) 99111-1111',
    '12345678901',
    'B',
    '2027-03-15',
    'available',
    '5 anos de experiência em entregas urbanas em São Paulo',
    NOW() - INTERVAL '15 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Maria Santos
INSERT INTO drivers (
    id,
    company_id,
    full_name,
    email,
    phone,
    cnh_number,
    cnh_category,
    cnh_expiry,
    status,
    notes,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440021',
    '550e8400-e29b-41d4-a716-446655440000',
    'Maria Santos',
    'maria.santos@techlogistics.com',
    '(11) 99222-2222',
    '98765432101',
    'B',
    '2026-11-20',
    'available',
    'Especialista em zona sul de São Paulo',
    NOW() - INTERVAL '15 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Pedro Oliveira
INSERT INTO drivers (
    id,
    company_id,
    full_name,
    email,
    phone,
    cnh_number,
    cnh_category,
    cnh_expiry,
    status,
    notes,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440022',
    '550e8400-e29b-41d4-a716-446655440000',
    'Pedro Oliveira',
    'pedro.oliveira@techlogistics.com',
    '(11) 99333-3333',
    '11223344556',
    'C',
    '2028-07-10',
    'available',
    'Habilitado para veículos pesados (categoria C)',
    NOW() - INTERVAL '10 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- 5. DELIVERIES (Entregas — coordenadas reais de São Paulo)
-- =============================================================

-- Entrega 1 — Av. Paulista
INSERT INTO deliveries (
    id,
    company_id,
    customer_name,
    customer_phone,
    customer_email,
    address,
    address_complement,
    latitude,
    longitude,
    weight_kg,
    volume_m3,
    priority,
    status,
    notes,
    scheduled_date,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440030',
    '550e8400-e29b-41d4-a716-446655440000',
    'Empresa Alpha Ltda',
    '(11) 3111-1111',
    'contato@alpha.com.br',
    'Av. Paulista, 1374 - Bela Vista, São Paulo, SP, 01310-100',
    '10º Andar',
    -23.5630,
    -46.6543,
    25.0,
    0.3,
    'high',
    'pending',
    'Entregar ao responsável de TI. Ligar antes: (11) 99100-1111',
    CURRENT_DATE + INTERVAL '1 day',
    NOW() - INTERVAL '2 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Entrega 2 — Av. Faria Lima
INSERT INTO deliveries (
    id,
    company_id,
    customer_name,
    customer_phone,
    customer_email,
    address,
    address_complement,
    latitude,
    longitude,
    weight_kg,
    volume_m3,
    priority,
    status,
    notes,
    scheduled_date,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440031',
    '550e8400-e29b-41d4-a716-446655440000',
    'Financeira Beta S/A',
    '(11) 3222-2222',
    'financeiro@beta.com.br',
    'Av. Brigadeiro Faria Lima, 3000 - Itaim Bibi, São Paulo, SP, 01451-000',
    'Torre B, Sala 502',
    -23.5680,
    -46.6918,
    8.0,
    0.1,
    'urgent',
    'pending',
    'URGENTE: Documentos para reunião das 14h',
    CURRENT_DATE + INTERVAL '1 day',
    NOW() - INTERVAL '1 day',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Entrega 3 — Rua Oscar Freire (Jardins)
INSERT INTO deliveries (
    id,
    company_id,
    customer_name,
    customer_phone,
    customer_email,
    address,
    address_complement,
    latitude,
    longitude,
    weight_kg,
    volume_m3,
    priority,
    status,
    notes,
    scheduled_date,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440032',
    '550e8400-e29b-41d4-a716-446655440000',
    'Boutique Gama',
    '(11) 3333-3333',
    'loja@gama.com.br',
    'Rua Oscar Freire, 200 - Jardins, São Paulo, SP, 01426-001',
    NULL,
    -23.5621,
    -46.6695,
    5.5,
    0.2,
    'medium',
    'pending',
    'Caixas frágeis — MANUSEIO CUIDADOSO',
    CURRENT_DATE + INTERVAL '1 day',
    NOW() - INTERVAL '3 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Entrega 4 — Vila Madalena
INSERT INTO deliveries (
    id,
    company_id,
    customer_name,
    customer_phone,
    customer_email,
    address,
    address_complement,
    latitude,
    longitude,
    weight_kg,
    volume_m3,
    priority,
    status,
    notes,
    scheduled_date,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440033',
    '550e8400-e29b-41d4-a716-446655440000',
    'Studio Delta Design',
    '(11) 3444-4444',
    'delta@design.com.br',
    'Rua Harmonia, 484 - Vila Madalena, São Paulo, SP, 05435-000',
    NULL,
    -23.5566,
    -46.6902,
    12.0,
    0.4,
    'low',
    'pending',
    'Entregar na recepção. Horário: 9h às 18h',
    CURRENT_DATE + INTERVAL '2 days',
    NOW() - INTERVAL '1 day',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Entrega 5 — Moema
INSERT INTO deliveries (
    id,
    company_id,
    customer_name,
    customer_phone,
    customer_email,
    address,
    address_complement,
    latitude,
    longitude,
    weight_kg,
    volume_m3,
    priority,
    status,
    notes,
    scheduled_date,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440034',
    '550e8400-e29b-41d4-a716-446655440000',
    'Consultoria Épsilon',
    '(11) 3555-5555',
    'compras@epsilon.com.br',
    'Av. Ibirapuera, 2907 - Moema, São Paulo, SP, 04029-200',
    'Bloco C, Sala 301',
    -23.5992,
    -46.6659,
    30.0,
    0.6,
    'medium',
    'pending',
    'Confirmar entrega com Francisco no local',
    CURRENT_DATE + INTERVAL '2 days',
    NOW() - INTERVAL '2 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Entrega 6 — Pinheiros
INSERT INTO deliveries (
    id,
    company_id,
    customer_name,
    customer_phone,
    customer_email,
    address,
    address_complement,
    latitude,
    longitude,
    weight_kg,
    volume_m3,
    priority,
    status,
    notes,
    scheduled_date,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440035',
    '550e8400-e29b-41d4-a716-446655440000',
    'Zeta Tecnologia EIRELI',
    '(11) 3666-6666',
    'ti@zeta.com.br',
    'Rua dos Pinheiros, 870 - Pinheiros, São Paulo, SP, 05422-001',
    'Sala 14',
    -23.5612,
    -46.6862,
    7.5,
    0.1,
    'high',
    'pending',
    'Equipamentos eletrônicos — não empilhar',
    CURRENT_DATE + INTERVAL '1 day',
    NOW() - INTERVAL '1 day',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Entrega 7 — Brooklin
INSERT INTO deliveries (
    id,
    company_id,
    customer_name,
    customer_phone,
    customer_email,
    address,
    address_complement,
    latitude,
    longitude,
    weight_kg,
    volume_m3,
    priority,
    status,
    notes,
    scheduled_date,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440036',
    '550e8400-e29b-41d4-a716-446655440000',
    'Eta Importações Ltda',
    '(11) 3777-7777',
    'importacao@eta.com.br',
    'Av. Santo Amaro, 2500 - Brooklin, São Paulo, SP, 04701-002',
    NULL,
    -23.6200,
    -46.6870,
    45.0,
    1.2,
    'medium',
    'pending',
    'Peças industriais — conferir quantidade na entrega',
    CURRENT_DATE + INTERVAL '3 days',
    NOW() - INTERVAL '4 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Entrega 8 — Tatuapé
INSERT INTO deliveries (
    id,
    company_id,
    customer_name,
    customer_phone,
    customer_email,
    address,
    address_complement,
    latitude,
    longitude,
    weight_kg,
    volume_m3,
    priority,
    status,
    notes,
    scheduled_date,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440037',
    '550e8400-e29b-41d4-a716-446655440000',
    'Theta Comércio e Varejo S/A',
    '(11) 3888-8888',
    'estoque@theta.com.br',
    'Rua Tuiuti, 1000 - Tatuapé, São Paulo, SP, 03307-001',
    NULL,
    -23.5350,
    -46.5680,
    60.0,
    2.0,
    'low',
    'pending',
    'Entrar pelo acesso de carga nos fundos',
    CURRENT_DATE + INTERVAL '3 days',
    NOW() - INTERVAL '1 day',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Entrega 9 — Santo André (Grande SP)
INSERT INTO deliveries (
    id,
    company_id,
    customer_name,
    customer_phone,
    customer_email,
    address,
    address_complement,
    latitude,
    longitude,
    weight_kg,
    volume_m3,
    priority,
    status,
    notes,
    scheduled_date,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440038',
    '550e8400-e29b-41d4-a716-446655440000',
    'Iota Indústria Metalúrgica',
    '(11) 4444-1111',
    'recepcao@iota.com.br',
    'Av. Industrial, 1500 - Santo André, SP, 09210-000',
    'Portaria Principal',
    -23.6610,
    -46.5260,
    120.0,
    4.0,
    'medium',
    'pending',
    'Entrega industrial — Precisa de empilhadeira no local',
    CURRENT_DATE + INTERVAL '4 days',
    NOW() - INTERVAL '2 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Entrega 10 — Campinas (já entregue — exemplo histórico)
INSERT INTO deliveries (
    id,
    company_id,
    customer_name,
    customer_phone,
    customer_email,
    address,
    address_complement,
    latitude,
    longitude,
    weight_kg,
    volume_m3,
    priority,
    status,
    notes,
    scheduled_date,
    delivered_at,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440039',
    '550e8400-e29b-41d4-a716-446655440000',
    'Kappa Software House',
    '(19) 3211-2233',
    'ti@kappa.com.br',
    'Av. Brasil, 800 - Centro, Campinas, SP, 13015-001',
    NULL,
    -22.9056,
    -47.0608,
    3.0,
    0.05,
    'high',
    'delivered',
    'Entregue com sucesso. Assinatura: Roberto Alves',
    CURRENT_DATE - INTERVAL '1 day',
    NOW() - INTERVAL '12 hours',
    NOW() - INTERVAL '3 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- 6. ROUTES (Rotas Exemplo)
-- =============================================================

-- Rota 1 — Zona Sul/Centro (já processada)
INSERT INTO routes (
    id,
    company_id,
    driver_id,
    vehicle_id,
    status,
    total_distance_km,
    estimated_duration_min,
    start_address,
    start_latitude,
    start_longitude,
    optimization_algorithm,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440050',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440020',
    '550e8400-e29b-41d4-a716-446655440010',
    'completed',
    38.4,
    87,
    'Depósito Central — Rua da Consolação, 1000 - Consolação, São Paulo, SP',
    -23.5480,
    -46.6565,
    'nearest_neighbor_2opt',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '1 day'
) ON CONFLICT (id) DO NOTHING;

-- Paradas da Rota 1
INSERT INTO route_stops (
    id,
    route_id,
    delivery_id,
    stop_order,
    estimated_arrival,
    actual_arrival,
    status,
    created_at
) VALUES
    (
        '550e8400-e29b-41d4-a716-446655440060',
        '550e8400-e29b-41d4-a716-446655440050',
        '550e8400-e29b-41d4-a716-446655440032',
        1,
        NOW() - INTERVAL '1 day 3 hours',
        NOW() - INTERVAL '1 day 2 hours 55 minutes',
        'delivered',
        NOW() - INTERVAL '2 days'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440061',
        '550e8400-e29b-41d4-a716-446655440050',
        '550e8400-e29b-41d4-a716-446655440030',
        2,
        NOW() - INTERVAL '1 day 2 hours',
        NOW() - INTERVAL '1 day 1 hour 50 minutes',
        'delivered',
        NOW() - INTERVAL '2 days'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440062',
        '550e8400-e29b-41d4-a716-446655440050',
        '550e8400-e29b-41d4-a716-446655440034',
        3,
        NOW() - INTERVAL '1 day 1 hour',
        NOW() - INTERVAL '1 day 55 minutes',
        'delivered',
        NOW() - INTERVAL '2 days'
    )
ON CONFLICT (id) DO NOTHING;

-- Rota 2 — Zona Oeste (ativa/em andamento)
INSERT INTO routes (
    id,
    company_id,
    driver_id,
    vehicle_id,
    status,
    total_distance_km,
    estimated_duration_min,
    start_address,
    start_latitude,
    start_longitude,
    optimization_algorithm,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440051',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440021',
    '550e8400-e29b-41d4-a716-446655440011',
    'in_progress',
    27.2,
    65,
    'Depósito Central — Rua da Consolação, 1000 - Consolação, São Paulo, SP',
    -23.5480,
    -46.6565,
    'nearest_neighbor_2opt',
    NOW() - INTERVAL '1 hour',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Paradas da Rota 2
INSERT INTO route_stops (
    id,
    route_id,
    delivery_id,
    stop_order,
    estimated_arrival,
    actual_arrival,
    status,
    created_at
) VALUES
    (
        '550e8400-e29b-41d4-a716-446655440063',
        '550e8400-e29b-41d4-a716-446655440051',
        '550e8400-e29b-41d4-a716-446655440033',
        1,
        NOW() + INTERVAL '15 minutes',
        NULL,
        'pending',
        NOW() - INTERVAL '1 hour'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440064',
        '550e8400-e29b-41d4-a716-446655440051',
        '550e8400-e29b-41d4-a716-446655440035',
        2,
        NOW() + INTERVAL '45 minutes',
        NULL,
        'pending',
        NOW() - INTERVAL '1 hour'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440065',
        '550e8400-e29b-41d4-a716-446655440051',
        '550e8400-e29b-41d4-a716-446655440031',
        3,
        NOW() + INTERVAL '75 minutes',
        NULL,
        'pending',
        NOW() - INTERVAL '1 hour'
    )
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- =============================================================
-- Verificação após inserção
-- =============================================================

SELECT 'companies' AS tabela, COUNT(*) AS registros FROM companies
    WHERE company_id = '550e8400-e29b-41d4-a716-446655440000'
       OR id = '550e8400-e29b-41d4-a716-446655440000'
UNION ALL
SELECT 'users',     COUNT(*) FROM users     WHERE company_id = '550e8400-e29b-41d4-a716-446655440000'
UNION ALL
SELECT 'vehicles',  COUNT(*) FROM vehicles  WHERE company_id = '550e8400-e29b-41d4-a716-446655440000'
UNION ALL
SELECT 'drivers',   COUNT(*) FROM drivers   WHERE company_id = '550e8400-e29b-41d4-a716-446655440000'
UNION ALL
SELECT 'deliveries',COUNT(*) FROM deliveries WHERE company_id = '550e8400-e29b-41d4-a716-446655440000'
UNION ALL
SELECT 'routes',    COUNT(*) FROM routes    WHERE company_id = '550e8400-e29b-41d4-a716-446655440000'
UNION ALL
SELECT 'route_stops',COUNT(*) FROM route_stops rs
    JOIN routes r ON r.id = rs.route_id
    WHERE r.company_id = '550e8400-e29b-41d4-a716-446655440000';
