# Rilevazioni

App web per il tracciamento tempi di lavoro.

## File principali
| File | Descrizione |
|------|-------------|
| `index.html` | Router: rileva mobile/desktop e reindirizza |
| `index_mobile.html` | App principale (mobile) |
| `index_desktop.html` | Versione desktop (in costruzione) |

## Database
Backend: [Supabase](https://supabase.com)

Le modifiche al database sono tracciate nella cartella `migrations/`.
Ogni file è numerato progressivamente: `001_...`, `002_...` ecc.

## Come aggiornare l'app
1. Scarica il nuovo file HTML da Claude
2. Caricalo su GitHub sostituendo il vecchio
3. Se la sessione includeva modifiche al DB, aggiungi anche
   il file SQL nella cartella `migrations/` e aggiorna `CHANGELOG.md`

## Come tornare a una versione precedente
1. Vai su GitHub → clicca il file → **History**
2. Scegli la versione → **< > Browse files**
3. Apri il file raw → scarica → ricarica su GitHub
