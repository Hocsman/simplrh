-- 🎯 Créer l'organisation pour admin@simplrh.com
-- Exécutez ce script dans Supabase SQL Editor

-- 1️⃣ Vérifier et ajouter l'utilisateur dans la table users
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

-- 2️⃣ Créer une organisation pour cet utilisateur
INSERT INTO orgs (name, billing_plan, modules, owner_id) 
SELECT 
  'Mon Entreprise',
  'starter',
  '{"billing": true, "people": true, "docs": true}'::jsonb,
  id
FROM users 
WHERE email = 'admin@simplrh.com'
ON CONFLICT DO NOTHING;

-- 3️⃣ Ajouter l'utilisateur comme membre de son organisation
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

-- 4️⃣ Ajouter quelques données de test pour cette organisation

-- Clients de test
INSERT INTO customers (org_id, name, email, phone, address) 
SELECT 
  o.id,
  'Client Test',
  'client@test.com',
  '01 23 45 67 89',
  '{"street": "123 Rue Exemple", "city": "Paris", "postal_code": "75001"}'::jsonb
FROM orgs o
WHERE o.owner_id = (SELECT id FROM users WHERE email = 'admin@simplrh.com')
ON CONFLICT DO NOTHING;

-- Employés de test
INSERT INTO employees (org_id, full_name, email, hire_date) 
SELECT 
  o.id,
  'Employé Test',
  'employe@test.com',
  CURRENT_DATE
FROM orgs o
WHERE o.owner_id = (SELECT id FROM users WHERE email = 'admin@simplrh.com')
ON CONFLICT DO NOTHING;

-- 5️⃣ Vérification finale
SELECT 
  u.email as utilisateur,
  o.name as organisation,
  m.role,
  (SELECT COUNT(*) FROM customers WHERE org_id = o.id) as nb_clients,
  (SELECT COUNT(*) FROM employees WHERE org_id = o.id) as nb_employes
FROM users u
JOIN members m ON u.id = m.user_id
JOIN orgs o ON m.org_id = o.id
WHERE u.email = 'admin@simplrh.com';





