-- Migration: Add sent_at column to invoices table
-- Date: 2025-11-26
-- Purpose: Track when invoices were sent via email

ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ;

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'invoices'
ORDER BY ordinal_position;
