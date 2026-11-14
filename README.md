# SELECTA EMPIRE LIMITED — Site officiel

Site vitrine, portfolio et plateforme de gestion de **SELECTA EMPIRE LIMITED (SLA)** —
agence événementielle et maison de production audiovisuelle.

Direction artistique : _Luxury Cinematic Corporate Experience_.
Signature : **WE CREATE. WE CAPTURE. WE INSPIRE.**

## État du projet

> Projet en cours de construction. Les fonctionnalités ne sont documentées ici que
> lorsqu'elles sont effectivement présentes dans le dépôt.

- **Frontend Angular 22** : socle applicatif, charte graphique, composants partagés,
  en-tête/pied de page, accueil et pages publiques en cours d'assemblage.
- **Contenu** : source unique `content/seed.json`, copiée vers le frontend par
  `tools/sync-content.mjs`. Les projets et événements de démonstration sont signalés
  comme tels dans l'interface.
- **Aucune preuve inventée** : témoignages et partenaires restent masqués tant qu'ils
  ne sont pas renseignés et approuvés ; les coordonnées sont des espaces réservés à
  configurer avant mise en production.
- **API & administration** : à venir (`api/`, back-office `/admin`).

## Stack

| Couche          | Technologie                                              |
| --------------- | -------------------------------------------------------- |
| Frontend        | Angular 22, TypeScript, SCSS, signaux, composants standalone |
| Tests frontend  | Vitest                                                   |
| API (prévue)    | Node.js 22, Express, Knex                                |
| Base de données | SQLite en développement, MySQL en production             |

> **Note d'environnement** : l'implémentation Laravel/MySQL initialement prévue n'a pas
> pu être exécutée dans l'environnement de développement disponible (PHP, Composer et
> MySQL absents). Le contrat REST et les fonctionnalités demandées sont conservés ; la
> couche API est réalisée avec Node/Express/Knex, avec MySQL en production.

## Démarrage du frontend

```bash
cd frontend
npm install
npm start
```

L'application est servie par le CLI Angular. Le proxy de développement redirige
`/api` et `/uploads` vers `http://localhost:4000` (API à venir).

```bash
cd frontend
npm run build    # build de production
npm test         # tests unitaires (Vitest)
```

## Structure du dépôt

```text
.
├── content/                  # Contenu source bilingue (seed.json)
├── frontend/                 # Application Angular
│   ├── public/
│   │   ├── brand/            # Logos et symboles SLA (SVG)
│   │   ├── fonts/            # Polices auto-hébergées
│   │   └── images/           # Photographies et variantes responsives
│   └── src/
│       ├── app/
│       │   ├── core/         # Modèles, services, i18n, interceptors, guards
│       │   ├── layouts/      # En-tête, pied de page, layout public
│       │   ├── pages/        # Pages publiques (lazy loaded)
│       │   └── shared/       # Composants UI et directives réutilisables
│       └── styles/           # Design system SCSS
└── tools/                    # Scripts de génération (marque, contenu)
```

## Identité de marque

- Monogramme : **SLA** (jamais « SE »).
- Palette : blanc laiteux `#F4F1E9`, bleu Empire `#2457A6`, Vantablack `#050505`.
- Typographies : Sora, Inter, Space Grotesk (auto-hébergées).
- Logo : monogramme SLA + « SELECTA EMPIRE » + « LIMITED », en versions claire et foncée.

## Internationalisation

Le français est la langue principale, l'anglais la langue secondaire. Les URLs anglaises
sont préfixées par `/en` (par exemple `/a-propos` ↔ `/en/a-propos`). Le changement de
langue conserve la page courante.

## Accessibilité & performance

- Animations désactivées lorsque `prefers-reduced-motion` est actif.
- Images responsive WebP avec chargement différé.
- Navigation clavier, lien d'évitement et libellés ARIA.
- Métadonnées SEO, Open Graph, canoniques et données structurées gérés par `SeoService`.

## Licence

Contenu, photographies et identité visuelle : © SELECTA EMPIRE LIMITED.
Tous droits réservés.
