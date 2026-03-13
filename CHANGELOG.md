# Changelog — Rilevazioni

Ogni modifica al database o all'app viene registrata qui.
Formato: `[vX] Data — Descrizione`

---

## [v2] — 2026-03
**Database**
- Aggiunta tabella `schema_migrations` per tracciare le modifiche al DB
- Aggiunte RLS policy in sola lettura sulla tabella

## [v1] — stato iniziale
**Database**
- Tabelle presenti: `contracts`, `projects`, `processes`, `sessions`,
  `log_entries`, `cards`, `profiles`, `reparti`, `magazzino`,
  `azioni`, `unita`, `servomezzi`, `attrezzature`, `etichette`
- RLS attive, trigger con SECURITY DEFINER su log_entries
- Backup automatico log_entries tramite trigger `fn_backup_log_entry`

**App**
- `index.html` — router mobile/desktop
- `index_mobile.html` — app principale
- `index_desktop.html` — placeholder desktop
  
## [v3] — 2026-03
**Database**
- Audit RLS completato su tutte le tabelle pubbliche
- Tabelle operative: RLS attiva con policy complete
- Tabelle lookup (business_types, clienti, contract_specialita,
  magazzini, marchi, reparti, settori, specialita, temperature,
  unita_movimentazione): RLS disabilitata per scelta — 
  accessibili a tutti gli utenti autenticati in lettura e scrittura

  ## [v4] — 2026-03
**Database**
- Fix search_path su 12 funzioni pubbliche (security hardening)

- ## [v5] — 2026-03
**Database**
- RLS abilitata sulle 10 tabelle lookup (business_types, clienti,
  contract_specialita, magazzini, marchi, reparti, settori,
  specialita, temperature, unita_movimentazione)
- Accesso completo per utenti autenticati, nessun accesso anonimo

- ## [v6] — 2026-03
**App**
- Aggiunto Service Worker (sw.js) per funzionamento offline
- Banner arancione visibile quando non c'è connessione
- Coda offline: le timbrature vengono salvate localmente e 
  sincronizzate automaticamente al rientro in rete
