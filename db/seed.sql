-- Seed data for SimplRH
-- This file populates the database with initial test data

-- Insert default document templates
INSERT INTO doc_templates (org_id, key, locale, version, title, schema, is_public) VALUES
(
  NULL, 
  'contrat-prestation', 
  'fr', 
  1, 
  'Contrat de prestation de services',
  '{
    "type": "object",
    "properties": {
      "prestataire": {
        "type": "object",
        "properties": {
          "nom": {"type": "string", "title": "Nom/Raison sociale"},
          "adresse": {"type": "string", "title": "Adresse"},
          "siret": {"type": "string", "title": "SIRET"}
        },
        "required": ["nom", "adresse"]
      },
      "client": {
        "type": "object",
        "properties": {
          "nom": {"type": "string", "title": "Nom/Raison sociale"},
          "adresse": {"type": "string", "title": "Adresse"}
        },
        "required": ["nom", "adresse"]
      },
      "prestation": {
        "type": "object",
        "properties": {
          "description": {"type": "string", "title": "Description de la prestation"},
          "duree": {"type": "string", "title": "Durée"},
          "prix": {"type": "number", "title": "Prix (€ HT)"}
        },
        "required": ["description", "prix"]
      }
    },
    "required": ["prestataire", "client", "prestation"]
  }'::jsonb,
  true
),
(
  NULL, 
  'cgv-ecommerce', 
  'fr', 
  1, 
  'Conditions Générales de Vente - E-commerce',
  '{
    "type": "object",
    "properties": {
      "entreprise": {
        "type": "object",
        "properties": {
          "nom": {"type": "string", "title": "Nom de l''entreprise"},
          "adresse": {"type": "string", "title": "Adresse"},
          "siret": {"type": "string", "title": "SIRET"},
          "email": {"type": "string", "title": "Email de contact"},
          "telephone": {"type": "string", "title": "Téléphone"}
        },
        "required": ["nom", "adresse", "siret", "email"]
      },
      "site": {
        "type": "object",
        "properties": {
          "url": {"type": "string", "title": "URL du site"},
          "activite": {"type": "string", "title": "Activité principale"}
        },
        "required": ["url", "activite"]
      }
    },
    "required": ["entreprise", "site"]
  }'::jsonb,
  true
),
(
  NULL, 
  'mise-en-demeure', 
  'fr', 
  1, 
  'Lettre de mise en demeure',
  '{
    "type": "object",
    "properties": {
      "expediteur": {
        "type": "object",
        "properties": {
          "nom": {"type": "string", "title": "Nom/Raison sociale"},
          "adresse": {"type": "string", "title": "Adresse"}
        },
        "required": ["nom", "adresse"]
      },
      "destinataire": {
        "type": "object",
        "properties": {
          "nom": {"type": "string", "title": "Nom/Raison sociale"},
          "adresse": {"type": "string", "title": "Adresse"}
        },
        "required": ["nom", "adresse"]
      },
      "objet": {
        "type": "object",
        "properties": {
          "description": {"type": "string", "title": "Objet de la mise en demeure"},
          "montant": {"type": "number", "title": "Montant dû (€)"},
          "echeance": {"type": "string", "title": "Date d''échéance"},
          "delai": {"type": "number", "title": "Délai de règlement (jours)", "default": 8}
        },
        "required": ["description", "montant", "echeance"]
      }
    },
    "required": ["expediteur", "destinataire", "objet"]
  }'::jsonb,
  true
);

-- Only insert demo data if we're in development
-- Check if we have any existing organizations first
DO $$
BEGIN
  -- Only seed demo data if no organizations exist
  IF (SELECT COUNT(*) FROM orgs) = 0 THEN
    
    -- Insert demo user (this would normally be handled by Supabase Auth)
    INSERT INTO users (id, email, full_name) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'demo@simplrh.com', 'Utilisateur Demo');
    
    -- Insert demo organization
    INSERT INTO orgs (id, name, siret, billing_plan, modules, owner_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Demo SARL', '12345678901234', 'business', 
     '{"billing": true, "people": true, "docs": true}'::jsonb, 
     '550e8400-e29b-41d4-a716-446655440000');
    
    -- Insert demo member
    INSERT INTO members (org_id, user_id, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'owner');
    
    -- Insert demo customer
    INSERT INTO customers (id, org_id, name, email, address) VALUES
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 
     'Client Demo', 'client@example.com',
     '{"street": "123 Rue de la Demo", "city": "Paris", "postal_code": "75001", "country": "France"}'::jsonb);
    
    -- Insert demo invoice
    INSERT INTO invoices (id, org_id, customer_id, number, status, due_date, total_ht, total_ttc, vat) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001',
     '550e8400-e29b-41d4-a716-446655440002', 'FAC-0001', 'sent', 
     CURRENT_DATE + INTERVAL '30 days', 1000.00, 1200.00, 200.00);
    
    -- Insert demo invoice items
    INSERT INTO invoice_items (invoice_id, label, qty, unit_price, vat_rate) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', 'Prestation de conseil', 5, 200.00, 20.00);
    
    -- Insert demo employee
    INSERT INTO employees (id, org_id, full_name, email, hire_date) VALUES
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001',
     'Jean Dupont', 'jean.dupont@demo.com', '2024-01-15');
    
    -- Insert demo leave policy
    INSERT INTO leave_policies (org_id, type, accrual_rules) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'CP', 
     '{"days_per_month": 2.5, "max_carry_over": 5}'::jsonb);
    
    -- Insert demo leave request
    INSERT INTO leave_requests (id, org_id, employee_id, type, start_date, end_date, status, comment) VALUES
    ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001',
     '550e8400-e29b-41d4-a716-446655440004', 'CP', 
     CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '14 days', 
     'pending', 'Vacances d''été');
    
    -- Insert demo document request
    INSERT INTO doc_requests (id, org_id, template_key, payload_json, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001',
     'contrat-prestation', 
     '{
       "prestataire": {
         "nom": "Demo SARL",
         "adresse": "123 Rue de la Demo, 75001 Paris",
         "siret": "12345678901234"
       },
       "client": {
         "nom": "Client Demo",
         "adresse": "456 Avenue du Client, 75002 Paris"
       },
       "prestation": {
         "description": "Prestations de conseil en développement web",
         "duree": "3 mois",
         "prix": 5000
       }
     }'::jsonb,
     'draft');
    
    -- Log initial audit events
    INSERT INTO audit_logs (org_id, action, target_table, target_id, metadata) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'organization.created', 'orgs', 
     '550e8400-e29b-41d4-a716-446655440001', '{"name": "Demo SARL"}'::jsonb),
    ('550e8400-e29b-41d4-a716-446655440001', 'customer.created', 'customers',
     '550e8400-e29b-41d4-a716-446655440002', '{"name": "Client Demo"}'::jsonb),
    ('550e8400-e29b-41d4-a716-446655440001', 'invoice.created', 'invoices',
     '550e8400-e29b-41d4-a716-446655440003', '{"number": "FAC-0001", "total_ttc": 1200.00}'::jsonb);
    
    RAISE NOTICE 'Demo data inserted successfully';
  ELSE
    RAISE NOTICE 'Organizations already exist, skipping demo data insertion';
  END IF;
END $$;