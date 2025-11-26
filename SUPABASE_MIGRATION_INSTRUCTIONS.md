# Supabase Database Migration Instructions

## Problem Identified

The PDF generation for invoices was failing because your Supabase database was missing required columns in both the `customers` and `orgs` tables.

### Missing Columns

**`customers` table was missing:**
- `phone` - Customer phone number
- `siret` - Customer SIRET (business registration number)
- `vat_number` - Customer VAT number

**`orgs` table was missing:**
- `email` - Organization email address
- `address` - Organization street address
- `phone` - Organization phone number

The PDF invoice generator tries to access these fields, and when they don't exist, it causes a 500 error.

## How to Fix

### Option 1: Supabase SQL Editor (Recommended - Fastest)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Create a new query
4. Copy and paste the content from: `db/migrations/add_missing_customer_and_org_columns.sql`
5. Click **Run** to execute the migration

The SQL will add all missing columns if they don't already exist:

```sql
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
```

### Option 2: Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db push
```

This will apply all migrations from the `db/migrations/` directory.

## Verification

After running the migration, you can verify the columns were created by running this query in the SQL Editor:

```sql
-- Verify customers table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'customers'
ORDER BY ordinal_position;

-- Verify orgs table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orgs'
ORDER BY ordinal_position;
```

You should see:
- **customers**: id, org_id, name, email, address, phone, siret, vat_number, created_at, updated_at
- **orgs**: id, name, siret, email, address, phone, billing_plan, modules, owner_id, created_at, updated_at

## After Migration

Once you've applied this migration:

1. Your Supabase database will be synced with the application code
2. The `/api/billing/invoices/[id]/download` endpoint will work correctly
3. PDF generation will no longer fail with 500 errors

## If Issues Persist

If you still encounter PDF generation errors after this migration, check:

1. **Verify Vercel deployment**: The application code needs to be redeployed for the changes to take effect
2. **Check invoice data**: Make sure you have at least one invoice with a valid customer_id and organization_id
3. **Check logs**: Visit your Vercel dashboard and check the Function Logs for the `/api/billing/invoices/[id]/download` endpoint

## Related Files

- Schema definition: `db/schema.sql`
- Migration file: `db/migrations/add_missing_customer_and_org_columns.sql`
- PDF generator: `lib/pdf-generator.ts`
- Download endpoint: `app/api/billing/invoices/[id]/download/route.ts`
