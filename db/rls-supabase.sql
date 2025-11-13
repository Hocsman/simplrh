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

-- USERS table policies
CREATE POLICY "Users can view their own record" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own record" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own record" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

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
    OR id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Authenticated users can create organizations" ON orgs
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- MEMBERS table policies
CREATE POLICY "Members can view org members" ON members
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Owners and admins can manage members" ON members
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can join organizations" ON members
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
  );

-- AUDIT_LOGS table policies
CREATE POLICY "Members can view org audit logs" ON audit_logs
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT org_id FROM members WHERE user_id = auth.uid()
    )
  );

-- BILLING MODULE POLICIES

-- CUSTOMERS table policies
CREATE POLICY "Billing users can view customers" ON customers
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'accountant', 'manager')
    )
  );

CREATE POLICY "Billing users can manage customers" ON customers
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'accountant', 'manager')
    )
  );

-- INVOICES table policies
CREATE POLICY "Billing users can view invoices" ON invoices
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'accountant', 'manager')
    )
  );

CREATE POLICY "Billing users can manage invoices" ON invoices
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'accountant', 'manager')
    )
  );

-- INVOICE_ITEMS table policies
CREATE POLICY "Billing users can view invoice items" ON invoice_items
  FOR SELECT USING (
    invoice_id IN (
      SELECT i.id FROM invoices i
      JOIN members m ON i.org_id = m.org_id
      WHERE m.user_id = auth.uid() 
      AND m.role IN ('owner', 'admin', 'accountant', 'manager')
    )
  );

CREATE POLICY "Billing users can manage invoice items" ON invoice_items
  FOR ALL USING (
    invoice_id IN (
      SELECT i.id FROM invoices i
      JOIN members m ON i.org_id = m.org_id
      WHERE m.user_id = auth.uid() 
      AND m.role IN ('owner', 'admin', 'accountant', 'manager')
    )
  );

-- PAYMENTS table policies
CREATE POLICY "Billing users can view payments" ON payments
  FOR SELECT USING (
    invoice_id IN (
      SELECT i.id FROM invoices i
      JOIN members m ON i.org_id = m.org_id
      WHERE m.user_id = auth.uid() 
      AND m.role IN ('owner', 'admin', 'accountant', 'manager')
    )
  );

CREATE POLICY "System can manage payments" ON payments
  FOR ALL USING (
    invoice_id IN (
      SELECT i.id FROM invoices i
      JOIN members m ON i.org_id = m.org_id
      WHERE m.user_id = auth.uid()
    )
  );

-- REMINDERS table policies
CREATE POLICY "Billing users can view reminders" ON reminders
  FOR SELECT USING (
    invoice_id IN (
      SELECT i.id FROM invoices i
      JOIN members m ON i.org_id = m.org_id
      WHERE m.user_id = auth.uid() 
      AND m.role IN ('owner', 'admin', 'accountant', 'manager')
    )
  );

CREATE POLICY "System can manage reminders" ON reminders
  FOR ALL USING (
    invoice_id IN (
      SELECT i.id FROM invoices i
      JOIN members m ON i.org_id = m.org_id
      WHERE m.user_id = auth.uid()
    )
  );

-- PEOPLE MODULE POLICIES

-- EMPLOYEES table policies
CREATE POLICY "People users can view employees" ON employees
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role NOT IN ('accountant', 'legal')
    )
    OR (
      -- Employees can see their own record
      user_id = auth.uid()
    )
  );

CREATE POLICY "People managers can manage employees" ON employees
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'manager')
    )
  );

-- LEAVE_POLICIES table policies
CREATE POLICY "People users can view leave policies" ON leave_policies
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role NOT IN ('accountant', 'legal')
    )
  );

CREATE POLICY "People managers can manage leave policies" ON leave_policies
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'manager')
    )
  );

-- LEAVE_REQUESTS table policies
CREATE POLICY "Users can view leave requests" ON leave_requests
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'manager')
    )
    OR (
      -- Employees can see their own requests
      employee_id IN (
        SELECT id FROM employees WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create leave requests" ON leave_requests
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT org_id FROM members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can manage leave requests" ON leave_requests
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'manager')
    )
  );

-- ABSENCES table policies
CREATE POLICY "People users can view absences" ON absences
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role NOT IN ('accountant', 'legal')
    )
  );

CREATE POLICY "People managers can manage absences" ON absences
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'manager')
    )
  );

-- PAYROLL_EXPORTS table policies
CREATE POLICY "People managers can view payroll exports" ON payroll_exports
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'manager')
    )
  );

CREATE POLICY "People managers can create payroll exports" ON payroll_exports
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'manager')
    )
  );

-- DOCS MODULE POLICIES

-- DOC_TEMPLATES table policies (public templates visible to all)
CREATE POLICY "Users can view public templates" ON doc_templates
  FOR SELECT USING (
    is_public = true
    OR org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role NOT IN ('employee')
    )
  );

CREATE POLICY "Legal users can manage org templates" ON doc_templates
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'legal')
    )
  );

-- DOC_REQUESTS table policies
CREATE POLICY "Users can view org doc requests" ON doc_requests
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role NOT IN ('accountant')
    )
  );

CREATE POLICY "Users can create doc requests" ON doc_requests
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role NOT IN ('accountant')
    )
  );

CREATE POLICY "Legal users can manage doc requests" ON doc_requests
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'legal')
    )
  );

-- DOC_FILES table policies
CREATE POLICY "Users can view org doc files" ON doc_files
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role NOT IN ('accountant')
    )
  );

CREATE POLICY "System can manage doc files" ON doc_files
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM members WHERE user_id = auth.uid()
    )
  );











