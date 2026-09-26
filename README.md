# MAP TECHNOLOGIES

Sito ufficiale di MAP Technologies — Models · Architecture · Platforms.
HTML, CSS e JavaScript, con logo originale, video e immagini Higgsfield e font locali. Nessuna dipendenza da installare.

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
node scripts/serve.mjs
```

Apri http://127.0.0.1:5173.

## Contatti

Impostare l'indirizzo aziendale verificato in `dist/config.js`, nel campo `contactEmail`.
Finché rimane vuoto, il modulo scarica un brief locale e dichiara che non è stato inviato. Con un indirizzo configurato, prepara una bozza nell'app email del visitatore, che può verificarla e inviarla. Non è presente un servizio di invio lato server.

## Dominio e SEO

Il dominio definitivo non è ancora configurato. I riferimenti al precedente hosting sono stati rimossi. Dopo la scelta del dominio, aggiungere canonical e `og:url`, usare URL assoluti per le immagini social e il logo nei dati strutturati, e creare la sitemap con il nuovo indirizzo.

## Struttura

- `dist/index.html`: contenuti, sezioni, dialog e metadati.
- `dist/styles.css`: layout responsive e animazioni.
- `dist/app.js`: menu, schede interattive, rete MAP e modulo.
- `dist/config.js`: configurazione dei contatti.
- `dist/assets/`: logo, film, immagini, font e licenza Manrope.
- `scripts/`: anteprima locale e verifica di link, asset e struttura.

Il film è silenzioso e ottimizzato per il web. Su mobile, dispositivi a risparmio dati e con movimento ridotto viene mostrata l'immagine statica. Non sono presenti tracker o incorporamenti esterni.