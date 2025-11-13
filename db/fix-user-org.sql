-- Script pour créer une organisation pour l'utilisateur connecté
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier l'ID de l'utilisateur
-- Remplacez 'VOTRE_EMAIL@EXAMPLE.COM' par votre vrai email
DO $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT := 'VOTRE_EMAIL@EXAMPLE.COM'; -- ⚠️ CHANGEZ CECI
  v_org_id UUID;
BEGIN
  -- Récupérer l'ID de l'utilisateur depuis auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_user_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non trouvé avec l''email: %', v_user_email;
  END IF;

  RAISE NOTICE 'Utilisateur trouvé: %', v_user_id;

  -- Vérifier si l'utilisateur existe dans la table users
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_user_id) THEN
    -- Créer l'entrée dans users
    INSERT INTO users (id, email, full_name, created_at, updated_at)
    VALUES (
      v_user_id,
      v_user_email,
      'Mon Nom', -- ⚠️ Changez avec votre nom
      NOW(),
      NOW()
    );
    RAISE NOTICE 'Utilisateur créé dans la table users';
  END IF;

  -- Vérifier si l'utilisateur a déjà une organisation
  IF EXISTS (SELECT 1 FROM members WHERE user_id = v_user_id) THEN
    RAISE NOTICE 'L''utilisateur a déjà une organisation';
    RETURN;
  END IF;

  -- Créer une nouvelle organisation
  INSERT INTO orgs (name, siret, billing_plan, modules, owner_id, created_at, updated_at)
  VALUES (
    'Mon Entreprise', -- ⚠️ Changez avec le nom de votre entreprise
    NULL,
    'suite',
    '{"billing": true, "people": true, "docs": true}'::jsonb,
    v_user_id,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_org_id;

  RAISE NOTICE 'Organisation créée: %', v_org_id;

  -- Associer l'utilisateur comme propriétaire de l'organisation
  INSERT INTO members (org_id, user_id, role, created_at, updated_at)
  VALUES (
    v_org_id,
    v_user_id,
    'owner',
    NOW(),
    NOW()
  );

  RAISE NOTICE '✅ Utilisateur associé à l''organisation comme owner';

END $$;

