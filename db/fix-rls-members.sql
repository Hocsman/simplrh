-- Script pour corriger les politiques RLS récursives sur la table members
-- À exécuter dans Supabase SQL Editor

-- 1. Supprimer toutes les politiques existantes sur members
DROP POLICY IF EXISTS "Members can view org members" ON members;
DROP POLICY IF EXISTS "Owners and admins can manage members" ON members;
DROP POLICY IF EXISTS "Users can join organizations" ON members;

-- 2. Créer des politiques NON-RÉCURSIVES

-- Politique SELECT : Les utilisateurs peuvent voir leurs propres entrées membres
CREATE POLICY "Users can view their own memberships" ON members
  FOR SELECT 
  USING (user_id = auth.uid());

-- Politique INSERT : Les utilisateurs peuvent créer leurs propres entrées (pour le onboarding)
CREATE POLICY "Users can insert their own membership" ON members
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- Politique UPDATE : Les propriétaires peuvent mettre à jour les membres de leur org
-- On utilise owner_id de orgs pour éviter la récursion
CREATE POLICY "Owners can update org members" ON members
  FOR UPDATE 
  USING (
    org_id IN (
      SELECT id FROM orgs WHERE owner_id = auth.uid()
    )
  );

-- Politique DELETE : Les propriétaires peuvent supprimer des membres
CREATE POLICY "Owners can delete org members" ON members
  FOR DELETE 
  USING (
    org_id IN (
      SELECT id FROM orgs WHERE owner_id = auth.uid()
    )
  );

-- Note : Ces politiques sont plus simples et évitent la récursion
-- Elles permettent :
-- - À chaque utilisateur de voir ses propres memberships
-- - À chaque utilisateur de créer son membership (nécessaire pour le onboarding)
-- - Aux propriétaires d'organisation de gérer les membres


