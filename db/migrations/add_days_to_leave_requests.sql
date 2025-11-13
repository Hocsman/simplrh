-- Migration: Add 'days' column to leave_requests table
-- Date: 2025-11-13
-- Description: Adds a 'days' column to store the calculated number of days for leave requests

-- Check if column exists before adding it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'leave_requests'
        AND column_name = 'days'
    ) THEN
        ALTER TABLE leave_requests
        ADD COLUMN days INTEGER DEFAULT 1;

        RAISE NOTICE 'Column "days" added to leave_requests table';
    ELSE
        RAISE NOTICE 'Column "days" already exists in leave_requests table';
    END IF;
END $$;

-- Update existing records to calculate days
UPDATE leave_requests
SET days = (end_date - start_date) + 1
WHERE days IS NULL OR days = 1;

-- Add a comment to document the column
COMMENT ON COLUMN leave_requests.days IS 'Number of days for the leave request (calculated from start_date to end_date)';
