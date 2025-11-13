-- ============================================================
-- VÉRIFICATION FINALE : Toutes les Politiques RLS
-- Exécutez ce script pour voir l'état actuel
-- ============================================================

-- 1. LISTER TOUTES LES TABLES
SELECT 
  table_name,
  CASE 
    WHEN table_name IN (
      SELECT tablename FROM pg_policies WHERE schemaname = 'public'
    ) THEN '✅ A des politiques'
    ELSE '❌ PAS de politiques'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
  AND table_name NOT LIKE 'pg_%'
ORDER BY table_name;

-- 2. COMPTER LES POLITIQUES PAR TABLE
SELECT 
  tablename,
  COUNT(*) as nb_policies
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- 3. TABLES SANS POLITIQUES RLS
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

