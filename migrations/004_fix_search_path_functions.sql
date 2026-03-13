-- ============================================================
-- MIGRAZIONE 004 — Fix search_path funzioni pubbliche
-- Data: 2026-03
-- Descrizione: Aggiunge SET search_path = public a tutte le
--              funzioni per prevenire search_path injection
-- ============================================================

-- UP
ALTER FUNCTION public.fn_backup_log_entry() SET search_path = public;
ALTER FUNCTION public.fn_backup_project() SET search_path = public;
ALTER FUNCTION public.fn_backup_contract() SET search_path = public;
ALTER FUNCTION public.fn_block_mass_delete() SET search_path = public;
ALTER FUNCTION public.fn_block_mass_delete_contracts() SET search_path = public;
ALTER FUNCTION public.fn_block_mass_delete_projects() SET search_path = public;
ALTER FUNCTION public.fn_restore_contract(p_backup_id bigint) SET search_path = public;
ALTER FUNCTION public.fn_restore_log_entry(p_backup_id bigint) SET search_path = public;
ALTER FUNCTION public.fn_restore_project(p_backup_id bigint) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.has_project_access(pid uuid) SET search_path = public;
ALTER FUNCTION public.is_admin() SET search_path = public;

INSERT INTO schema_migrations (version, name)
VALUES (4, 'fix_search_path_functions')
ON CONFLICT DO NOTHING;

-- DOWN
-- ALTER FUNCTION public.fn_backup_log_entry() RESET search_path;
-- (ripeti per tutte le funzioni)
