-- ============================================================
-- SCRIPT COMPLET : TOUTES LES POLITIQUES RLS
-- Pour finaliser SimplRH - Toutes les fonctionnalités
-- ============================================================

-- ============================================================
-- MODULE RH - EMPLOYEES
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

CREATE POLICY "Owners can delete org employees" ON employees
  FOR DELETE USING (
    org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid())
  );

-- ============================================================
-- MODULE RH - LEAVE REQUESTS (Demandes de congés)
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
-- MODULE RH - LEAVE POLICIES (Politiques de congés)
-- ============================================================

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

-- ============================================================
-- MODULE RH - ABSENCES
-- ============================================================

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

-- ============================================================
-- MODULE RH - PAYROLL EXPORTS (Exports paie)
-- ============================================================

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

-- ============================================================
-- MODULE FACTURATION - PAYMENTS (Paiements)
-- ============================================================

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

-- ============================================================
-- MODULE FACTURATION - REMINDERS (Relances)
-- ============================================================

CREATE POLICY "Users can view org reminders" ON reminders
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create reminders" ON reminders
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- ============================================================
-- MODULE DOCUMENTS - TEMPLATES
-- ============================================================

CREATE POLICY "Users can view org doc templates" ON doc_templates
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
    OR org_id IS NULL  -- Global templates
  );

CREATE POLICY "Admins can manage doc templates" ON doc_templates
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'legal')
    )
  );

-- ============================================================
-- MODULE DOCUMENTS - REQUESTS (Demandes de génération)
-- ============================================================

CREATE POLICY "Users can view org doc requests" ON doc_requests
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create doc requests" ON doc_requests
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- ============================================================
-- MODULE DOCUMENTS - FILES (Fichiers générés)
-- ============================================================

CREATE POLICY "Users can view org doc files" ON doc_files
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create doc files" ON doc_files
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- ============================================================
-- AUDIT LOGS
-- ============================================================

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
-- VÉRIFICATION FINALE
-- ============================================================

-- Lister toutes les politiques créées
SELECT 
  schemaname, 
  tablename, 
  policyname,
  cmd as operation
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Compter les politiques par table
SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;


