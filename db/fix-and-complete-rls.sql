-- ============================================================
-- SCRIPT FINAL : Supprime et recrée toutes les politiques RLS
-- ============================================================

-- ============================================================
-- 1. SUPPRIMER TOUTES LES POLITIQUES EXISTANTES
-- ============================================================

-- EMPLOYEES
DROP POLICY IF EXISTS "Users can view org employees" ON employees;
DROP POLICY IF EXISTS "Users can create org employees" ON employees;
DROP POLICY IF EXISTS "Users can update org employees" ON employees;
DROP POLICY IF EXISTS "Owners can delete org employees" ON employees;

-- LEAVE REQUESTS
DROP POLICY IF EXISTS "Users can view org leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Users can create leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Managers can update leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Users can update leave requests" ON leave_requests;

-- LEAVE POLICIES
DROP POLICY IF EXISTS "Users can view org leave policies" ON leave_policies;
DROP POLICY IF EXISTS "Admins can manage leave policies" ON leave_policies;

-- ABSENCES
DROP POLICY IF EXISTS "Users can view org absences" ON absences;
DROP POLICY IF EXISTS "Users can create absences" ON absences;
DROP POLICY IF EXISTS "Users can update absences" ON absences;

-- PAYROLL EXPORTS
DROP POLICY IF EXISTS "Users can view org payroll exports" ON payroll_exports;
DROP POLICY IF EXISTS "Admins can create payroll exports" ON payroll_exports;

-- PAYMENTS
DROP POLICY IF EXISTS "Users can view org payments" ON payments;
DROP POLICY IF EXISTS "Users can create payments" ON payments;
DROP POLICY IF EXISTS "Users can update payments" ON payments;

-- REMINDERS
DROP POLICY IF EXISTS "Users can view org reminders" ON reminders;
DROP POLICY IF EXISTS "Users can create reminders" ON reminders;

-- DOC TEMPLATES
DROP POLICY IF EXISTS "Users can view org doc templates" ON doc_templates;
DROP POLICY IF EXISTS "Admins can manage doc templates" ON doc_templates;

-- DOC REQUESTS
DROP POLICY IF EXISTS "Users can view org doc requests" ON doc_requests;
DROP POLICY IF EXISTS "Users can create doc requests" ON doc_requests;

-- DOC FILES
DROP POLICY IF EXISTS "Users can view org doc files" ON doc_files;
DROP POLICY IF EXISTS "Users can create doc files" ON doc_files;

-- AUDIT LOGS
DROP POLICY IF EXISTS "Admins can view org audit logs" ON audit_logs;
DROP POLICY IF EXISTS "System can create audit logs" ON audit_logs;

-- ============================================================
-- 2. CRÉER LES NOUVELLES POLITIQUES
-- ============================================================

-- EMPLOYEES
CREATE POLICY "Users can view org employees" ON employees
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create org employees" ON employees
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update org employees" ON employees
  FOR UPDATE USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Owners can delete org employees" ON employees
  FOR DELETE USING (
    org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid())
  );

-- LEAVE REQUESTS
CREATE POLICY "Users can view org leave requests" ON leave_requests
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create leave requests" ON leave_requests
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Managers can update leave requests" ON leave_requests
  FOR UPDATE USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'manager')
    )
  );

-- LEAVE POLICIES
CREATE POLICY "Users can view org leave policies" ON leave_policies
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage leave policies" ON leave_policies
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- ABSENCES
CREATE POLICY "Users can view org absences" ON absences
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create absences" ON absences
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update absences" ON absences
  FOR UPDATE USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- PAYROLL EXPORTS
CREATE POLICY "Users can view org payroll exports" ON payroll_exports
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can create payroll exports" ON payroll_exports
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'accountant')
    )
  );

-- PAYMENTS
CREATE POLICY "Users can view org payments" ON payments
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create payments" ON payments
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update payments" ON payments
  FOR UPDATE USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- REMINDERS
CREATE POLICY "Users can view org reminders" ON reminders
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create reminders" ON reminders
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- DOC TEMPLATES
CREATE POLICY "Users can view org doc templates" ON doc_templates
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
    OR org_id IS NULL
  );

CREATE POLICY "Admins can manage doc templates" ON doc_templates
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'legal')
    )
    OR org_id IS NULL
  );

-- DOC REQUESTS
CREATE POLICY "Users can view org doc requests" ON doc_requests
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create doc requests" ON doc_requests
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- DOC FILES
CREATE POLICY "Users can view org doc files" ON doc_files
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create doc files" ON doc_files
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- AUDIT LOGS
CREATE POLICY "Admins can view org audit logs" ON audit_logs
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "System can create audit logs" ON audit_logs
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- ============================================================
-- 3. VÉRIFICATION
-- ============================================================

-- Compter les politiques par table
SELECT 
  tablename,
  COUNT(*) as nb_policies
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN (
    'employees', 'leave_requests', 'leave_policies', 'absences',
    'payroll_exports', 'payments', 'reminders', 
    'doc_templates', 'doc_requests', 'doc_files', 'audit_logs'
  )
GROUP BY tablename
ORDER BY tablename;


