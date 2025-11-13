-- Script complet pour corriger toutes les politiques RLS et éviter les récursions
-- À exécuter dans Supabase SQL Editor

-- ============================================================
-- 1. SUPPRIMER TOUTES LES POLITIQUES EXISTANTES
-- ============================================================

-- Members
DROP POLICY IF EXISTS "Members can view org members" ON members;
DROP POLICY IF EXISTS "Owners and admins can manage members" ON members;
DROP POLICY IF EXISTS "Users can join organizations" ON members;

-- Orgs
DROP POLICY IF EXISTS "Members can view their organization" ON orgs;
DROP POLICY IF EXISTS "Owners can update their organization" ON orgs;
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON orgs;

-- ============================================================
-- 2. CRÉER DES POLITIQUES NON-RÉCURSIVES
-- ============================================================

-- -------------------- ORGS --------------------
-- SELECT : Voir les orgs dont on est propriétaire OU dont on est membre
CREATE POLICY "Users can view their orgs" ON orgs
  FOR SELECT 
  USING (
    owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM members 
      WHERE members.org_id = orgs.id 
      AND members.user_id = auth.uid()
    )
  );

-- INSERT : Les utilisateurs authentifiés peuvent créer des organisations
CREATE POLICY "Authenticated users can create orgs" ON orgs
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

-- UPDATE : Les propriétaires peuvent modifier leur organisation
CREATE POLICY "Owners can update their orgs" ON orgs
  FOR UPDATE 
  USING (owner_id = auth.uid());

-- DELETE : Les propriétaires peuvent supprimer leur organisation
CREATE POLICY "Owners can delete their orgs" ON orgs
  FOR DELETE 
  USING (owner_id = auth.uid());

-- -------------------- MEMBERS --------------------
-- SELECT : Les utilisateurs voient leurs propres memberships
CREATE POLICY "Users can view their memberships" ON members
  FOR SELECT 
  USING (user_id = auth.uid());

-- INSERT : Les utilisateurs peuvent créer leurs propres memberships
CREATE POLICY "Users can create their memberships" ON members
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- UPDATE : Les propriétaires peuvent modifier les membres
CREATE POLICY "Owners can update members" ON members
  FOR UPDATE 
  USING (
    org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid())
  );

-- DELETE : Les propriétaires peuvent supprimer des membres
CREATE POLICY "Owners can delete members" ON members
  FOR DELETE 
  USING (
    org_id IN (SELECT id FROM orgs WHERE owner_id = auth.uid())
  );

-- ============================================================
-- 3. VÉRIFICATION
-- ============================================================

-- Afficher toutes les politiques sur members et orgs
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('members', 'orgs')
ORDER BY tablename, policyname;


