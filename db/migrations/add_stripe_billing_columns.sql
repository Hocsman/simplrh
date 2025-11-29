-- Migration: Add Stripe billing columns to orgs table
-- Created: 2024-11-29
-- Purpose: Support Stripe webhook integration for subscription management

-- Add Stripe-related columns to organizations table
ALTER TABLE orgs 
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS billing_plan VARCHAR(50),
ADD COLUMN IF NOT EXISTS billing_interval VARCHAR(20),
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50);

-- Add indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_orgs_stripe_customer 
ON orgs(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_orgs_stripe_subscription 
ON orgs(stripe_subscription_id);

-- Add comments for documentation
COMMENT ON COLUMN orgs.stripe_customer_id IS 'Stripe customer ID (cus_xxx)';
COMMENT ON COLUMN orgs.stripe_subscription_id IS 'Stripe subscription ID (sub_xxx)';
COMMENT ON COLUMN orgs.billing_plan IS 'Current billing plan: starter, business, or suite';
COMMENT ON COLUMN orgs.billing_interval IS 'Billing interval: monthly or yearly';
COMMENT ON COLUMN orgs.subscription_status IS 'Subscription status: active, past_due, canceled, etc.';

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Added 5 Stripe billing columns to orgs table';
    RAISE NOTICE 'Created 2 indexes for performance';
END $$;
