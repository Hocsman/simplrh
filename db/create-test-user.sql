-- Script pour créer un utilisateur de test avec une organisation
-- À exécuter dans Supabase après avoir configuré les tables

-- 1. Insérer un utilisateur de test (remplacez par votre vrai user_id)
-- Vous pouvez récupérer votre user_id depuis l'onglet Authentication > Users dans Supabase
INSERT INTO users (id, email, full_name) VALUES
(
  'YOUR_USER_ID_HERE', -- Remplacez par votre vrai user_id
  'votre@email.com',   -- Remplacez par votre vrai email
  'Utilisateur Test'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name;

-- 2. Créer une organisation de test
INSERT INTO orgs (id, name, siret, billing_plan, modules, owner_id) VALUES
(
  gen_random_uuid(),
  'Entreprise Test',
  '12345678901234',
  'starter',
  '{"billing": true, "people": true, "docs": true}'::jsonb,
  'YOUR_USER_ID_HERE' -- Remplacez par votre vrai user_id
) ON CONFLICT DO NOTHING;

-- 3. Ajouter l'utilisateur comme membre de l'organisation
-- (Récupérez l'org_id depuis la table orgs après l'insertion)
INSERT INTO members (org_id, user_id, role) VALUES
(
  (SELECT id FROM orgs WHERE owner_id = 'YOUR_USER_ID_HERE' LIMIT 1),
  'YOUR_USER_ID_HERE', -- Remplacez par votre vrai user_id
  'owner'
) ON CONFLICT (org_id, user_id) DO NOTHING;

-- 4. Créer quelques données de test
INSERT INTO customers (org_id, name, email, address) VALUES
(
  (SELECT id FROM orgs WHERE owner_id = 'YOUR_USER_ID_HERE' LIMIT 1),
  'Client Test',
  'client@test.com',
  '{"street": "123 Rue Test", "city": "Paris", "postal_code": "75001"}'::jsonb
) ON CONFLICT DO NOTHING;

INSERT INTO employees (org_id, full_name, email, hire_date) VALUES
(
  (SELECT id FROM orgs WHERE owner_id = 'YOUR_USER_ID_HERE' LIMIT 1),
  'Employé Test',
  'employe@test.com',
  CURRENT_DATE
) ON CONFLICT DO NOTHING;






