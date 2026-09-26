# MAP TECHNOLOGIES

Sito ufficiale di MAP Technologies — Models · Architecture · Platforms.
HTML, CSS e JavaScript, con logo originale, video Higgsfield, immagine del modulo AI generata con Imagegen e font locali. Nessuna dipendenza da installare. Un piccolo Worker Cloudflare gestisce la lingua automatica.

## Pubblicazione su Cloudflare Pages

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

`dist/_worker.js` e `dist/_routes.json` devono essere inclusi nella pubblicazione e nello ZIP. La modalità avanzata è compatibile sia con Git sia con il caricamento diretto di Cloudflare Pages: https://developers.cloudflare.com/pages/get-started/direct-upload/ . Non sono necessarie chiavi API. Il sito resta utilizzabile anche se il rilevamento del paese non risponde.

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
- `dist/interactions.css` e `dist/interactions.js`: animazioni Software e Systems, cursore e filtro di trasparenza del logo.
- `dist/i18n.js`, `dist/translations.js` e `dist/locale-policy.js`: traduzioni, selettore e precedenze della lingua.
- `dist/_worker.js` e `dist/_routes.json`: rilevamento del paese su Cloudflare Pages.
- `dist/app.js`: menu, schede interattive, rete MAP e modulo.
- `dist/config.js`: configurazione dei contatti.
- `dist/assets/`: logo, film, immagini, font e licenza Manrope.
- `scripts/`: anteprima locale e verifica di link, asset e struttura.

Il film è silenzioso e ottimizzato per il web. Su mobile, dispositivi a risparmio dati e con movimento ridotto viene mostrata l'immagine statica. Non sono presenti tracker o incorporamenti esterni.

La pagina si apre direttamente, senza schermata introduttiva. Il logo originale è conservato: un filtro SVG rende trasparenti i pixel neri durante il rendering, anche nella barra superiore. Le sezioni Software e Systems hanno animazioni continue, sospese fuori schermo e quando il movimento è disattivato. Il cursore aggiuntivo compare solo con il mouse e rispetta le preferenze di movimento ridotto. Il nuovo film Higgsfield del dispositivo che si compone e scompone resta rimandato.
