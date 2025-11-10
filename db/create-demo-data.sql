-- 🎯 Créer des données de démonstration pour le mode développement
-- Ces données permettent à l'application de fonctionner sans authentification

-- 1️⃣ Créer un utilisateur demo
INSERT INTO users (id, email, full_name) 
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'demo@simplrh.com',
  'Utilisateur Demo'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name;

-- 2️⃣ Créer une organisation demo
INSERT INTO orgs (id, name, siret, billing_plan, modules, owner_id) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Entreprise Demo',
  '12345678901234',
  'starter',
  '{"billing": true, "people": true, "docs": true}'::jsonb,
  '00000000-0000-0000-0000-000000000002'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  siret = EXCLUDED.siret,
  billing_plan = EXCLUDED.billing_plan,
  modules = EXCLUDED.modules,
  owner_id = EXCLUDED.owner_id;

-- 3️⃣ Ajouter l'utilisateur comme membre de l'organisation
INSERT INTO members (org_id, user_id, role) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'owner'
) ON CONFLICT (org_id, user_id) DO NOTHING;

-- 4️⃣ Créer quelques données de test pour la démonstration

-- Clients de test
INSERT INTO customers (org_id, name, email, phone, address) VALUES
(
  '00000000-0000-0000-0000-000000000001',
  'ACME Corporation',
  'contact@acme.com',
  '01 23 45 67 89',
  '{"street": "123 Rue de la Paix", "city": "Paris", "postal_code": "75001", "country": "France"}'::jsonb
),
(
  '00000000-0000-0000-0000-000000000001',
  'Tech Solutions SAS',
  'info@techsolutions.fr',
  '01 98 76 54 32',
  '{"street": "456 Avenue des Champs", "city": "Lyon", "postal_code": "69001", "country": "France"}'::jsonb
)
ON CONFLICT DO NOTHING;

-- Employés de test
INSERT INTO employees (org_id, full_name, email, hire_date) VALUES
(
  '00000000-0000-0000-0000-000000000001',
  'Marie Dupont',
  'marie.dupont@entreprisedemo.com',
  '2023-01-15'
),
(
  '00000000-0000-0000-0000-000000000001',
  'Jean Martin',
  'jean.martin@entreprisedemo.com',
  '2023-03-20'
),
(
  '00000000-0000-0000-0000-000000000001',
  'Sophie Bernard',
  'sophie.bernard@entreprisedemo.com',
  '2023-06-10'
)
ON CONFLICT DO NOTHING;

-- Factures de test
INSERT INTO invoices (org_id, customer_id, number, issue_date, due_date, status, total_ht, total_ttc) 
SELECT 
  '00000000-0000-0000-0000-000000000001',
  c.id,
  'FACT-2024-001',
  CURRENT_DATE - INTERVAL '30 days',
  CURRENT_DATE - INTERVAL '15 days',
  'sent',
  1000.00,
  1200.00
FROM customers c 
WHERE c.org_id = '00000000-0000-0000-0000-000000000001' 
AND c.name = 'ACME Corporation'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO invoices (org_id, customer_id, number, issue_date, due_date, status, total_ht, total_ttc) 
SELECT 
  '00000000-0000-0000-0000-000000000001',
  c.id,
  'FACT-2024-002',
  CURRENT_DATE - INTERVAL '15 days',
  CURRENT_DATE + INTERVAL '15 days',
  'sent',
  2500.00,
  3000.00
FROM customers c 
WHERE c.org_id = '00000000-0000-0000-0000-000000000001' 
AND c.name = 'Tech Solutions SAS'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Demandes de congés de test
INSERT INTO leave_requests (org_id, employee_id, type, start_date, end_date, status)
SELECT 
  '00000000-0000-0000-0000-000000000001',
  e.id,
  'Congés payés',
  CURRENT_DATE + INTERVAL '7 days',
  CURRENT_DATE + INTERVAL '14 days',
  'pending'
FROM employees e 
WHERE e.org_id = '00000000-0000-0000-0000-000000000001' 
AND e.full_name = 'Marie Dupont'
LIMIT 1
ON CONFLICT DO NOTHING;

-- 5️⃣ Vérification
SELECT 
  'Utilisateur' as type, 
  u.email as info,
  COUNT(*) as count
FROM users u 
WHERE u.id = '00000000-0000-0000-0000-000000000002'
GROUP BY u.email

UNION ALL

SELECT 
  'Organisation' as type,
  o.name as info,
  COUNT(*) as count
FROM orgs o 
WHERE o.id = '00000000-0000-0000-0000-000000000001'
GROUP BY o.name

UNION ALL

SELECT 
  'Clients' as type,
  'Total' as info,
  COUNT(*) as count
FROM customers 
WHERE org_id = '00000000-0000-0000-0000-000000000001'

UNION ALL

SELECT 
  'Employés' as type,
  'Total' as info,
  COUNT(*) as count
FROM employees 
WHERE org_id = '00000000-0000-0000-0000-000000000001'

UNION ALL

SELECT 
  'Factures' as type,
  'Total' as info,
  COUNT(*) as count
FROM invoices 
WHERE org_id = '00000000-0000-0000-0000-000000000001';




