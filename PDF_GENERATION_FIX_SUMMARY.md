# PDF Generation Issue - Root Cause & Fix Summary

## Problem Statement

Your SimplRH application was returning 500 errors when users tried to download invoice PDFs via the `/api/billing/invoices/[id]/download` endpoint.

## Root Cause Identified ✅

The root cause was **missing database columns in Supabase**, exactly as you suspected with your question: "il y a pas une modif à faire sur supabase?"

### What Was Missing

Your Supabase database schema was incomplete:

#### `customers` table was missing:
- `phone` - Customer phone number
- `siret` - Customer SIRET (business registration number)
- `vat_number` - Customer VAT number

#### `orgs` table was missing:
- `email` - Organization email address
- `address` - Organization street address
- `phone` - Organization phone number

### Why This Caused PDF Errors

The PDF generator code in `lib/pdf-generator.ts` tries to access these fields when building the invoice PDF. When Supabase returns the organization and customer data, the application was trying to use fields that didn't exist in the database, causing runtime errors.

Additionally, the download endpoint in `app/api/billing/invoices/[id]/download/route.ts` was fetching invoices with:

```typescript
select(`
  *,
  customer:customers(id, name, email, siret, address),
  items:invoice_items(*)
`)
```

It was explicitly requesting `siret` from the `customers` table, but that column didn't exist.

## Solution Applied

### 1. Updated Database Schema (`db/schema.sql`)

Both tables have been updated with the missing columns:

```sql
-- Customers table now includes:
ALTER TABLE customers ADD COLUMN phone TEXT;
ALTER TABLE customers ADD COLUMN siret TEXT;
ALTER TABLE customers ADD COLUMN vat_number TEXT;

-- Orgs table now includes:
ALTER TABLE orgs ADD COLUMN email TEXT;
ALTER TABLE orgs ADD COLUMN address TEXT;
ALTER TABLE orgs ADD COLUMN phone TEXT;
```

### 2. Created Migration File (`db/migrations/add_missing_customer_and_org_columns.sql`)

A proper migration file has been created that can be applied to your Supabase database using the SQL Editor.

### 3. Created Migration Instructions (`SUPABASE_MIGRATION_INSTRUCTIONS.md`)

A step-by-step guide has been created explaining how to apply these changes to your live Supabase instance.

## Next Steps

### IMPORTANT: Apply the Migration to Your Supabase Database

The code changes are committed and pushed, but your **Supabase production database** still needs to be updated.

**Quick Fix (5 minutes):**

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the content from: `db/migrations/add_missing_customer_and_org_columns.sql`
5. Click **Run** to execute

**Or read:** `SUPABASE_MIGRATION_INSTRUCTIONS.md` for detailed instructions

### What Will Happen After Migration

Once the Supabase schema is updated:

1. ✅ The `/api/billing/invoices/[id]/download` endpoint will work correctly
2. ✅ Invoices can be downloaded as PDFs without 500 errors
3. ✅ The test endpoint at `/api/billing/test-pdf` can be removed (it was for debugging)

## Testing

You can test the fix by:

1. **After applying the migration:** Visit `/api/billing/invoices/{invoiceId}/download` with a valid invoice ID
2. **The test endpoint:** Visit `/api/billing/test-pdf` to verify PDF generation works with hardcoded data
3. **Check logs:** Visit Vercel dashboard → Function Logs to see detailed error messages if issues persist

## Files Modified

- `db/schema.sql` - Updated customers and orgs table definitions
- `db/migrations/add_missing_customer_and_org_columns.sql` - Migration file for Supabase
- `SUPABASE_MIGRATION_INSTRUCTIONS.md` - Step-by-step guide
- `lib/pdf-generator.ts` - Previously enhanced with better error handling
- `app/api/billing/invoices/[id]/download/route.ts` - Previously enhanced with logging
- `app/api/billing/test-pdf/route.ts` - Test endpoint for debugging

## Timeline of Debugging

1. **Phase 1**: Fixed build errors (missing SEO functions, invalid metadata)
2. **Phase 2**: Created favicons and web assets
3. **Phase 3**: Enhanced PDF generator with null safety and logging
4. **Phase 4**: Created test endpoint to isolate the issue
5. **Phase 5**: Discovered missing database columns (root cause)
6. **Phase 6**: Updated schema and created migration

## Commits

- `33f13c9` - Add missing columns to customers and orgs tables
- `dcb8b85` - Add Supabase migration instructions

All code is ready. **Supabase database update is the final step needed.**
