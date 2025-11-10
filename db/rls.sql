-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE doc_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE doc_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE doc_files ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's org_id
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT m.org_id 
    FROM members m 
    WHERE m.user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get current user's role in org
CREATE OR REPLACE FUNCTION get_user_role(org_uuid UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT m.role 
    FROM members m 
    WHERE m.user_id = auth.uid() 
    AND m.org_id = org_uuid
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has permission
CREATE OR REPLACE FUNCTION has_permission(
  action_name TEXT,
  resource_name TEXT,
  org_uuid UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  user_role := get_user_role(org_uuid);
  
  -- Owner and admin have all permissions
  IF user_role IN ('owner', 'admin') THEN
    RETURN TRUE;
  END IF;
  
  -- Manager permissions
  IF user_role = 'manager' THEN
    RETURN resource_name IN ('billing', 'people', 'docs') 
           AND action_name IN ('read', 'write');
  END IF;
  
  -- Employee permissions (restricted)
  IF user_role = 'employee' THEN
    RETURN (resource_name = 'people' AND action_name IN ('read', 'write_own'))
           OR (resource_name = 'docs' AND action_name = 'read');
  END IF;
  
  -- Accountant permissions (billing only)
  IF user_role = 'accountant' THEN
    RETURN resource_name = 'billing' AND action_name IN ('read', 'write');
  END IF;
  
  -- Legal permissions (docs only)
  IF user_role = 'legal' THEN
    RETURN resource_name = 'docs' AND action_name IN ('read', 'write');
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- USERS table policies
CREATE POLICY "Users can view their own record" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own record" ON users
  FOR UPDATE USING (auth.uid() = id);

-- ORGS table policies
CREATE POLICY "Members can view their organization" ON orgs
  FOR SELECT USING (
    id IN (
      SELECT org_id FROM members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can update their organization" ON orgs
  FOR UPDATE USING (
    owner_id = auth.uid()
    OR get_user_role(id) IN ('owner', 'admin')
  );

-- MEMBERS table policies
CREATE POLICY "Members can view org members" ON members
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Owners and admins can manage members" ON members
  FOR ALL USING (
    get_user_role(org_id) IN ('owner', 'admin')
  );

-- AUDIT_LOGS table policies
CREATE POLICY "Members can view org audit logs" ON audit_logs
  FOR SELECT USING (
    has_permission('read', 'audit', org_id)
  );

-- BILLING MODULE POLICIES

-- CUSTOMERS table policies
CREATE POLICY "Billing access can view customers" ON customers
  FOR SELECT USING (
    has_permission('read', 'billing', org_id)
  );

CREATE POLICY "Billing access can manage customers" ON customers
  FOR ALL USING (
    has_permission('write', 'billing', org_id)
  );

-- INVOICES table policies
CREATE POLICY "Billing access can view invoices" ON invoices
  FOR SELECT USING (
    has_permission('read', 'billing', org_id)
  );

CREATE POLICY "Billing access can manage invoices" ON invoices
  FOR ALL USING (
    has_permission('write', 'billing', org_id)
  );

-- INVOICE_ITEMS table policies
CREATE POLICY "Billing access can view invoice items" ON invoice_items
  FOR SELECT USING (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE has_permission('read', 'billing', org_id)
    )
  );

CREATE POLICY "Billing access can manage invoice items" ON invoice_items
  FOR ALL USING (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE has_permission('write', 'billing', org_id)
    )
  );

-- PAYMENTS table policies
CREATE POLICY "Billing access can view payments" ON payments
  FOR SELECT USING (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE has_permission('read', 'billing', org_id)
    )
  );

CREATE POLICY "Billing access can manage payments" ON payments
  FOR ALL USING (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE has_permission('write', 'billing', org_id)
    )
  );

-- REMINDERS table policies
CREATE POLICY "Billing access can view reminders" ON reminders
  FOR SELECT USING (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE has_permission('read', 'billing', org_id)
    )
  );

CREATE POLICY "Billing access can manage reminders" ON reminders
  FOR ALL USING (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE has_permission('write', 'billing', org_id)
    )
  );

-- PEOPLE MODULE POLICIES

-- EMPLOYEES table policies
CREATE POLICY "People access can view employees" ON employees
  FOR SELECT USING (
    has_permission('read', 'people', org_id)
  );

CREATE POLICY "People access can manage employees" ON employees
  FOR ALL USING (
    has_permission('write', 'people', org_id)
  );

-- LEAVE_POLICIES table policies
CREATE POLICY "People access can view leave policies" ON leave_policies
  FOR SELECT USING (
    has_permission('read', 'people', org_id)
  );

CREATE POLICY "People access can manage leave policies" ON leave_policies
  FOR ALL USING (
    has_permission('write', 'people', org_id)
  );

-- LEAVE_REQUESTS table policies
CREATE POLICY "People access can view leave requests" ON leave_requests
  FOR SELECT USING (
    has_permission('read', 'people', org_id)
    OR (
      has_permission('write_own', 'people', org_id)
      AND employee_id IN (
        SELECT id FROM employees WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "People access can manage leave requests" ON leave_requests
  FOR ALL USING (
    has_permission('write', 'people', org_id)
    OR (
      has_permission('write_own', 'people', org_id)
      AND employee_id IN (
        SELECT id FROM employees WHERE user_id = auth.uid()
      )
    )
  );

-- ABSENCES table policies
CREATE POLICY "People access can view absences" ON absences
  FOR SELECT USING (
    has_permission('read', 'people', org_id)
  );

CREATE POLICY "People access can manage absences" ON absences
  FOR ALL USING (
    has_permission('write', 'people', org_id)
  );

-- PAYROLL_EXPORTS table policies
CREATE POLICY "People access can view payroll exports" ON payroll_exports
  FOR SELECT USING (
    has_permission('read', 'people', org_id)
  );

CREATE POLICY "People access can manage payroll exports" ON payroll_exports
  FOR ALL USING (
    has_permission('write', 'people', org_id)
  );

-- DOCS MODULE POLICIES

-- DOC_TEMPLATES table policies
CREATE POLICY "Anyone can view public templates" ON doc_templates
  FOR SELECT USING (
    is_public = true
    OR has_permission('read', 'docs', org_id)
  );

CREATE POLICY "Docs access can manage templates" ON doc_templates
  FOR ALL USING (
    has_permission('write', 'docs', org_id)
  );

-- DOC_REQUESTS table policies
CREATE POLICY "Docs access can view doc requests" ON doc_requests
  FOR SELECT USING (
    has_permission('read', 'docs', org_id)
  );

CREATE POLICY "Docs access can manage doc requests" ON doc_requests
  FOR ALL USING (
    has_permission('write', 'docs', org_id)
  );

-- DOC_FILES table policies
CREATE POLICY "Docs access can view doc files" ON doc_files
  FOR SELECT USING (
    has_permission('read', 'docs', org_id)
  );

CREATE POLICY "Docs access can manage doc files" ON doc_files
  FOR ALL USING (
    has_permission('write', 'docs', org_id)
  );

-- Storage bucket policies (if using Supabase Storage)
-- These would be configured in the Supabase dashboard or via SQL

-- Enable realtime for specific tables (optional)
-- ALTER PUBLICATION supabase_realtime ADD TABLE leave_requests;
-- ALTER PUBLICATION supabase_realtime ADD TABLE invoices;