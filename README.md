# MAP TECHNOLOGIES

Sito ufficiale di MAP Technologies — Models · Architecture · Platforms.
HTML, CSS e JavaScript, con logo originale, video Higgsfield, schema infrastrutturale animato e font locali. Nessuna dipendenza da installare. Un piccolo Worker Cloudflare gestisce la lingua automatica.

## Pubblicazione su Cloudflare Workers da GitHub

Se Cloudflare mostra un campo **Deploy command**, il progetto usa Workers Builds. Il repository include `wrangler.json`: esegue `dist/_worker.js` sul server e pubblica i file di `dist` tramite il binding `ASSETS`. Il file `dist/.assetsignore` esclude il codice server e `_routes.json` dagli asset pubblici.

- Root directory: radice del repository.
- Build command: lasciare vuoto (il sito è già pronto in `dist`).
- Deploy command: `npx wrangler deploy`.
- Worker: `maptechnologiesv01`, già impostato nel campo `name` in `wrangler.json`.

Non usare un comando che carica soltanto gli asset: anche `/api/locale` deve essere distribuito come codice server. Non inserire account ID o token nel repository. La connessione GitHub di Cloudflare gestisce l'autenticazione.

Documentazione: https://developers.cloudflare.com/workers/static-assets/binding/

## Pubblicazione alternativa su Cloudflare Pages

Importa questo repository da **Workers & Pages → Create application → Pages → Import an existing Git repository**.

| Impostazione | Valore |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `exit 0` |
| Build output directory | `dist` |
| Root directory | Lasciare vuota |

Guida ufficiale: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/

Cloudflare pubblica i file contenuti in `dist`. Per il caricamento manuale, crea uno ZIP con il contenuto di `dist`: `index.html` deve trovarsi nella radice dello ZIP.

## Anteprima e controlli

Con Node.js installato, dalla radice del repository:

```sh
node scripts/check.mjs
node scripts/check-locales.mjs
node scripts/serve.mjs
```

Apri http://127.0.0.1:5173.

## Italiano, inglese e lingua automatica

Il selettore in alto offre **Auto**, **Italiano** ed **English**. La scelta manuale viene conservata in `localStorage` e prevale sul paese dell’IP. Tornando ad Auto, la preferenza manuale viene cancellata.

Su Cloudflare Pages, `/api/locale` usa `request.cf.country`: Italia, San Marino e Vaticano ricevono italiano; gli altri paesi ricevono inglese. Se il paese non è disponibile o la richiesta fallisce, viene usata la lingua principale del browser. Non si chiamano servizi esterni di geolocalizzazione e l’applicazione non memorizza l’IP. La risposta non viene memorizzata in cache.

Per Pages, `dist/_worker.js` e `dist/_routes.json` devono essere inclusi nella pubblicazione e nello ZIP. La modalità avanzata è compatibile sia con Git sia con il caricamento diretto di Cloudflare Pages: https://developers.cloudflare.com/pages/get-started/direct-upload/ . Uno ZIP Pages non è un pacchetto per il caricamento di soli asset in Workers. Per Workers usare il repository con `wrangler.json`, che configura sia il codice server sia gli asset. Non sono necessarie chiavi API di geolocalizzazione. Il sito resta utilizzabile anche se il rilevamento del paese non risponde.

L’anteprima locale non conosce il paese dell’IP: usa normalmente la lingua del browser. Per simulare un paese durante i controlli, avviare il server con `MAP_PREVIEW_COUNTRY=IT` (variabile solo locale). I test verificano paesi, fallback, precedenza della preferenza manuale e cache. Il rilevamento effettivo all’edge va verificato dopo la pubblicazione su Cloudflare.

## Contatti

Impostare l'indirizzo aziendale verificato in `dist/config.js`, nel campo `contactEmail`.
Finché rimane vuoto, il modulo scarica un brief locale e dichiara che non è stato inviato. Con un indirizzo configurato, prepara una bozza nell'app email del visitatore, che può verificarla e inviarla. Non è presente un servizio di invio lato server.

## Dominio e SEO

Il dominio definitivo non è ancora configurato. I riferimenti al precedente hosting sono stati rimossi. Dopo la scelta del dominio, aggiungere canonical e `og:url`, usare URL assoluti per le immagini social e il logo nei dati strutturati, e creare la sitemap con il nuovo indirizzo.

## Struttura

- `dist/index.html`: contenuti, sezioni, dialog e metadati.
- `dist/styles.css`: layout responsive e animazioni.
- `dist/refinements.css`: testi ingranditi e logo integrato senza riquadro nero.
- `dist/polish.css`: barra fissa traslucida, tipografia, schede arrotondate e transizioni fluide, con layout responsive.
- `dist/assets/map-logo-minimal.svg`: firma vettoriale per la barra, con le tre lettere MAP dentro l’esagono e scritta MAP geometrica a fianco. Sfondo trasparente e proporzioni adattate a desktop e mobile.
- `dist/interactions.css` e `dist/interactions.js`: animazioni Software e Systems, cursore e filtro di trasparenza del logo.
- `dist/schematic.css`: schema infrastrutturale interattivo della sezione 03.
- `dist/visuals.css`: illustrazioni vettoriali per le tre aree aziendali, le sette soluzioni, il percorso di consulenza e i contatti. La sezione 06 usa orbite aperte con tracce luminose e sei discipline selezionabili, distinte dal circuito hardware della 03. Le animazioni rispettano pausa, visibilità e movimento ridotto.
- `dist/i18n.js`, `dist/translations.js` e `dist/locale-policy.js`: traduzioni, selettore e precedenze della lingua.
- `dist/language-picker.js` e `dist/languages.css`: selettore compatto IT/EN con globo e pannello Italiano, English e Automatico. Supporta tastiera, Escape, chiusura esterna e conservazione della scelta; il select nativo resta disponibile senza JavaScript.
- `dist/_worker.js` e `dist/_routes.json`: rilevamento del paese su Cloudflare Pages.
- `wrangler.json` e `dist/.assetsignore`: deploy su Workers con codice server escluso dagli asset pubblici e `/api/locale` eseguito prima della ricerca degli asset.
- `dist/app.js`: menu, schede interattive, rete MAP e modulo.
- `dist/config.js`: configurazione dei contatti.
- `dist/assets/`: logo, film, immagini, font e licenza Manrope.
- `scripts/`: anteprima locale e verifica di link, asset e struttura.

Il film è silenzioso e ottimizzato per il web. Su mobile, dispositivi a risparmio dati e con movimento ridotto viene mostrata l'immagine statica. Non sono presenti tracker o incorporamenti esterni.

La pagina si apre direttamente, senza schermata introduttiva. La barra superiore usa una firma SVG minimale e trasparente. Il logo originale è conservato nel footer, dove un filtro SVG rende trasparenti i pixel neri durante il rendering. Le sezioni Software e Systems hanno animazioni continue, sospese fuori schermo e quando il movimento è disattivato. Il cursore aggiuntivo compare solo con il mouse e rispetta le preferenze di movimento ridotto. Il nuovo film Higgsfield del dispositivo che si compone e scompone resta rimandato.
