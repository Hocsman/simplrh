# Action Items - PDF Generation Fix

## Status: ✅ Code Ready | ⏳ Awaiting Supabase Update

All code changes have been pushed to GitHub. Your **Supabase database needs to be updated** to complete the fix.

## 🚀 What You Need To Do

### Step 1: Apply the Supabase Migration (5 minutes)

**Go to:** https://app.supabase.com → Your Project → SQL Editor

**Create a new query and run this SQL:**

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

That's it! This will add all the missing columns that the PDF generator needs.

### Step 2: Verify the Migration Worked

Run this query in the SQL Editor to confirm all columns exist:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name IN ('customers', 'orgs')
ORDER BY table_name, ordinal_position;
```

You should see the new columns (phone, siret, vat_number for customers; email, address, phone for orgs).

### Step 3: Test PDF Download

Once the migration is applied:

1. Visit your app at https://simplrh.com (or your local dev server)
2. Go to the Billing module → Invoices
3. Click the download button on any invoice
4. The PDF should download without errors ✅

## 📚 Reference Documents

- **Full instructions:** `SUPABASE_MIGRATION_INSTRUCTIONS.md`
- **Technical summary:** `PDF_GENERATION_FIX_SUMMARY.md`
- **Migration file:** `db/migrations/add_missing_customer_and_org_columns.sql`

## 🎯 Why This Happened

Your code was trying to use database columns that didn't exist in Supabase:

- PDF generator needs `customer.siret`, `customer.phone`, `customer.vat_number`
- PDF generator needs `organization.email`, `organization.address`, `organization.phone`
- Your Supabase schema was missing these columns
- Result: 500 errors when trying to generate PDFs

## ✨ What's Been Fixed

1. ✅ Updated `db/schema.sql` with all missing columns
2. ✅ Created migration file for Supabase: `db/migrations/add_missing_customer_and_org_columns.sql`
3. ✅ Created comprehensive instructions: `SUPABASE_MIGRATION_INSTRUCTIONS.md`
4. ✅ All code pushed to GitHub (commits 33f13c9, dcb8b85, 08984d7)
5. ⏳ **Pending:** Apply migration to your live Supabase database

## 🔧 Additional Testing

You can also test the PDF generation independently:

1. Visit: `/api/billing/test-pdf`
   - This endpoint uses hardcoded test data
   - If it works, PDF generation is fine; if it fails, there's an environment issue
   - Can be removed after testing

## 🆘 If Issues Persist

After applying the migration, if PDFs still don't generate:

1. Check Vercel Function Logs for detailed error messages
2. Verify you have invoices with valid customer_id and org_id
3. Make sure org_id in your invoices table has a corresponding org record
4. Run the verification query (Step 2) to confirm columns were created

## 📝 Git Commits Made

- `33f13c9` - Add missing columns to schema
- `dcb8b85` - Add Supabase migration instructions
- `08984d7` - Add comprehensive fix summary

All are pushed to `origin/main` and ready for deployment.
