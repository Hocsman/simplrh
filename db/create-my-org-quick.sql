-- Script rapide pour créer votre organisation
-- À exécuter dans Supabase SQL Editor

-- REMPLACEZ 'votre-email@example.com' par votre vrai email ci-dessous

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'votre-email@example.com'; -- ⚠️ CHANGEZ CECI AVEC VOTRE EMAIL
  v_org_id UUID;
BEGIN
  -- 1. Récupérer votre ID utilisateur
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non trouvé avec l''email: %. Vérifiez votre email.', v_email;
  END IF;
  
  RAISE NOTICE '✅ Utilisateur trouvé: % (ID: %)', v_email, v_user_id;
  
  -- 2. Vérifier si l'utilisateur existe dans la table users
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_user_id) THEN
    INSERT INTO users (id, email, full_name)
    VALUES (v_user_id, v_email, 'Mon Nom'); -- Changez "Mon Nom" si vous voulez
    RAISE NOTICE '✅ Utilisateur ajouté dans la table users';
  END IF;
  
  -- 3. Vérifier si une organisation existe déjà
  IF EXISTS (SELECT 1 FROM members WHERE user_id = v_user_id) THEN
    SELECT org_id INTO v_org_id FROM members WHERE user_id = v_user_id LIMIT 1;
    RAISE NOTICE '⚠️ Vous avez déjà une organisation (ID: %)', v_org_id;
    RETURN;
  END IF;
  
  -- 4. Créer l'organisation
  INSERT INTO orgs (name, billing_plan, modules, owner_id)
  VALUES (
    'Mon Entreprise', -- ⚠️ Changez le nom de votre entreprise ici
    'suite',
    '{"billing": true, "people": true, "docs": true}'::jsonb,
    v_user_id
  )
  RETURNING id INTO v_org_id;
  
  RAISE NOTICE '✅ Organisation créée: % (ID: %)', 'Mon Entreprise', v_org_id;
  
  -- 5. Ajouter l'utilisateur comme propriétaire
  INSERT INTO members (org_id, user_id, role)
  VALUES (v_org_id, v_user_id, 'owner');
  
  RAISE NOTICE '✅ Vous êtes maintenant propriétaire de l''organisation !';
  RAISE NOTICE '🎉 Tout est prêt ! Vous pouvez créer des clients et des factures.';
  
END $$;

