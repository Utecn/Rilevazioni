-- ============================================================
-- MIGRAZIONE 001 — Stato iniziale app
-- Data: 2026-03
-- Descrizione: Tabelle esistenti al momento dell'introduzione
--              del sistema di migrazioni
-- ============================================================

-- UP (cosa esiste già nel database)
-- Tabelle: contracts, projects, processes, sessions,
--          log_entries, cards, profiles, reparti, magazzino,
--          azioni, unita, servomezzi, attrezzature, etichette

-- Nessuna modifica da applicare — questo file documenta
-- lo stato di partenza.

-- Traccia migrazione
INSERT INTO schema_migrations (version, name)
VALUES (1, 'stato_iniziale_app')
ON CONFLICT DO NOTHING;


-- DOWN (come annullare — non applicabile per la versione iniziale)
-- N/A
