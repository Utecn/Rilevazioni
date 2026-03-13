-- ============================================================
-- MIGRAZIONE 005 — RLS tabelle lookup
-- Data: 2026-03
-- Descrizione: Abilita RLS sulle 10 tabelle lookup con accesso
--              completo per utenti autenticati
-- ============================================================

-- UP
DO $$ 
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'business_types','clienti','contract_specialita',
    'magazzini','marchi','reparti','settori',
    'specialita','temperature','unita_movimentazione'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('
      CREATE POLICY "lettura autenticati" ON %I
      FOR SELECT USING (auth.role() = ''authenticated'')', t);
    EXECUTE format('
      CREATE POLICY "scrittura autenticati" ON %I
      FOR ALL USING (auth.role() = ''authenticated'')', t);
  END LOOP;
END $$;

INSERT INTO schema_migrations (version, name)
VALUES (5, 'rls_tabelle_lookup')
ON CONFLICT DO NOTHING;

-- DOWN
-- DO $$ DECLARE t TEXT; BEGIN
--   FOREACH t IN ARRAY ARRAY['business_types','clienti',...]
--   LOOP
--     EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', t);
--   END LOOP;
-- END $$;
