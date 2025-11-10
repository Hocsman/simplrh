-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS doc_files CASCADE;
DROP TABLE IF EXISTS doc_requests CASCADE;
DROP TABLE IF EXISTS doc_templates CASCADE;
DROP TABLE IF EXISTS payroll_exports CASCADE;
DROP TABLE IF EXISTS absences CASCADE;
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS leave_policies CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS reminders CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS orgs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (managed by Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations table
CREATE TABLE orgs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    siret TEXT,
    billing_plan TEXT DEFAULT 'starter' CHECK (billing_plan IN ('starter', 'business', 'suite')),
    modules JSONB DEFAULT '{"billing": true, "people": true, "docs": true}'::jsonb,
    owner_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization members
CREATE TABLE members (
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'employee', 'accountant', 'legal')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (org_id, user_id)
);

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    target_table TEXT,
    target_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BILLING MODULE --

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    address JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id),
    number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
    due_date DATE,
    total_ht NUMERIC(10,2) DEFAULT 0,
    total_ttc NUMERIC(10,2) DEFAULT 0,
    vat NUMERIC(10,2) DEFAULT 0,
    pdf_path TEXT,
    facturx_xml_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice items
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    qty NUMERIC(10,2) DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    vat_rate NUMERIC(5,2) DEFAULT 20.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    method TEXT DEFAULT 'stripe',
    amount NUMERIC(10,2) NOT NULL,
    paid_at TIMESTAMPTZ DEFAULT NOW(),
    stripe_pi TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminders
CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    channel TEXT CHECK (channel IN ('email', 'sms')),
    status TEXT DEFAULT 'pending',
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PEOPLE MODULE --

-- Employees
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    full_name TEXT NOT NULL,
    email TEXT,
    team_id UUID,
    hire_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave policies
CREATE TABLE leave_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('CP', 'RTT', 'Maladie')),
    accrual_rules JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave requests
CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id),
    type TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approver_id UUID REFERENCES users(id),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Absences
CREATE TABLE absences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id),
    date DATE NOT NULL,
    type TEXT NOT NULL,
    source TEXT CHECK (source IN ('manual', 'import', 'auto')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payroll exports
CREATE TABLE payroll_exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    period TEXT NOT NULL,
    format TEXT CHECK (format IN ('SilaeCSV', 'PayFitCSV')),
    file_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DOCS MODULE --

-- Document templates
CREATE TABLE doc_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES orgs(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    locale TEXT DEFAULT 'fr',
    version INTEGER DEFAULT 1,
    title TEXT NOT NULL,
    schema JSONB DEFAULT '{}'::jsonb,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(key, locale, version)
);

-- Document requests
CREATE TABLE doc_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    template_key TEXT NOT NULL,
    payload_json JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'error')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document files
CREATE TABLE doc_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    request_id UUID NOT NULL REFERENCES doc_requests(id),
    path TEXT NOT NULL,
    type TEXT CHECK (type IN ('pdf', 'docx')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_orgs_owner_id ON orgs(owner_id);
CREATE INDEX idx_members_org_id ON members(org_id);
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_audit_logs_org_id ON audit_logs(org_id);
CREATE INDEX idx_customers_org_id ON customers(org_id);
CREATE INDEX idx_invoices_org_id ON invoices(org_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_reminders_invoice_id ON reminders(invoice_id);
CREATE INDEX idx_employees_org_id ON employees(org_id);
CREATE INDEX idx_leave_policies_org_id ON leave_policies(org_id);
CREATE INDEX idx_leave_requests_org_id ON leave_requests(org_id);
CREATE INDEX idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX idx_absences_org_id ON absences(org_id);
CREATE INDEX idx_absences_employee_id ON absences(employee_id);
CREATE INDEX idx_payroll_exports_org_id ON payroll_exports(org_id);
CREATE INDEX idx_doc_templates_org_id ON doc_templates(org_id);
CREATE INDEX idx_doc_requests_org_id ON doc_requests(org_id);
CREATE INDEX idx_doc_files_org_id ON doc_files(org_id);
CREATE INDEX idx_doc_files_request_id ON doc_files(request_id);

-- Updated at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orgs_updated_at BEFORE UPDATE ON orgs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_policies_updated_at BEFORE UPDATE ON leave_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON leave_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doc_templates_updated_at BEFORE UPDATE ON doc_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doc_requests_updated_at BEFORE UPDATE ON doc_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();