-- Migration: Add missing customer and organization columns required for PDF generation
-- Date: 2025-11-26
-- Purpose: Add columns needed for invoice PDF generation (phone, siret, vat_number for customers; email, address, phone for orgs)

-- Add missing columns to customers table
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS siret TEXT,
ADD COLUMN IF NOT EXISTS vat_number TEXT;

-- Add missing columns to orgs table
ALTER TABLE orgs
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('customers', 'orgs')
ORDER BY table_name, ordinal_position;
