-- Migration: Add missing columns to employees table
-- Date: 2025-11-26
-- Purpose: Add position, salary, contract_type, and status columns for complete employee management

ALTER TABLE employees
ADD COLUMN IF NOT EXISTS position TEXT,
ADD COLUMN IF NOT EXISTS salary NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS contract_type TEXT DEFAULT 'CDI' CHECK (contract_type IN ('CDI', 'CDD', 'Stage', 'Freelance')),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave'));

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'employees'
ORDER BY ordinal_position;
