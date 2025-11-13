-- Ajouter les politiques RLS pour les factures et leurs articles
-- À exécuter dans Supabase SQL Editor

-- ============================================================
-- POLITIQUES POUR INVOICES (Factures)
-- ============================================================

-- SELECT : Les membres peuvent voir les factures de leur organisation
CREATE POLICY "Users can view org invoices" ON invoices
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- INSERT : Les membres peuvent créer des factures
CREATE POLICY "Users can create org invoices" ON invoices
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- UPDATE : Les membres peuvent modifier les factures de leur org
CREATE POLICY "Users can update org invoices" ON invoices
  FOR UPDATE USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- DELETE : Les propriétaires peuvent supprimer les factures
CREATE POLICY "Owners can delete org invoices" ON invoices
  FOR DELETE USING (
    org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid())
  );

-- ============================================================
-- POLITIQUES POUR INVOICE_ITEMS (Articles de facture)
-- ============================================================

-- SELECT : Les membres peuvent voir les articles des factures de leur org
CREATE POLICY "Users can view org invoice items" ON invoice_items
  FOR SELECT USING (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
    )
  );

-- INSERT : Les membres peuvent créer des articles
CREATE POLICY "Users can create invoice items" ON invoice_items
  FOR INSERT WITH CHECK (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
    )
  );

-- UPDATE : Les membres peuvent modifier les articles
CREATE POLICY "Users can update invoice items" ON invoice_items
  FOR UPDATE USING (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
    )
  );

-- DELETE : Les membres peuvent supprimer les articles
CREATE POLICY "Users can delete invoice items" ON invoice_items
  FOR DELETE USING (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
    )
  );

-- ============================================================
-- POLITIQUES POUR CUSTOMERS
-- ============================================================

-- SELECT : Les membres peuvent voir les clients de leur org
CREATE POLICY "Users can view org customers" ON customers
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- INSERT : Les membres peuvent créer des clients
CREATE POLICY "Users can create org customers" ON customers
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- UPDATE : Les membres peuvent modifier les clients
CREATE POLICY "Users can update org customers" ON customers
  FOR UPDATE USING (
    org_id IN (SELECT org_id FROM members WHERE user_id = auth.uid())
  );

-- DELETE : Les propriétaires peuvent supprimer les clients
CREATE POLICY "Owners can delete org customers" ON customers
  FOR DELETE USING (
    org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid())
  );

-- Vérification
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('invoices', 'invoice_items', 'customers')
ORDER BY tablename, policyname;


