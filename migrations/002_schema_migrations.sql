-- ============================================================
-- MIGRAZIONE 002 — Tabella schema_migrations
-- Data: 2026-03
-- Descrizione: Aggiunge il taccuino di versioning del database
-- ============================================================

-- UP
CREATE TABLE IF NOT EXISTS schema_migrations (
  version     INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  applied_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE schema_migrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lettura pubblica migrazioni"
  ON schema_migrations FOR SELECT
  USING (true);

INSERT INTO schema_migrations (version, name)
VALUES (1, 'stato_iniziale_app')
ON CONFLICT DO NOTHING;

INSERT INTO schema_migrations (version, name)
VALUES (2, 'schema_migrations')
ON CONFLICT DO NOTHING;


-- DOWN
-- DROP TABLE IF EXISTS schema_migrations;
