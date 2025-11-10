-- Seed data for SimplRH (Supabase compatible)
-- This file populates the database with initial test data

-- Insert default document templates (public templates)
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
          "nom": {"type": "string", "title": "Nom de l entreprise"},
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
          "echeance": {"type": "string", "title": "Date d echeance"},
          "delai": {"type": "number", "title": "Délai de règlement (jours)", "default": 8}
        },
        "required": ["description", "montant", "echeance"]
      }
    },
    "required": ["expediteur", "destinataire", "objet"]
  }'::jsonb,
  true
)
ON CONFLICT (key, locale, version) DO NOTHING;




