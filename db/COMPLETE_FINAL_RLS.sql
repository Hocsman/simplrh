-- ============================================================
-- SCRIPT FINAL COMPLET : TOUTES LES POLITIQUES RLS MANQUANTES
-- À exécuter dans Supabase pour finaliser la sécurité
-- ============================================================

-- ============================================================
-- TABLES DÉJÀ FAITES (ne pas refaire) :
-- - users ✅
-- - orgs ✅
-- - members ✅
-- - customers ✅
-- - invoices ✅
-- - invoice_items ✅
-- - employees ✅
-- - leave_requests ✅
-- - payments ✅
-- - reminders ✅
-- ============================================================

-- ============================================================
-- TABLES À COMPLÉTER :
-- - leave_policies
-- - absences
-- - payroll_exports
-- - doc_templates
-- - doc_requests
-- - doc_files
-- - audit_logs
-- ============================================================

-- ============================================================
-- 1. LEAVE_POLICIES (Politiques de congés)
-- ============================================================

DROP POLICY IF EXISTS "Users can view org leave policies" ON leave_policies;
DROP POLICY IF EXISTS "Admins can create leave policies" ON leave_policies;
DROP POLICY IF EXISTS "Admins can update leave policies" ON leave_policies;
DROP POLICY IF EXISTS "Admins can delete leave policies" ON leave_policies;

CREATE POLICY "Users can view org leave policies" ON leave_policies
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can create leave policies" ON leave_policies
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can update leave policies" ON leave_policies
  FOR UPDATE USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can delete leave policies" ON leave_policies
  FOR DELETE USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- ============================================================
-- 2. ABSENCES
-- ============================================================

DROP POLICY IF EXISTS "Users can view org absences" ON absences;
DROP POLICY IF EXISTS "Users can create absences" ON absences;
DROP POLICY IF EXISTS "Users can update absences" ON absences;
DROP POLICY IF EXISTS "Admins can delete absences" ON absences;

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

CREATE POLICY "Admins can delete absences" ON absences
  FOR DELETE USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- ============================================================
-- 3. PAYROLL_EXPORTS (Exports paie)
-- ============================================================

DROP POLICY IF EXISTS "Users can view org payroll exports" ON payroll_exports;
DROP POLICY IF EXISTS "Admins can create payroll exports" ON payroll_exports;
DROP POLICY IF EXISTS "Admins can delete payroll exports" ON payroll_exports;

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

CREATE POLICY "Admins can delete payroll exports" ON payroll_exports
  FOR DELETE USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- ============================================================
-- 4. DOC_TEMPLATES (Templates de documents)
-- ============================================================

DROP POLICY IF EXISTS "Users can view doc templates" ON doc_templates;
DROP POLICY IF EXISTS "Admins can create doc templates" ON doc_templates;
DROP POLICY IF EXISTS "Admins can update doc templates" ON doc_templates;
DROP POLICY IF EXISTS "Admins can delete doc templates" ON doc_templates;

CREATE POLICY "Users can view doc templates" ON doc_templates
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
    OR org_id IS NULL  -- Templates globaux
  );

CREATE POLICY "Admins can create doc templates" ON doc_templates
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'legal')
    )
    OR org_id IS NULL
  );

CREATE POLICY "Admins can update doc templates" ON doc_templates
  FOR UPDATE USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'legal')
    )
  );

CREATE POLICY "Admins can delete doc templates" ON doc_templates
  FOR DELETE USING (
    org_id IN (
      SELECT org_id FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- ============================================================
-- 5. DOC_REQUESTS (Demandes de génération)
-- ============================================================

DROP POLICY IF EXISTS "Users can view org doc requests" ON doc_requests;
DROP POLICY IF EXISTS "Users can create doc requests" ON doc_requests;
DROP POLICY IF EXISTS "Users can update doc requests" ON doc_requests;

CREATE POLICY "Users can view org doc requests" ON doc_requests
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create doc requests" ON doc_requests
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update doc requests" ON doc_requests
  FOR UPDATE USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- ============================================================
-- 6. DOC_FILES (Fichiers générés)
-- ============================================================

DROP POLICY IF EXISTS "Users can view org doc files" ON doc_files;
DROP POLICY IF EXISTS "Users can create doc files" ON doc_files;

CREATE POLICY "Users can view org doc files" ON doc_files
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create doc files" ON doc_files
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- ============================================================
-- 7. AUDIT_LOGS
-- ============================================================

DROP POLICY IF EXISTS "Admins can view org audit logs" ON audit_logs;
DROP POLICY IF EXISTS "System can create audit logs" ON audit_logs;

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

-- Afficher le nombre de politiques par table
SELECT 
  tablename,
  COUNT(*) as nb_policies
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- Afficher les tables sans politiques
SELECT table_name
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
  AND table_name NOT LIKE 'pg_%'
  AND NOT EXISTS (
    SELECT 1 FROM pg_policies p 
    WHERE p.tablename = t.table_name 
    AND p.schemaname = 'public'
  )
ORDER BY table_name;

-- Total de politiques créées
SELECT COUNT(*) as total_policies
FROM pg_policies 
WHERE schemaname = 'public';

