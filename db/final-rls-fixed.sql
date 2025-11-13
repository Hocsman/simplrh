-- ============================================================
-- SCRIPT FINAL CORRIGÉ - Politiques RLS
-- Prend en compte la structure réelle des tables
-- ============================================================

-- ============================================================
-- 1. SUPPRIMER LES POLITIQUES EXISTANTES
-- ============================================================

DROP POLICY IF EXISTS "Users can view org employees" ON employees;
DROP POLICY IF EXISTS "Users can create org employees" ON employees;
DROP POLICY IF EXISTS "Users can update org employees" ON employees;
DROP POLICY IF EXISTS "Users can view org leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Users can create leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Managers can update leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Users can view org leave policies" ON leave_policies;
DROP POLICY IF EXISTS "Users can view org absences" ON absences;
DROP POLICY IF EXISTS "Users can create absences" ON absences;
DROP POLICY IF EXISTS "Users can view org payroll exports" ON payroll_exports;
DROP POLICY IF EXISTS "Users can view org payments" ON payments;
DROP POLICY IF EXISTS "Users can create payments" ON payments;
DROP POLICY IF EXISTS "Users can update payments" ON payments;
DROP POLICY IF EXISTS "Users can view org reminders" ON reminders;
DROP POLICY IF EXISTS "Users can create reminders" ON reminders;

-- ============================================================
-- 2. POLITIQUES POUR EMPLOYEES (a org_id)
-- ============================================================

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

-- ============================================================
-- 3. POLITIQUES POUR LEAVE_REQUESTS (a org_id)
-- ============================================================

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

-- ============================================================
-- 4. POLITIQUES POUR LEAVE_POLICIES (a org_id)
-- ============================================================

CREATE POLICY "Users can view org leave policies" ON leave_policies
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- ============================================================
-- 5. POLITIQUES POUR ABSENCES (a org_id)
-- ============================================================

CREATE POLICY "Users can view org absences" ON absences
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create absences" ON absences
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- ============================================================
-- 6. POLITIQUES POUR PAYROLL_EXPORTS (a org_id)
-- ============================================================

CREATE POLICY "Users can view org payroll exports" ON payroll_exports
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- ============================================================
-- 7. POLITIQUES POUR PAYMENTS (PAS de org_id, via invoice_id)
-- ============================================================

CREATE POLICY "Users can view org payments" ON payments
  FOR SELECT USING (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create payments" ON payments
  FOR INSERT WITH CHECK (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can update payments" ON payments
  FOR UPDATE USING (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
    )
  );

-- ============================================================
-- 8. POLITIQUES POUR REMINDERS (PAS de org_id, via invoice_id)
-- ============================================================

CREATE POLICY "Users can view org reminders" ON reminders
  FOR SELECT USING (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create reminders" ON reminders
  FOR INSERT WITH CHECK (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
    )
  );

-- ============================================================
-- 9. VÉRIFICATION
-- ============================================================

SELECT 
  tablename,
  COUNT(*) as nb_policies
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN (
    'employees', 'leave_requests', 'leave_policies', 'absences',
    'payroll_exports', 'payments', 'reminders'
  )
GROUP BY tablename
ORDER BY tablename;


