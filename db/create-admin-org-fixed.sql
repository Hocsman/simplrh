-- 🎯 Script corrigé pour créer l'organisation pour admin@simplrh.com

-- 1. Ajouter l'utilisateur dans la table users
INSERT INTO users (id, email, full_name) 
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', 'Administrateur')
FROM auth.users 
WHERE email = 'admin@simplrh.com'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name;

-- 2. Créer une organisation
INSERT INTO orgs (name, billing_plan, modules, owner_id) 
SELECT 
  'Mon Entreprise',
  'starter',
  '{"billing": true, "people": true, "docs": true}'::jsonb,
  id
FROM users 
WHERE email = 'admin@simplrh.com'
ON CONFLICT DO NOTHING;

-- 3. Ajouter comme membre
INSERT INTO members (org_id, user_id, role) 
SELECT 
  o.id,
  u.id,
  'owner'
FROM users u
CROSS JOIN orgs o
WHERE u.email = 'admin@simplrh.com'
AND o.owner_id = u.id
ON CONFLICT (org_id, user_id) DO NOTHING;

-- 4. Ajouter des clients de test
INSERT INTO customers (org_id, name, email, address) 
SELECT 
  o.id,
  'ACME Corporation',
  'contact@acme.com',
  '{"street": "123 Rue de la Paix", "city": "Paris", "postal_code": "75001", "country": "France"}'::jsonb
FROM orgs o
WHERE o.owner_id = (SELECT id FROM users WHERE email = 'admin@simplrh.com')
ON CONFLICT DO NOTHING;

INSERT INTO customers (org_id, name, email, address) 
SELECT 
  o.id,
  'Tech Solutions SAS',
  'info@techsolutions.fr',
  '{"street": "456 Avenue des Champs", "city": "Lyon", "postal_code": "69001", "country": "France"}'::jsonb
FROM orgs o
WHERE o.owner_id = (SELECT id FROM users WHERE email = 'admin@simplrh.com')
ON CONFLICT DO NOTHING;

-- 5. Ajouter des employés de test
INSERT INTO employees (org_id, full_name, email, hire_date) 
SELECT 
  o.id,
  'Marie Dupont',
  'marie.dupont@monentreprise.com',
  CURRENT_DATE - INTERVAL '6 months'
FROM orgs o
WHERE o.owner_id = (SELECT id FROM users WHERE email = 'admin@simplrh.com')
ON CONFLICT DO NOTHING;

INSERT INTO employees (org_id, full_name, email, hire_date) 
SELECT 
  o.id,
  'Jean Martin',
  'jean.martin@monentreprise.com',
  CURRENT_DATE - INTERVAL '3 months'
FROM orgs o
WHERE o.owner_id = (SELECT id FROM users WHERE email = 'admin@simplrh.com')
ON CONFLICT DO NOTHING;

INSERT INTO employees (org_id, full_name, email, hire_date) 
SELECT 
  o.id,
  'Sophie Bernard',
  'sophie.bernard@monentreprise.com',
  CURRENT_DATE - INTERVAL '1 month'
FROM orgs o
WHERE o.owner_id = (SELECT id FROM users WHERE email = 'admin@simplrh.com')
ON CONFLICT DO NOTHING;

-- 6. Ajouter des factures de test
INSERT INTO invoices (org_id, customer_id, number, status, due_date, total_ht, total_ttc, vat)
SELECT 
  o.id,
  c.id,
  'FACT-2024-001',
  'paid',
  CURRENT_DATE - INTERVAL '10 days',
  1000.00,
  1200.00,
  200.00
FROM orgs o
CROSS JOIN customers c
WHERE o.owner_id = (SELECT id FROM users WHERE email = 'admin@simplrh.com')
AND c.org_id = o.id
AND c.name = 'ACME Corporation'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO invoices (org_id, customer_id, number, status, due_date, total_ht, total_ttc, vat)
SELECT 
  o.id,
  c.id,
  'FACT-2024-002',
  'sent',
  CURRENT_DATE + INTERVAL '15 days',
  2500.00,
  3000.00,
  500.00
FROM orgs o
CROSS JOIN customers c
WHERE o.owner_id = (SELECT id FROM users WHERE email = 'admin@simplrh.com')
AND c.org_id = o.id
AND c.name = 'Tech Solutions SAS'
LIMIT 1
ON CONFLICT DO NOTHING;

-- 7. Ajouter une demande de congés
INSERT INTO leave_requests (org_id, employee_id, type, start_date, end_date, status)
SELECT 
  o.id,
  e.id,
  'Congés payés',
  CURRENT_DATE + INTERVAL '7 days',
  CURRENT_DATE + INTERVAL '14 days',
  'pending'
FROM orgs o
CROSS JOIN employees e
WHERE o.owner_id = (SELECT id FROM users WHERE email = 'admin@simplrh.com')
AND e.org_id = o.id
AND e.full_name = 'Marie Dupont'
LIMIT 1
ON CONFLICT DO NOTHING;

-- 8. Vérification finale
SELECT 
  '✅ Configuration terminée' as status,
  u.email as utilisateur,
  o.name as organisation,
  m.role,
  (SELECT COUNT(*) FROM customers WHERE org_id = o.id) as nb_clients,
  (SELECT COUNT(*) FROM employees WHERE org_id = o.id) as nb_employes,
  (SELECT COUNT(*) FROM invoices WHERE org_id = o.id) as nb_factures,
  (SELECT COUNT(*) FROM leave_requests WHERE org_id = o.id) as nb_conges
FROM users u
JOIN members m ON u.id = m.user_id
JOIN orgs o ON m.org_id = o.id
WHERE u.email = 'admin@simplrh.com';




