-- Ajouter les colonnes manquantes à la table customers
-- À exécuter dans Supabase SQL Editor

-- Ajouter la colonne phone
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Ajouter la colonne siret
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS siret TEXT;

-- Ajouter la colonne vat_number (numéro de TVA)
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS vat_number TEXT;

-- Vérification : afficher la structure de la table customers
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'customers'
ORDER BY ordinal_position;


