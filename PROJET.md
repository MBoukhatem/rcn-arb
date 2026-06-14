# نظام الجذور العربية — Dictionnaire de Racines Trilitères Arabes

> Application web fullstack permettant d'explorer les racines trilitères de la langue arabe et leurs mots dérivés, classés par type morphologique.

---

## Table des matières

1. [Résumé exécutif](#1-résumé-exécutif)
2. [Concept & fonctionnalités métier](#2-concept--fonctionnalités-métier)
3. [Stack technique](#3-stack-technique)
4. [Compatibilité des versions](#4-compatibilité-des-versions)
5. [Architecture générale](#5-architecture-générale)
6. [Modèles de données](#6-modèles-de-données)
7. [Morphologie arabe : les 7 types dérivés](#7-morphologie-arabe--les-7-types-dérivés)
8. [API REST](#8-api-rest)
9. [Authentification & sécurité](#9-authentification--sécurité)
10. [Frontend](#10-frontend)
11. [Arborescence complète](#11-arborescence-complète)
12. [Variables d'environnement](#12-variables-denvironnement)
13. [Scripts npm](#13-scripts-npm)
14. [Données de seed](#14-données-de-seed)
15. [Matrice de conformité](#15-matrice-de-conformité)
16. [Plan de mise en route](#16-plan-de-mise-en-route)
17. [Périmètre des bonus](#17-périmètre-des-bonus)

---

## 1. Résumé exécutif

Le **Dictionnaire de Racines Trilitères Arabes** (نظام الجذور العربية) est une application web fullstack qui rend tangible le mécanisme central de la morphologie arabe : la dérivation. En arabe, presque tout le lexique se construit à partir de **racines de trois consonnes** (جَذْر ثُلَاثِيّ) auxquelles on applique des **schèmes** (أوزان). L'application permet à l'utilisateur de saisir trois lettres arabes formant une racine, de modifier librement cette combinaison, et d'obtenir instantanément la liste des mots dérivés organisés par catégorie morphologique (verbe, masdar, nom d'agent, etc.).

L'application s'adresse aux **étudiants en langue arabe**, aux **enseignants**, aux **linguistes amateurs** et à toute personne curieuse du fonctionnement de cette langue. Sa valeur métier réside dans la visualisation pédagogique d'un concept abstrait : au lieu d'apprendre des mots isolés, l'utilisateur comprend comment un même noyau sémantique se décline en familles entières de termes. La racine ك-ت-ب (« écrire ») produit ainsi كَاتِب (écrivain), مَكْتَب (bureau), كِتَاب (livre), كِتَابَة (l'écriture), مَكْتُوب (lettre)…

Au-delà de la consultation, l'application offre un **espace contributif** : tout utilisateur inscrit peut créer, éditer et supprimer des racines et des mots, enrichissant collaborativement le dictionnaire. Chaque utilisateur dispose d'un profil, peut mettre en favori les racines et mots qui l'intéressent, et personnaliser son expérience (thème clair/sombre, interface en français ou anglais). Le projet démontre une maîtrise complète d'une architecture **REST + JWT + MongoDB + React**, dans le respect strict d'un cahier des charges académique.

---

## 2. Concept & fonctionnalités métier

### 2.1 La morphologie arabe expliquée simplement

L'arabe est une langue **non concaténative** : les mots ne se forment pas en accolant des préfixes/suffixes à un radical fixe, mais en **insérant un squelette consonantique dans un moule**.

- La **racine** (جَذْر) est un trio de consonnes porteuses du sens fondamental. Exemple : ك-ت-ب porte l'idée d'« écriture ».
- Le **schème** (وَزْن) est un patron vocalique et structurel. On le note traditionnellement avec les lettres-témoins **ف-ع-ل** (fāʾ, ʿayn, lām). Le schème فَاعِل appliqué à ك-ت-ب donne كَاتِب.
- En croisant une racine et un schème, on obtient un **mot dérivé** dont le type morphologique est déterminé par le schème.

C'est exactement ce mécanisme que l'application matérialise : **racine + schème → mot**, regroupés par **type morphologique**.

### 2.2 Parcours utilisateur

| Étape | Action | Page |
|-------|--------|------|
| 1 | L'utilisateur arrive sur la présentation du projet | `Home` |
| 2 | Il ouvre l'explorateur et sélectionne 3 lettres arabes | `RootExplorer` |
| 3 | Il peut modifier n'importe laquelle des 3 lettres | `RootExplorer` |
| 4 | Il consulte les mots dérivés classés par type | `RootExplorer` / `RootDetail` |
| 5 | Il ouvre le détail d'une racine et de ses mots | `RootDetail` |
| 6 | (optionnel) Il s'inscrit / se connecte | `Register` / `Login` |
| 7 | Il met en favori racines et mots | `FavoriteButton` |
| 8 | Il crée / édite / supprime racines et mots | `RootDetail`, modales |
| 9 | Il consulte ses favoris et gère son profil | `Favorites`, `Profile` |
| 10 | Il enregistre des racines pour les **réviser** sous forme de cartes | `Revisions`, `RevisionSession` |
| 11 | Il consulte ses **statistiques** de mémorisation (score /100) | `Revisions` |

### 2.3 La fonctionnalité métier spécifique

Le cœur fonctionnel — qui distingue ce projet d'un simple CRUD générique — est **l'exploration de racines avec classification morphologique automatique** :

1. **Sélection interactive des 3 lettres** via le composant `LetterPicker` (alphabet arabe complet, 28 lettres).
2. **Suggestion en rouge des lettres compatibles** : dès qu'une lettre est posée, l'API renvoie la liste des lettres qui, placées dans un slot vide, complètent une racine **existante** en base. L'utilisateur voit ainsi en temps réel les pistes valides (cf. D11).
3. **Normalisation** des lettres saisies (suppression des diacritiques, unification des hamzas/alifs) afin de retrouver la racine quelle que soit la graphie.
4. **Résolution de la racine** par son `slug` (3 lettres normalisées jointes par `-`, ex. `ك-ت-ب`).
5. **Regroupement des mots dérivés par type** : l'interface affiche des sections distinctes (Verbes, Masdars, Noms d'agent…), chacune indiquant le schème.
6. **Recherche avancée multi-filtres** sur les mots (lettres, type, temps, texte libre, tri, pagination).
7. **Système de révision par cartes mémoire** (cf. D11) : l'utilisateur enregistre des racines, lance une session chronométrée, retourne chaque carte pour révéler le sens, et s'auto-évalue sur 4 niveaux (raté / difficile / moyen / facile). Les compteurs alimentent un **score global pondéré sur 100** et un détail par racine.

---

## 3. Stack technique

### 3.1 Runtime

| Composant | Version | Rôle |
|-----------|---------|------|
| Node.js | 22.x LTS (22.15.0) | Runtime JavaScript serveur |
| npm | 10.x | Gestionnaire de paquets |
| MongoDB | 7.0.x Community | Base de données NoSQL documentaire |

### 3.2 Backend — `dependencies`

| Paquet | Version | Rôle |
|--------|---------|------|
| express | ^4.21.2 | Framework HTTP / routage |
| mongoose | ^8.13.0 | ODM MongoDB (schémas, validation, populate) |
| jsonwebtoken | ^9.0.2 | Génération et vérification des JWT |
| bcryptjs | ^2.4.3 | Hachage des mots de passe (pur JS) |
| joi | ^17.13.3 | Validation des payloads entrants |
| cors | ^2.8.5 | Politique CORS (whitelist) |
| dotenv | ^16.4.7 | Chargement des variables d'environnement |
| helmet | ^8.0.0 | En-têtes HTTP de sécurité |
| express-rate-limit | ^7.5.0 | Limitation du débit de requêtes |
| morgan | ^1.10.0 | Journalisation HTTP (hors production) |
| express-async-errors | ^3.1.1 | Propagation automatique des erreurs async |

### 3.3 Backend — `devDependencies`

| Paquet | Version | Rôle |
|--------|---------|------|
| nodemon | ^3.1.9 | Rechargement automatique en développement |

### 3.4 Frontend — `dependencies`

| Paquet | Version | Rôle |
|--------|---------|------|
| react | ^18.3.1 | Bibliothèque UI |
| react-dom | ^18.3.1 | Rendu DOM de React |
| react-router-dom | ^6.28.1 | Routage côté client |
| axios | ^1.7.9 | Client HTTP (intercepteurs) |
| react-i18next | ^15.5.0 | Intégration i18n dans React |
| i18next | ^24.2.0 | Moteur d'internationalisation |
| i18next-browser-languagedetector | ^8.0.2 | Détection automatique de la langue |
| react-hot-toast | ^2.4.1 | Notifications toast |
| framer-motion | ^11.18.0 | Animations et transitions |

### 3.5 Frontend — `devDependencies`

| Paquet | Version | Rôle |
|--------|---------|------|
| vite | ^6.3.0 | Bundler / serveur de dev (HMR) |
| @vitejs/plugin-react | ^4.3.4 | Support React (Fast Refresh) pour Vite |
| tailwindcss | ^3.4.17 | Framework CSS utilitaire |
| postcss | ^8.5.2 | Transformations CSS |
| autoprefixer | ^10.4.20 | Préfixes vendeurs automatiques |
| eslint | ^9.18.0 | Analyse statique du code |
| @eslint/js | ^9.x | Configuration ESLint de base |
| eslint-plugin-react | ^7.37.4 | Règles ESLint pour React |
| eslint-plugin-react-hooks | ^5.1.0 | Règles ESLint pour les hooks |
| eslint-config-prettier | ^9.1.0 | Désactive les règles en conflit avec Prettier |
| prettier | ^3.4.2 | Formatage automatique du code |

### 3.6 Choix techniques justifiés

| Choix | Décision | Justification |
|-------|----------|---------------|
| **React 18.3** | Pas React 19 | Écosystème de bibliothèques plus stable et éprouvé en mai 2026. |
| **react-router-dom v6.28** | Pas v7 | Pas besoin du paradigme Remix (loaders/actions) ; v6 reste claire et largement documentée. |
| **Tailwind v3.4** | Pas v4 | Configuration JS classique (`tailwind.config.js`), ressources pédagogiques abondantes. |
| **bcryptjs** | Pas `bcrypt` natif | Pure JavaScript : zéro `node-gyp`, aucune compilation native, aucun échec de build. |
| **Express 4.21** | Pas Express 5 | Stabilité éprouvée, compatibilité maximale avec l'écosystème de middlewares. |
| **react-hot-toast** | Pas react-toastify | Léger, aucune feuille CSS externe à importer, parfaitement compatible Tailwind. |
| **framer-motion 11** | — | Animations fluides + `AnimatePresence` pour les transitions de routes. |
| **Vite** | Pas Create React App | HMR très rapide ; CRA est déprécié et non maintenu. |
| **Police arabe** | Cairo ou Amiri | Polices arabes lisibles via Google Fonts, déclarées dans `tailwind.config.js`. |
| **Pas de @headlessui/react** | Décision D2 | Modales, dropdowns et toggle de thème codés en JSX/Tailwind maison : aucune dépendance UI supplémentaire, contrôle total. |

---

## 4. Compatibilité des versions

L'ensemble des versions a été vérifié comme mutuellement compatible (mai 2026) :

| Couple / Trio | Compatibilité |
|---------------|---------------|
| Vite 6.3 + React 18.3 + @vitejs/plugin-react 4.3 | `plugin-react` 4.3 supporte React 18 sur Vite 6 (Fast Refresh OK). |
| i18next 24.2 + react-i18next 15.5 + languagedetector 8.0 | react-i18next 15 cible i18next ≥ 23 ; le trio est aligné. |
| Mongoose 8.13 + MongoDB 7.0 + Node.js 22 | Mongoose 8 requiert Node ≥ 16 et supporte MongoDB 7 ; Node 22 LTS est pleinement supporté. |
| Express 4.21 + helmet 8 + express-rate-limit 7.5 + morgan 1.10 | Tous compatibles Express 4 ; `express-async-errors` 3.1 patche correctement Express 4. |
| Tailwind 3.4 + PostCSS 8.5 + autoprefixer 10.4 | Pipeline PostCSS standard, entièrement compatible. |
| ESLint 9 + plugins React/Hooks + prettier 9.1 | ESLint 9 « flat config » avec `@eslint/js` 9 et plugins à jour. |

**Conclusion :** la stack s'assemble sans conflit de versions ; aucun *peer dependency warning* bloquant n'est attendu.

---

## 5. Architecture générale

L'application suit une architecture **client-serveur découplée** à trois tiers, communiquant par une **API REST JSON**.

```
┌────────────────────┐        HTTP/JSON         ┌────────────────────┐        Driver         ┌────────────────────┐
│   FRONTEND (SPA)   │  ───────────────────────▶ │   BACKEND (API)    │  ──────────────────────▶ │     MongoDB 7.0    │
│  React 18 + Vite   │  ◀─────────────────────── │  Express + Mongoose │  ◀────────────────────── │  base "racines"    │
│  Port 5173 (dev)   │     JWT Bearer token     │   Port 5000 (dev)   │     documents BSON    │                    │
└────────────────────┘                          └────────────────────┘                       └────────────────────┘
   - SPA routée v6                                  - Routes /api/*                               - Collections :
   - Context Auth/Theme                             - Middlewares (auth, validate,                  users, roots,
   - axios + intercepteurs                            errorHandler, paginate, rate-limit)            words, favorites
   - localStorage (JWT)                             - Controllers → Mongoose direct
```

### 5.1 Flux d'une requête authentifiée (JWT)

```
1. L'utilisateur se connecte      → POST /api/auth/login { email, password }
2. Le backend vérifie bcrypt      → comparePassword()
3. Le backend signe un JWT        → jwt.sign({ id, role }, JWT_SECRET, { expiresIn })
4. Le frontend stocke le token    → localStorage["token"]
5. L'intercepteur axios l'ajoute  → Authorization: Bearer <token>
6. auth.middleware.js le vérifie  → jwt.verify() → req.user = { id, role }
7. Le controller exécute l'action → ownership check si CREATE/UPDATE/DELETE
8. Réponse JSON normalisée        → { success, data } ou { success, message }
```

### 5.2 Principe de séparation des responsabilités (backend)

```
routes/        → déclarent les chemins et chaînent les middlewares
middlewares/   → auth, validation Joi, pagination, gestion d'erreurs
validators/    → schémas Joi des payloads
controllers/   → logique métier, appellent Mongoose DIRECTEMENT (pas de couche services/)
models/        → schémas Mongoose, hooks, virtuels, index
utils/         → AppError, normalisation arabe, format de réponse
```

> **Décision D8 (anti sur-ingénierie) :** il n'existe **aucun dossier `services/`**. Les controllers interrogent Mongoose directement. La normalisation du texte arabe est isolée dans `utils/arabic.js`.

---

## 6. Modèles de données

Le projet définit **5 modèles Mongoose** : `User`, `Root`, `Word`, `Favorite`, `Revision`.

### 6.1 Modèle `User`

| Champ | Type | Validations / Options | Notes |
|-------|------|-----------------------|-------|
| `name` | String | required, trim, minlength 2, maxlength 60 | Nom affiché |
| `email` | String | required, **unique**, lowercase, trim, regex e-mail | Identifiant de connexion |
| `password` | String | required, minlength 8, `select: false` | Haché bcryptjs (12 rounds) via hook `pre('save')` |
| `role` | String | enum `['user','admin']`, default `'user'` | **N'est PAS requis pour le CRUD de base** (cf. D3) |
| `avatarUrl` | String | optionnel | URL d'avatar |
| `bio` | String | maxlength 280 | Présentation libre |
| `nativeLanguage` | String | enum `['fr','en','ar']`, default `'fr'` | **Donnée de profil** — distincte de la locale d'interface (cf. D5) |
| `isActive` | Boolean | default `true` | Désactivation logique du compte |
| `createdAt` / `updatedAt` | Date | `timestamps: true` | Automatiques |

- **Méthode d'instance :** `comparePassword(plain)` → `bcrypt.compare`.
- **Transform `toJSON` :** supprime `password` et `__v` de toute sérialisation.
- **Index :** unique sur `email`.

> **Décision D5 :** `nativeLanguage` (`fr`/`en`/`ar`) décrit la langue maternelle de l'utilisateur dans son **profil**. Elle est **indépendante** de la locale d'interface i18n (qui ne propose que `fr` et `en`, cf. D4). Un utilisateur peut être de langue maternelle arabe tout en utilisant l'interface en français.

### 6.2 Modèle `Root` (racine trilitère)

| Champ | Type | Validations / Options | Notes |
|-------|------|-----------------------|-------|
| `letters` | [String] | required, validateur custom | Exactement **3** entrées, chacune **1 lettre arabe** |
| `slug` | String | required, **unique**, index | 3 lettres normalisées jointes par `-` (ex. `ك-ت-ب`) |
| `meaningFr` | String | required, maxlength 300 | Sens en français |
| `meaningEn` | String | maxlength 300 | Sens en anglais |
| `meaningAr` | String | — | Sens en arabe |
| `transliteration` | String | — | Translittération (ex. `k-t-b`) |
| `createdBy` | ObjectId | ref `User` | Auteur de la racine (ownership) |
| `createdAt` / `updatedAt` | Date | `timestamps: true` | Automatiques |

- **Hook `pre('validate')` :** génère `slug` et `transliteration` à partir des `letters` normalisées.
- **Virtuel `words` :** `ref: 'Word'`, `localField: '_id'`, `foreignField: 'root'` — liste inverse des mots dérivés.
- **Virtuel `wordsCount` :** calculé via `count` (Mongoose `count: true`) — **aucun champ stocké** (cf. D8).
- **Index :** unique sur `slug` ; index **texte** sur `meaningFr` / `meaningEn` / `transliteration`.

> **Décision D8 :** le champ `wordsCount` **n'est pas stocké**. Le décompte se fait à la demande via `Word.countDocuments({ root })` ou par un **virtuel populate avec `count: true`**, ce qui évite toute désynchronisation.

### 6.3 Modèle `Word` (mot dérivé)

| Champ | Type | Validations / Options | Notes |
|-------|------|-----------------------|-------|
| `root` | ObjectId | required, ref `Root`, **index** | **Relation populate exigée** |
| `arabic` | String | required, trim | Graphie **diacritée** (avec tashkīl) |
| `arabicNormalized` | String | index | Graphie **sans diacritiques** — pour la recherche |
| `transliteration` | String | required, trim | Translittération latine |
| `translationFr` | String | required, maxlength 300 | Traduction française |
| `translationEn` | String | maxlength 300 | Traduction anglaise |
| `type` | String | required, enum `WORD_TYPES` (7 valeurs) | Type morphologique (cf. §7) |
| `tense` | String | enum `VERB_TENSES`, **required conditionnel** | Requis **uniquement si** `type === 'VERB'` |
| `pattern` | String | required | Le schème / وَزْن |
| `example` | String | maxlength 500 | Phrase d'exemple |
| `notes` | String | maxlength 500 | Notes libres |
| `createdBy` | ObjectId | ref `User` | Auteur du mot (ownership) |
| `createdAt` / `updatedAt` | Date | `timestamps: true` | Automatiques |

- **Index composé `{ root: 1, type: 1 }` :** accélère le regroupement par type.
- **Index unique composé `{ root: 1, arabic: 1 }` :** empêche un doublon de mot pour une racine.
- **Index sur `arabicNormalized` :** accélère la recherche textuelle normalisée.

### 6.4 Modèle `Favorite` (modèle simplifié — D8)

| Champ | Type | Validations / Options | Notes |
|-------|------|-----------------------|-------|
| `user` | ObjectId | required, ref `User`, index | Propriétaire du favori |
| `item` | ObjectId | required | Référence vers la racine ou le mot |
| `itemModel` | String | required, enum `['Root','Word']` | Cible du `refPath` |
| `note` | String | maxlength 280 | Annotation personnelle |
| `createdAt` / `updatedAt` | Date | `timestamps: true` | Automatiques |

- **Index composé unique `{ user: 1, item: 1, itemModel: 1 }` :** un même élément ne peut être mis en favori qu'une fois par utilisateur.
- **Populate dynamique :** `item` utilise `refPath: 'itemModel'` — Mongoose résout vers `Root` ou `Word` selon la valeur.

> **Décision D8 :** modèle **volontairement simple** — pas de polymorphisme à index partiels, pas de schémas séparés par cible. Un seul champ `item` + un discriminant `itemModel` suffisent.

### 6.5 Modèle `Revision` (mémorisation d'une racine)

| Champ | Type | Validations / Options | Notes |
|-------|------|-----------------------|-------|
| `user` | ObjectId | required, ref `User`, index | Propriétaire de la révision |
| `root` | ObjectId | required, ref `Root` | Racine à réviser |
| `lastReviewedAt` | Date | default `null` | Mis à jour à la fin de chaque session |
| `reviewCount` | Number | default 0, min 0 | Nombre cumulé de passages |
| `lastRating` | String | enum `['miss','hard','medium','easy']`, default `null` | Dernier rating attribué |
| `ratings.miss` / `.hard` / `.medium` / `.easy` | Number | default 0, min 0 | Compteurs cumulés par catégorie |
| `createdAt` / `updatedAt` | Date | `timestamps: true` | Automatiques |

- **Index composé unique `{ user: 1, root: 1 }` :** une racine donnée n'apparaît qu'une fois dans la liste de révision d'un utilisateur.
- **Auto-nettoyage des stats :** quand l'utilisateur retire une racine de sa liste de révision, le document `Revision` est supprimé — les compteurs `ratings.*` disparaissent avec lui et le **score global est recalculé automatiquement** à la prochaine requête `/api/revisions/stats`.

**Calcul du score (pondération uniforme backend/frontend) :**

| Rating | Poids |
|--------|-------|
| `miss` | 0 |
| `hard` | 1 |
| `medium` | 2 |
| `easy` | 3 |

Score = `(Σ poids × occurrences) / (Σ occurrences × 3) × 100`, arrondi. Retourné `null` si aucun rating n'a encore été enregistré.

> **Décision D11 :** la révision est intentionnellement **sans SRS complexe** (pas d'algorithme SM-2/Anki). Les 4 compteurs `ratings.*` + un `lastRating` suffisent à dériver le score et la répartition par catégorie. Aucun champ stocké n'est dupliqué côté `User` — toutes les agrégations sont calculées à la demande dans `getStats` (cf. §8.1 et D8).

### 6.6 Schéma relationnel

```
                  ┌─────────┐
                  │  User   │
                  └────┬────┘
                       │ createdBy / user
   ┌──────────┬────────┼──────────────────┬──────────┐
   │          │        │                  │          │
   ▼          ▼        ▼                  ▼          ▼
┌──────┐  ┌──────┐  ┌──────────┐    ┌──────────┐  (admin can manage all)
│ Root │  │ Word │  │ Favorite │    │ Revision │
└──┬───┘  └──┬───┘  └────┬─────┘    └────┬─────┘
   │         │           │               │
   │         │ root      │ item          │ root
   │         ▼           │ (refPath)     ▼
   │     (ref Root)      ▼          (ref Root)
   │                (Root | Word)
   │
   ▼ words (virtuel inverse)
```

### 6.7 Relations populate

| Relation | Source → Cible | Mécanisme |
|----------|----------------|-----------|
| `Word.root` | Word → Root | `ref: 'Root'` — **populate exigée** |
| `Root.words` | Root → Word[] | Virtuel inverse (`localField`/`foreignField`) |
| `Root.wordsCount` | Root → nombre | Virtuel `count` (D8, non stocké) |
| `Favorite.item` | Favorite → Root \| Word | **`refPath: 'itemModel'`** (populate dynamique) |
| `Revision.root` | Revision → Root | `ref: 'Root'` — populate dans `listRevisions` / `getSession` / `getStats` |
| `Root.createdBy` / `Word.createdBy` / `Favorite.user` / `Revision.user` | → User | `ref: 'User'` |

---

## 7. Morphologie arabe : les 7 types dérivés

> **Décision D7 :** l'enum morphologique est **réduit à 7 types**. `NOUN_TIME` et `ADJ_ASSIM` ont été retirés (ambigus / trop rares). L'enum reste **extensible** : ajouter une valeur à `WORD_TYPES` suffit, sans migration de schéma.

### 7.1 Tableau des 7 types — `WORD_TYPES`

Tous les exemples utilisent la racine **ك-ت-ب** (idée d'« écriture »). Le schème est noté avec les lettres-témoins ف-ع-ل.

| Code enum | Nom français | Nom arabe | Translittération | Schème (وَزْن) | Définition | Exemple ك-ت-ب |
|-----------|--------------|-----------|------------------|----------------|------------|----------------|
| `VERB` | Verbe | الفِعْل | al-fiʿl | فَعَلَ / يَفْعُلُ / اُفْعُلْ | Action ; regroupe les 3 conjugaisons via le champ `tense` | كَتَبَ (a écrit) / يَكْتُبُ (écrit) / اُكْتُبْ (écris !) |
| `MASDAR` | Nom d'action (masdar) | المَصْدَر | al-maṣdar | variable | Nom abstrait de l'action | كِتَابَة (l'écriture) |
| `ACTIVE_PART` | Nom d'agent (participe actif) | اسم الفَاعِل | ism al-fāʿil | فَاعِل | « Celui qui fait » l'action | كَاتِب (écrivain) |
| `PASSIVE_PART` | Nom de patient (participe passif) | اسم المَفْعُول | ism al-mafʿūl | مَفْعُول | « Ce qui subit » l'action | مَكْتُوب (écrit, lettre) |
| `NOUN_PLACE` | Nom de lieu | اسم المَكَان | ism al-makān | مَفْعَل / مَفْعِل | Lieu où se déroule l'action | مَكْتَب (bureau), مَكْتَبَة (bibliothèque) |
| `NOUN_TOOL` | Nom d'instrument | اسم الآلَة | ism al-ʾāla | مِفْعَال / مِفْعَل / مِفْعَلَة | Outil servant à accomplir l'action | (ex. مِكْتَاب) |
| `ELATIVE` | Élatif (comparatif/superlatif) | اسم التَّفْضِيل | ism at-tafḍīl | أَفْعَل | Comparatif ou superlatif | (ex. أَكْتَب) |

### 7.2 Le champ `tense` (temps verbal)

Le champ `tense` n'est pertinent **que pour les verbes**. Il est défini par l'enum :

```js
const VERB_TENSES = ['MADI', 'MUDARI', 'AMR'];
```

| Code | Nom arabe | Translittération | Sens | Exemple ك-ت-ب |
|------|-----------|------------------|------|----------------|
| `MADI` | المَاضِي | al-māḍī | Accompli (passé) | كَتَبَ |
| `MUDARI` | المُضَارِع | al-muḍāriʿ | Inaccompli (présent/futur) | يَكْتُبُ |
| `AMR` | الأَمْر | al-ʾamr | Impératif | اُكْتُبْ |

> **Validation conditionnelle :** dans le schéma `Word`, `tense` est `required` **uniquement si** `type === 'VERB'`. La même règle est dupliquée dans le validateur Joi (`Joi.when('type', ...)`).

### 7.3 Normalisation des lettres arabes — `utils/arabic.js`

La recherche et l'unicité des racines reposent sur une **normalisation** rigoureuse :

| Opération | Détail |
|-----------|--------|
| Suppression des diacritiques | Retrait du **tashkīl** (fatḥa, ḍamma, kasra, sukūn, shadda, tanwīn) |
| Suppression du tatweel | Retrait du caractère d'allongement `ـ` (U+0640) |
| Normalisation des hamzas/alifs | `أ`, `إ`, `آ`, `ٱ` → `ا` ; `ى` → `ي` |
| Nettoyage | `trim()` des espaces |

**Génération du slug :** le `slug` d'une racine est la **jonction par `-` des 3 lettres normalisées** (ex. `ك-ت-ب`). Cet identifiant porte l'**index unique** de `Root`, garantissant qu'une combinaison de 3 lettres ne peut exister qu'une seule fois.

```js
// backend/src/utils/arabic.js (extrait conceptuel)
const TASHKIL = /[ؐ-ًؚ-ٰٟۖ-ۭ]/g;
const TATWEEL = /ـ/g;

export const normalizeArabic = (input = '') =>
  input
    .replace(TASHKIL, '')
    .replace(TATWEEL, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .trim();

export const buildSlug = (letters) =>
  letters.map(normalizeArabic).join('-');
```

---

## 8. API REST

Toutes les routes sont préfixées par **`/api`**. Les réponses sont en **JSON**.

### 8.1 Tableau complet des endpoints

#### Authentification

| Méthode | Chemin | Accès | Description |
|---------|--------|-------|-------------|
| POST | `/api/auth/register` | Public | Inscription (création de compte, hachage bcrypt) |
| POST | `/api/auth/login` | Public | Connexion — retourne un **JWT** |
| GET | `/api/auth/me` | Protégé | Profil de l'utilisateur courant |

#### Utilisateurs

| Méthode | Chemin | Accès | Description |
|---------|--------|-------|-------------|
| PATCH | `/api/users/me` | Protégé | Mise à jour du profil (name, bio, avatarUrl, nativeLanguage) |
| PATCH | `/api/users/me/password` | Protégé | Changement de mot de passe |
| DELETE | `/api/users/me` | Protégé | Suppression / désactivation du compte |
| GET | `/api/users` | Protégé (admin) | Liste paginée des utilisateurs (console admin) |
| GET | `/api/users/:id` | Protégé (admin) | Détail d'un utilisateur |
| PATCH | `/api/users/:id` | Protégé (admin) | Mise à jour d'un utilisateur (rôle, activation, profil) |
| DELETE | `/api/users/:id` | Protégé (admin) | Suppression d'un utilisateur |

#### Racines (`Root`)

| Méthode | Chemin | Accès | Description |
|---------|--------|-------|-------------|
| GET | `/api/roots` | **Public** | Liste paginée + recherche |
| GET | `/api/roots/suggestions` | **Public** | **Suggestion de lettres** pour compléter une racine existante (cf. D11) — `?l0=ك&l1=ت&l2=ب` (toutes optionnelles) |
| GET | `/api/roots/:slug` | **Public** | Détail d'une racine + `populate` des mots |
| GET | `/api/roots/:slug/words` | **Public** | Mots d'une racine, optionnellement groupés par type |
| POST | `/api/roots` | Protégé (JWT) | Création d'une racine |
| PUT | `/api/roots/:slug` | Protégé + **ownership** | Modification |
| DELETE | `/api/roots/:slug` | Protégé + **ownership** | Suppression (cascade : mots + favoris liés) |

> **Format de `/api/roots/suggestions` :** retourne `{ suggestions: { 0?: [...], 1?: [...], 2?: [...] } }`. Pour chaque slot encore vide, la liste des lettres présentes à cette position dans les racines compatibles avec la sélection partielle. Si les 3 slots sont remplis, l'objet `suggestions` est vide. Route placée **avant** `/:slug` dans le routeur pour ne pas être interceptée.

#### Mots (`Word`)

| Méthode | Chemin | Accès | Description |
|---------|--------|-------|-------------|
| GET | `/api/words` | **Public** | **Recherche avancée multi-filtres** + pagination |
| GET | `/api/words/:id` | **Public** | Détail d'un mot |
| POST | `/api/words` | Protégé (JWT) | Création d'un mot |
| PUT | `/api/words/:id` | Protégé + **ownership** | Modification |
| DELETE | `/api/words/:id` | Protégé + **ownership** | Suppression |

#### Favoris (`Favorite`)

| Méthode | Chemin | Accès | Description |
|---------|--------|-------|-------------|
| GET | `/api/favorites` | Protégé | Favoris de l'utilisateur (paginés) |
| POST | `/api/favorites` | Protégé | Ajout d'un favori (racine ou mot) |
| DELETE | `/api/favorites/:id` | Protégé | Retrait d'un favori |

#### Révisions (`Revision`)

| Méthode | Chemin | Accès | Description |
|---------|--------|-------|-------------|
| GET | `/api/revisions` | Protégé | Liste paginée des racines enregistrées pour révision |
| GET | `/api/revisions/session` | Protégé | Cartes prêtes à présenter (mélangées Fisher-Yates) |
| GET | `/api/revisions/stats` | Protégé | Stats agrégées : totaux par catégorie, score global /100, score par racine |
| POST | `/api/revisions` | Protégé | Ajout d'une racine à la liste (corps : `{ root: ObjectId }`) |
| POST | `/api/revisions/session/complete` | Protégé | Clôt une session — corps : `{ items: [{ id, rating }] }` (rating ∈ `miss`/`hard`/`medium`/`easy`), incrémente `ratings.<rating>` et `reviewCount`, met à jour `lastReviewedAt` et `lastRating` |
| DELETE | `/api/revisions/:id` | Protégé | Retire la racine de la liste — supprime aussi ses ratings (auto-cleanup des stats) |

#### Système

| Méthode | Chemin | Accès | Description |
|---------|--------|-------|-------------|
| GET | `/api/health` | Public | Sonde de santé `{ status: 'ok', uptime, timestamp }` |
| ALL | `/api/*` (catch-all) | Public | **404 JSON** pour toute route API inconnue |

> **Décision D3 (conformité majeure) :** la lecture de `Root` et `Word` est **publique** ; les opérations **CREATE / UPDATE / DELETE** sont accessibles à **tout utilisateur authentifié** — la route est protégée par un **JWT simple**, **pas réservée à un admin**. Le champ `createdBy` est conservé et un **contrôle d'ownership** s'applique : un utilisateur ne peut éditer/supprimer que ses propres entrées, tandis qu'un `admin` peut tout modifier. Le rôle `role` existe sur `User` mais **n'est pas requis** pour le CRUD de base. On obtient donc **4 ressources CRUD complètes** : `Root`, `Word`, `Favorite` et `Revision` (les deux dernières scopées à l'utilisateur). Une **console admin** (`/admin/users`) ajoute la gestion des utilisateurs (`GET /api/users`, `PATCH /:id`, `DELETE /:id`) — réservée au rôle `admin`.

### 8.2 Spécification de la pagination

Toute liste (`/api/roots`, `/api/words`, `/api/favorites`) accepte :

| Paramètre | Type | Défaut | Rôle |
|-----------|------|--------|------|
| `page` | entier ≥ 1 | `1` | Numéro de page |
| `limit` | entier 1–100 | `10` | Éléments par page |

La pagination est appliquée par le middleware `paginate.middleware.js`. **Format de réponse paginée :**

```json
{
  "success": true,
  "data": [ /* ... éléments ... */ ],
  "total": 42,
  "page": 2,
  "totalPages": 5
}
```

### 8.3 Recherche avancée multi-filtres (ressource `Word`)

> **Décision D6 :** l'endpoint `GET /api/words` accepte des filtres **combinables**.

| Paramètre | Type | Effet |
|-----------|------|-------|
| `letters` / `root` | String | Restreint aux mots d'une racine (les 3 lettres, normalisées en slug) |
| `type` | enum `WORD_TYPES` | Filtre par type morphologique |
| `tense` | enum `VERB_TENSES` | Filtre par temps (pertinent si `type=VERB`) |
| `q` | String | Recherche texte sur `arabicNormalized` + `transliteration` + `translationFr` + `translationEn` |
| `sortBy` | `alpha` \| `type` \| `date` | Tri (alphabétique / par type / par date) |
| `page`, `limit` | entiers | Pagination (cf. §8.2) |

Exemple : `GET /api/words?root=ك-ت-ب&type=VERB&tense=MADI&sortBy=alpha&page=1&limit=10`.

Côté frontend, un **panneau de filtres** pilote ces paramètres, et le hook **`useDebounce`** temporise la saisie du champ `q` pour éviter les requêtes excessives.

### 8.4 Format des réponses

| Cas | Forme |
|-----|-------|
| Succès simple | `{ "success": true, "data": { ... } }` |
| Succès liste paginée | `{ "success": true, "data": [...], "total", "page", "totalPages" }` |
| Erreur | `{ "success": false, "message": "...", "errors"?: [...] }` |

Le format est uniformisé par `utils/apiResponse.js`.

### 8.5 Gestion d'erreurs & codes de statut

> **Décision D8 :** la gestion d'erreurs repose sur **`express-async-errors`** + **un seul middleware d'erreur global** (`errorHandler.js`) + la classe **`AppError`**. **`catchAsync` est supprimé** : `express-async-errors` propage automatiquement les rejets de promesses vers le middleware d'erreur.

| Code | Signification | Exemple |
|------|---------------|---------|
| `200` | OK | Lecture / mise à jour réussie |
| `201` | Created | Création de racine / mot / favori / compte |
| `204` | No Content | Suppression réussie |
| `400` | Bad Request | Échec de validation Joi |
| `401` | Unauthorized | JWT absent / invalide / expiré |
| `403` | Forbidden | Échec de l'ownership check |
| `404` | Not Found | Ressource ou route API inexistante |
| `409` | Conflict | Slug de racine ou e-mail déjà existant |
| `429` | Too Many Requests | Limite `express-rate-limit` atteinte |
| `500` | Internal Server Error | Erreur non prévue |

```js
// backend/src/utils/AppError.js
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

---

## 9. Authentification & sécurité

### 9.1 Flux d'inscription (`register`)

1. Le payload `{ name, email, password }` est validé par `auth.validator.js` (Joi).
2. Le controller crée le document `User` ; le hook `pre('save')` **hache le mot de passe** avec bcryptjs (**12 salt rounds**).
3. Un **JWT** est signé et renvoyé avec l'utilisateur (sans le mot de passe, retiré par `select:false` + transform `toJSON`).

### 9.2 Flux de connexion (`login`)

1. Le payload `{ email, password }` est validé par Joi.
2. Le controller récupère l'utilisateur **avec** le mot de passe (`.select('+password')`).
3. `user.comparePassword()` vérifie via `bcrypt.compare`.
4. En cas de succès : `jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })`.

### 9.3 Middleware d'authentification — `auth.middleware.js`

```
1. Lit l'en-tête  Authorization: Bearer <token>
2. jwt.verify(token, JWT_SECRET)
3. En cas de succès → req.user = { id, role }
4. En cas d'échec   → throw new AppError('Non autorisé', 401)
```

### 9.4 Contrôle d'ownership

Pour `PUT`/`DELETE` sur `Root` et `Word` :

```
si  req.user.role === 'admin'                → autorisé
sinon si  ressource.createdBy === req.user.id → autorisé
sinon                                         → AppError(403)
```

Pour `Favorite`, toute opération est **scopée au `user`** : un utilisateur ne voit et ne supprime que ses propres favoris.

### 9.5 Couches de sécurité

| Mesure | Outil | Détail |
|--------|-------|--------|
| En-têtes HTTP sécurisés | `helmet` | CSP, anti-clickjacking, etc. |
| Limitation de débit | `express-rate-limit` | Plafond de requêtes par IP (durci sur `/api/auth`) |
| CORS whitelist | `cors` | Origine autorisée = `CLIENT_URL` du `.env` (cf. D9) |
| Validation serveur | `joi` | Tous les payloads validés par des schémas dédiés |
| Hachage des mots de passe | `bcryptjs` | 12 salt rounds, jamais stockés en clair |
| Mot de passe non exposé | Mongoose | `select:false` + transform `toJSON` |
| Vérification de type de champ | Mongoose + Joi | Types stricts (String, Number, ObjectId, enum…) |

### 9.6 Stockage du JWT — `localStorage` (Décision D10)

> **Décision D10 :** le JWT est stocké dans **`localStorage`**, choix **autorisé par le cahier des charges** et plus simple à mettre en œuvre.

- L'**intercepteur axios** (`services/api.js`) ajoute automatiquement `Authorization: Bearer <token>` à chaque requête.
- **`PrivateRoute`** protège les routes `/profile` et `/favorites` : absence de token → redirection vers `/login`.
- Le **logout** efface `localStorage["token"]` et réinitialise `AuthContext`.
- Sur réponse `401`, l'intercepteur déconnecte l'utilisateur et le redirige.

**Compromis de sécurité documenté :** les cookies `httpOnly` sont **intrinsèquement plus sûrs** car inaccessibles au JavaScript (mitigent le vol de token par XSS). Ils imposent toutefois la gestion du **CSRF** et la configuration **CORS avec `credentials`**, ce qui ajoute une complexité **non justifiée** dans le cadre de ce projet académique. Le choix `localStorage` est donc assumé, avec `helmet` comme protection XSS de premier rideau.

---

## 10. Frontend

### 10.1 Structure & technologies

SPA **React 18** servie par **Vite 6**. Routage **react-router-dom v6**, état global via **Context API**, requêtes via **axios**, styles **Tailwind v3**.

### 10.2 Routes React Router (15 routes)

| Chemin | Page | Accès |
|--------|------|-------|
| `/` | `Home` | Public — landing / présentation immersive |
| `/explorer` | `RootExplorer` | Public — sélection des 3 lettres + **suggestions rouges** + résultat |
| `/search` | `Search` | Public — recherche avancée multi-filtres sur les mots |
| `/roots/:slug` | `RootDetail` | Public — détail racine + mots dérivés groupés |
| `/words/:id` | `WordDetail` | Public — détail d'un mot et sa racine d'origine |
| `/about` | `About` | Public — manifeste & morphologie |
| `/login` | `Login` | Public — redirige si déjà authentifié |
| `/register` | `Register` | Public — redirige si déjà authentifié |
| `/profile` | `Profile` | **Protégé** (`PrivateRoute`) |
| `/favorites` | `Favorites` | **Protégé** — racines et mots favoris |
| `/revisions` | `Revisions` | **Protégé** — liste à réviser + bloc stats |
| `/revisions/session` | `RevisionSession` | **Protégé** — chrono + cartes recto/verso + ratings |
| `/admin/users` | `AdminUsers` | **Admin** (`AdminRoute`) |
| `/admin/users/:id` | `AdminUserDetail` | **Admin** |
| `*` | `NotFound` | Public — page 404 |

> `Home` et `RootExplorer` sont **bien distinctes** : `Home` est une page de présentation/landing ; `RootExplorer` est **l'outil interactif** de sélection des lettres (`LetterPicker`) affichant les résultats.

### 10.3 Composants réutilisables

**UI (`components/ui/`)** — tous codés en JSX/Tailwind maison (cf. D2) :

| Composant | Rôle |
|-----------|------|
| `Button` | Bouton stylé (variants `primary`/`secondary`/`ghost`/`danger`, états loading/disabled) |
| `Input` | Champ de formulaire avec libellé et message d'erreur |
| `Spinner` | Indicateur de chargement (tailles `sm`/`md`/`lg`) |
| `Badge` | Pastille (type morphologique, temps verbal, statut) |
| `Modal` | Fenêtre modale **maison** (overlay + focus-trap + Esc) |
| `Pagination` | Contrôles de navigation entre pages |
| `ActionButtons` | Triplet `ViewButton`/`EditButton`/`DeleteButton` pour les lignes de tableau |
| `EmptyState` | État vide stylé (eyebrow + titre + action) |
| `BackLink` | Lien de retour contextuel |
| `AlphabetRail` | Marges décoratives — défilement vertical de l'alphabet |
| `FloatingLetters` / `FloatingOrbs` / `Hourglass` / `Ornament` / `PersianArch` | Éléments décoratifs du hero `Home` |

**Layout (`components/layout/`)** : `Navbar`, `Footer`, `PageWrapper`.

**Métier :**
- `root/` : `LetterPicker` (avec **suggestions colorées** des lettres compatibles), `RootCard`, `RootForm`, `WordList`, `WordTable`.
- `word/` : `WordCard`, `WordForm`.
- `favorites/` : `FavoriteButton` (cœur rouge plein quand favori).
- `revisions/` : `RevisionButton` (carte d'étude turquoise quand enregistrée), `RevisionStats` (bloc score global + répartition).
- `user/` : `UserForm` (utilisé dans `Profile` et la console admin).

### 10.4 Contextes (Context API)

| Contexte | Rôle |
|----------|------|
| `AuthContext` | Utilisateur courant, token, `login()`, `logout()`, `register()` |
| `ThemeContext` | Thème clair/sombre, `toggleTheme()`, persistance `localStorage` |

### 10.5 Hooks personnalisés

| Hook | Rôle |
|------|------|
| `useAuth` | Accès au `AuthContext` (user, token, login, logout, register) |
| `useTheme` | Accès au `ThemeContext` (isDark, toggleTheme) |
| `useFetch` | Requête de données générique (états `data`, `loading`, `error`, `refetch`) |
| `useDebounce` | Temporisation de la saisie (recherche avancée, cf. D6) |

### 10.5b Gardes de routes

| Garde | Rôle |
|-------|------|
| `PrivateRoute` | Bloque l'accès si non authentifié → redirection vers `/login` |
| `AdminRoute` | Bloque l'accès si l'utilisateur n'est pas `admin` → redirection vers `/` |

### 10.6 Thème sombre / clair global

- `tailwind.config.js` configuré en `darkMode: 'class'`.
- `ThemeContext` ajoute/retire la classe `dark` sur `<html>` → **application globale** instantanée à toute l'UI.
- Préférence persistée dans `localStorage` ; toggle accessible depuis la `Navbar` (composant maison).

### 10.7 Internationalisation (i18n)

> **Décision D4 :** locales d'interface = **`fr` et `en` uniquement** (interface en **LTR**, pas de RTL d'interface).

- `react-i18next` + `i18next` + `i18next-browser-languagedetector`.
- Fichiers : `locales/fr/translation.json`, `locales/en/translation.json`.
- Le **contenu arabe** (mots, racines, schèmes, translittération) reste **affiché en arabe nativement** dans les deux locales — c'est de la donnée, pas de l'interface.

### 10.8 Retours visuels, animations, responsive

| Aspect | Mise en œuvre |
|--------|---------------|
| Toasts | `react-hot-toast` — succès / erreur sur chaque action |
| Animations | `framer-motion` — `AnimatePresence` pour les transitions de routes et l'apparition des cartes |
| Responsive | Classes Tailwind (`sm:`, `md:`, `lg:`) — mobile-first |
| États de chargement | `Spinner` + squelettes ; piloté par `useFetch` |
| Erreurs affichées | Messages d'erreur de formulaire (`Input`) + toasts |
| Confirmation de suppression | `Modal` de confirmation avant tout `DELETE` |

---

## 11. Arborescence complète

> **Décision D1 :** monorepo **`racines-arabes/`** contenant `backend/` + `frontend/` + `README.md`. On utilise **`backend/`** et **`frontend/`** partout — **jamais** `server/` ni `client/`.

### 11.1 Racine du monorepo

```
racines-arabes/
├── backend/          # API Express + Mongoose
├── frontend/         # SPA React + Vite
└── README.md         # Documentation d'ensemble
```

### 11.2 Backend

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                       # Connexion Mongoose à MongoDB
│   │   └── env.js                      # Chargement/validation des variables .env
│   ├── models/
│   │   ├── User.js                     # Schéma User (+ hook bcrypt, comparePassword)
│   │   ├── Root.js                     # Schéma Root (+ slug, virtuels words/wordsCount)
│   │   ├── Word.js                     # Schéma Word (+ index composés)
│   │   ├── Favorite.js                 # Schéma Favorite (refPath itemModel)
│   │   └── Revision.js                 # Schéma Revision (ratings + lastReviewedAt)
│   ├── controllers/
│   │   ├── auth.controller.js          # register / login / me
│   │   ├── user.controller.js          # profil, mot de passe + console admin
│   │   ├── root.controller.js          # CRUD racines + getLetterSuggestions (D11)
│   │   ├── word.controller.js          # CRUD mots + recherche avancée
│   │   ├── favorite.controller.js      # CRUD favoris scopés user
│   │   └── revision.controller.js      # CRUD révisions + completeSession + getStats (D11)
│   ├── routes/
│   │   ├── index.js                    # Agrégateur + health + 404 catch-all
│   │   ├── auth.routes.js
│   │   ├── user.routes.js              # /me + endpoints admin (rôle vérifié dans controller)
│   │   ├── root.routes.js              # /suggestions déclarée AVANT /:slug
│   │   ├── word.routes.js
│   │   ├── favorite.routes.js
│   │   └── revision.routes.js          # /session + /session/complete + /stats
│   ├── middlewares/
│   │   ├── auth.middleware.js          # Vérification JWT (protect)
│   │   ├── errorHandler.js             # Middleware d'erreur global UNIQUE + notFound
│   │   ├── validate.middleware.js      # Application des schémas Joi
│   │   └── paginate.middleware.js      # Pagination ?page=&limit=
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js           # updateProfile, adminUpdateUser, changePassword
│   │   ├── root.validator.js
│   │   ├── word.validator.js           # tense conditionnel
│   │   ├── favorite.validator.js
│   │   └── revision.validator.js       # createRevision + completeSession ratings
│   ├── utils/
│   │   ├── AppError.js                 # Classe d'erreur opérationnelle
│   │   ├── arabic.js                   # Normalisation arabe + génération slug
│   │   ├── apiResponse.js              # Format de réponse uniforme
│   │   └── constants.js                # WORD_TYPES, VERB_TENSES, USER_ROLES, …
│   ├── seeds/
│   │   ├── seed.js                     # Script exécuté par npm run seed
│   │   ├── seedAdmin.js                # Script idempotent — promeut/crée l'admin
│   │   ├── roots.data.js               # 102 racines avec vowelMadi/vowelMudari
│   │   ├── words.data.js               # 36 mots curatés (6 racines originales)
│   │   └── wordsGenerator.js           # Génère 9 dérivés par racine (864 mots) — cf. §14
│   ├── app.js                          # Instanciation Express + middlewares globaux
│   └── server.js                       # Démarrage serveur + connexion DB
├── Dockerfile
├── .env                                # Variables (non versionné)
├── .env.example                        # Modèle de variables
└── package.json
```

> Aucun dossier `services/` (D8). Pas de `catchAsync` (D8).

### 11.3 Frontend

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx                    # Point d'entrée React
│   ├── App.jsx                     # Déclaration des 15 routes + providers
│   ├── i18n.js                     # Configuration i18next (fr/en)
│   ├── routes/
│   │   ├── PrivateRoute.jsx        # Garde des routes authentifiées
│   │   └── AdminRoute.jsx          # Garde des routes admin
│   ├── context/
│   │   ├── AuthContext.jsx         # État d'authentification global
│   │   └── ThemeContext.jsx        # Thème clair/sombre global
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useFetch.js
│   │   ├── useDebounce.js
│   │   └── useTheme.js
│   ├── services/
│   │   ├── api.js                  # Instance axios + intercepteurs JWT
│   │   ├── auth.service.js
│   │   ├── user.service.js         # /me + console admin
│   │   ├── root.service.js         # CRUD + getLetterSuggestions
│   │   ├── word.service.js
│   │   ├── favorite.service.js
│   │   └── revision.service.js     # CRUD + getRevisionStats + completeSession
│   ├── pages/                       # 13 pages (cf. §10.2)
│   │   ├── Home.jsx
│   │   ├── RootExplorer.jsx
│   │   ├── Search.jsx
│   │   ├── RootDetail.jsx
│   │   ├── WordDetail.jsx
│   │   ├── About.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── Favorites.jsx
│   │   ├── Revisions.jsx
│   │   ├── RevisionSession.jsx
│   │   ├── AdminUsers.jsx
│   │   ├── AdminUserDetail.jsx
│   │   └── NotFound.jsx
│   ├── components/
│   │   ├── ui/                     # Button, Input, Spinner, Badge, Modal, Pagination,
│   │   │                           # ActionButtons, EmptyState, BackLink, AlphabetRail,
│   │   │                           # FloatingLetters, FloatingOrbs, Hourglass, Ornament,
│   │   │                           # PersianArch
│   │   ├── layout/                 # Navbar, Footer, PageWrapper
│   │   ├── root/                   # LetterPicker (avec suggestions), RootCard, RootForm,
│   │   │                           # WordList, WordTable
│   │   ├── word/                   # WordCard, WordForm
│   │   ├── favorites/              # FavoriteButton (cœur)
│   │   ├── revisions/              # RevisionButton (carte), RevisionStats
│   │   └── user/                   # UserForm
│   ├── utils/
│   │   ├── morphology.js           # Libellés/ordre des 7 types
│   │   └── formatters.js
│   ├── locales/
│   │   ├── fr/translation.json
│   │   └── en/translation.json
│   ├── styles/
│   │   └── index.css               # Directives Tailwind + base
│   └── assets/
│       └── arabic-alphabet.json    # 28 lettres pour LetterPicker
├── Dockerfile
├── index.html
├── vite.config.js                  # Alias @/ + proxy /api
├── tailwind.config.js              # darkMode 'class', palette turquoise/sable, no-radius
├── postcss.config.js
├── .env                            # (non versionné)
├── .env.example
└── package.json
```

---

## 12. Variables d'environnement

### 12.1 Backend — `.env`

> **Décision D9 :** clés requises = `PORT`, `NODE_ENV`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`.

```dotenv
# backend/.env.example
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/racines-arabes
JWT_SECRET=remplacer_par_un_secret_long_et_aleatoire
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

| Clé | Rôle |
|-----|------|
| `PORT` | Port d'écoute de l'API |
| `NODE_ENV` | `development` / `production` — conditionne `morgan` |
| `MONGO_URI` | URI de connexion MongoDB |
| `JWT_SECRET` | Secret de signature des JWT |
| `JWT_EXPIRES_IN` | Durée de validité du JWT (ex. `7d`) |
| `CLIENT_URL` | Origine autorisée par la **whitelist CORS** |

### 12.2 Frontend — `.env`

```dotenv
# frontend/.env.example
VITE_API_URL=http://localhost:5000/api
```

| Clé | Rôle |
|-----|------|
| `VITE_API_URL` | URL de base de l'API consommée par axios |

> `morgan` n'est activé que si `NODE_ENV !== 'production'` (cf. D9).

---

## 13. Scripts npm

### 13.1 Backend — `package.json`

> **Décision D9 :** scripts `dev`, `start`, `seed`, `lint`, `format`.

```json
{
  "scripts": {
    "dev":        "nodemon src/server.js",
    "start":      "node src/server.js",
    "seed":       "node src/seeds/seed.js",
    "seed:admin": "node src/seeds/seedAdmin.js",
    "lint":       "eslint src",
    "format":     "prettier --write \"src/**/*.js\""
  }
}
```

> `seed:admin` est idempotent : il crée le compte `admin@racines.app / admin1234`, ou s'il existe déjà, **réinitialise le mot de passe et promeut au rôle admin**.

### 13.2 Frontend — `package.json`

> **Décision D9 :** scripts `dev`, `build`, `preview`, `lint`.

```json
{
  "scripts": {
    "dev":     "vite",
    "build":   "vite build",
    "preview": "vite preview",
    "lint":    "eslint src"
  }
}
```

---

## 14. Données de seed

Le script **`npm run seed`** (`backend/src/seeds/seed.js`) vide puis repeuple la base avec un jeu de données **volumineux et morphologiquement cohérent** :

| Élément | Quantité | Détail |
|---------|----------|--------|
| Racines | **102** | 6 racines originales curatées + 96 racines courantes ajoutées (verbes du quotidien, religion, commerce, mouvement, perception, valeurs) |
| Mots dérivés | **900** | 36 mots curatés à la main + 864 mots générés mécaniquement (9 par racine ajoutée) |
| Utilisateur de démo | 1 | `demo@racines.app / demo1234` |

Le jeu couvre obligatoirement `VERB` (avec les 3 `tense` : `MADI`, `MUDARI`, `AMR`), `MASDAR`, `ACTIVE_PART`, `PASSIVE_PART`, `NOUN_PLACE`, `NOUN_TOOL` et `ELATIVE`. Le slug et la translittération sont (re)générés par les hooks Mongoose à l'insertion.

### 14.1 Architecture du seed

Le seed combine deux sources :

1. **`words.data.js`** — 36 mots **curatés manuellement** pour les 6 racines historiques (ك-ت-ب, د-ر-س, ع-ل-م, ك-س-ر, ف-ت-ح, ج-م-ل). Qualité lexicale vérifiée, traductions précises.
2. **`wordsGenerator.js`** — pour chaque autre racine, génère **9 dérivés** en appliquant les schèmes classiques de la morphologie arabe :
   - **VERB·MADI** فَعَلَ / فَعِلَ / فَعُلَ — selon `vowelMadi` de la racine
   - **VERB·MUDARI** يَفْعُلُ / يَفْعِلُ / يَفْعَلُ — selon `vowelMudari`
   - **VERB·AMR** اُفْعُلْ / اِفْعِلْ / اِفْعَلْ — préfixe vocalique aligné sur `vowelMudari`
   - **MASDAR** فَعْل — masdar simple
   - **ACTIVE_PART** فَاعِل
   - **PASSIVE_PART** مَفْعُول
   - **NOUN_PLACE** مَفْعَل / مَفْعِل — selon `vowelMudari`
   - **NOUN_TOOL** مِفْعَل
   - **ELATIVE** أَفْعَل

Chaque racine porte deux métadonnées `vowelMadi` et `vowelMudari` (∈ `a` / `i` / `u`) qui guident le générateur. Une translittération scientifique correspondante est produite mécaniquement.

> **Compromis assumé.** Le générateur traite les racines **régulières** sans gérer finement les irrégularités (verbes creux و/ي, défectueux, hamzés ء). Les formes produites restent **plausibles** sur la grande majorité des cas — suffisant pour peupler une base de démo et exercer le mécanisme morphologique. Les 6 racines historiques restent intactes pour démontrer la qualité maximale.

### 14.2 Idempotence

- `seed.js` vide systématiquement `users`, `roots`, `words`, `favorites`, `revisions` avant d'insérer — la base est dans un état déterministe à chaque exécution.
- `seedAdmin.js` est, à l'inverse, **idempotent** : il crée OU promeut/réinitialise l'admin sans toucher au reste.

---

## 15. Matrice de conformité

Tableau exhaustif reliant **chaque exigence du cahier des charges** à sa réalisation dans le projet.

### 15.1 Backend & API

| Exigence | Satisfaite par |
|----------|----------------|
| JWT | `jsonwebtoken` — signé au login, vérifié par `auth.middleware.js` (§9) |
| Inscription + bcrypt | `POST /api/auth/register` + hook `pre('save')` bcryptjs 12 rounds |
| Connexion + JWT | `POST /api/auth/login` — retourne le token |
| Middleware d'authentification | `middlewares/auth.middleware.js` |
| Validation serveur (Joi) | `validators/*.validator.js` + `validate.middleware.js` |
| 3+ modèles Mongoose | **5 modèles** : `User`, `Root`, `Word`, `Favorite`, `Revision` (§6) |
| 1+ relation populate | `Word.root → Root` (exigée) + `Favorite.item` refPath + `Revision.root` + virtuel `Root.words` |
| Validation par schémas | Schémas Mongoose (types, enum, longueurs) + schémas Joi |
| CRUD complet 2+ ressources | **4 ressources CRUD** : `Root`, `Word`, `Favorite`, `Revision` (D3, D11) |
| Routes publiques + protégées | Lecture `Root`/`Word`/`health` publique ; reste protégé JWT |
| Gestion d'erreurs + codes statut | `express-async-errors` + `errorHandler.js` + `AppError` ; codes 200→500 (§8.5) |
| `.env` | `backend/.env` + `.env.example` (§12) |
| Vérification de types de champs | Types stricts Mongoose + Joi (String, ObjectId, enum, Boolean…) |
| Route 404 API catch-all | `routes/index.js` — `ALL /api/*` → 404 JSON (D9) |
| Endpoint santé | `GET /api/health` (D9) |
| Pagination | `?page=&limit=` → `{ data, total, page, totalPages }` (D9, §8.2) |
| CORS whitelist | `cors` configuré sur `CLIENT_URL` (D9) |
| Sécurité HTTP | `helmet` + `express-rate-limit` |
| Seed | `npm run seed` — **102 racines, 900 mots**, 7 types couverts (D9, §14) |
| Système de révision | Modèle `Revision` + endpoints `/api/revisions/*` (D11) |
| Suggestions de lettres | `GET /api/roots/suggestions` — guidage pédagogique en temps réel (D11) |
| Console admin utilisateurs | Endpoints `GET/PATCH/DELETE /api/users[/:id]` + `AdminRoute` côté front |
| Conteneurisation | `docker-compose.yml` + `Makefile` à la racine du repo |

### 15.2 Frontend

| Exigence | Satisfaite par |
|----------|----------------|
| React via Vite | `vite` 6 + `@vitejs/plugin-react` (§3) |
| 5+ composants réutilisables | `Button`, `Input`, `Spinner`, `Badge`, `Modal`, `Pagination` (+ layout/métier) |
| React Router 4–5 routes | **15 routes** déclarées (§10.2) |
| Pages Login / Register | `pages/Login.jsx`, `pages/Register.jsx` |
| Stockage du JWT | `localStorage` + intercepteur axios (D10) |
| `PrivateRoute` | `routes/PrivateRoute.jsx` — protège `/profile`, `/favorites` |
| Logout | `AuthContext.logout()` — purge `localStorage` |
| Context API | `AuthContext`, `ThemeContext` |
| axios | `services/api.js` + services par ressource |
| Affichage de données | `RootExplorer`, `RootDetail`, `WordList`, `WordCard`, `Favorites` |
| Formulaires Create + Update | Modales de création/édition de racines et mots |
| Suppression avec confirmation | `Modal` de confirmation avant tout `DELETE` |
| États de chargement | `Spinner` + `useFetch` |
| Gestion d'erreurs affichée | Messages d'erreur `Input` + toasts |
| Pagination | Composant `Pagination` + `?page=&limit=` |
| Responsive | Classes Tailwind mobile-first |
| Tailwind | `tailwindcss` 3.4 + `tailwind.config.js` |
| Feedback visuel / toasts | `react-hot-toast` |
| Fonctionnalité métier | Exploration de racines + classification morphologique (§2.3) |
| Filtrage / recherche / tri | `GET /api/words` filtres + `sortBy` |
| Recherche avancée multi-filtres | Panneau de filtres + `useDebounce` (D6, §8.3) |
| Hooks personnalisés | `useAuth`, `useFetch`, `useDebounce`, `useTheme` |
| Thème sombre / clair | `ThemeContext` + `darkMode: 'class'` |
| Thème global | Classe `dark` sur `<html>` (§10.6) |
| Animations | `framer-motion` + `AnimatePresence` |
| i18n multilingue | `react-i18next` — locales `fr` / `en` (D4) |
| Code ES6+ propre | Modules ES, fonctions fléchées, `async/await` |
| Spread operator | Mises à jour immuables d'état / objets |
| Optional chaining | `?.` sur les données distantes potentiellement nulles |
| Template strings | Construction d'URL, slugs, messages |

---

## 16. Plan de mise en route

Deux modes : **Docker Compose** (recommandé, zéro dépendance locale) ou **Node local** (Node 22 + Mongo 7 installés).

### 16.1 Docker Compose (recommandé)

**Prérequis :** Docker Desktop démarré.

```bash
cd rcn-arb            # racine du repo (où se trouve le Makefile)
make build            # construit les images backend + frontend (1ère fois)
make up               # démarre mongo + seed + backend + frontend
```

Le service `seed` (one-shot) peuple la base avant que le backend ne démarre.

| Cible Make | Action |
|-----------|--------|
| `make up` / `make down` / `make restart` | Cycle de vie |
| `make seed` | Relance le seed (102 racines / 900 mots) |
| `make status` / `make logs` | Diagnostic |
| `make clean` | Nettoyage complet (conteneurs + images + volume Mongo) |

Création de l'admin :
```bash
docker exec racines-arabes-backend npm run seed:admin
```

### 16.2 Node local

**Prérequis :** Node.js 22.x LTS + npm 10.x + MongoDB 7.0 démarré.

```bash
# 1. Backend
cd racines-arabes/backend
npm install
cp .env.example .env          # renseigner JWT_SECRET, MONGO_URI...
npm run seed                  # 102 racines, 900 mots, utilisateur démo
npm run seed:admin            # (optionnel) crée admin@racines.app
npm run dev                   # http://localhost:5000 (sonde /api/health)

# 2. Frontend (nouveau terminal)
cd racines-arabes/frontend
npm install
cp .env.example .env          # VITE_API_URL=http://localhost:5000/api
npm run dev                   # http://localhost:5173
```

### 16.3 Vérification rapide

| Vérification | Attendu |
|--------------|---------|
| `GET http://localhost:5000/api/health` | `{ "status": "ok", ... }` |
| `GET http://localhost:5000/api/roots?limit=200` | Pagination contenant ~102 racines |
| `GET http://localhost:5000/api/roots/suggestions?l0=ك` | `{ suggestions: { 1: [...], 2: [...] } }` |
| Ouvrir http://localhost:5173 | Page `Home` immersive |
| Aller sur `/explorer` et poser ك | Les lettres ت / س / ث / ب / ذ / ل s'illuminent en rouge |
| Connexion `demo@racines.app / demo1234` | Accès à `/profile`, `/favorites`, `/revisions` |
| Connexion `admin@racines.app / admin1234` | Accès à `/admin/users` |

### 16.4 Mise en production (résumé)

- Backend : `NODE_ENV=production`, `npm start` (`morgan` désactivé).
- Frontend : `npm run build` → contenu statique `dist/` à servir ; `npm run preview` pour valider localement.
- Docker : les `Dockerfile` backend et frontend sont prêts pour un déploiement compose en environnement de production en ajustant les variables.

---

## 17. Périmètre des bonus

> **Décision D9 (revue D11) :** plusieurs bonus sont retenus pour densifier la valeur métier de l'application au-delà du minimum.

| Bonus | Statut | Justification |
|-------|--------|---------------|
| **Validation des formulaires en temps réel** | ✅ **Inclus** | Retour immédiat à la saisie (champ par champ) côté frontend, en complément de la validation Joi serveur. |
| **Suggestion de lettres compatibles (D11)** | ✅ **Inclus** | Endpoint `GET /api/roots/suggestions` + surlignage rouge dans `LetterPicker` : guidage pédagogique en temps réel pendant la sélection. |
| **Système de révision par cartes mémoire (D11)** | ✅ **Inclus** | Modèle `Revision` + chrono + carte recto/verso + 4 ratings + score pondéré /100 + stats globales. Toutes les agrégations sont calculées à la demande (cohérent avec D8). |
| **Console d'administration des utilisateurs** | ✅ **Inclus** | Pages `/admin/users` et `/admin/users/:id` réservées au rôle `admin` via `AdminRoute` + endpoints `GET/PATCH/DELETE /api/users[/:id]`. |
| **Conteneurisation Docker Compose** | ✅ **Inclus** | 4 services (`mongo`, `seed`, `backend`, `frontend`) + `Makefile` raccourcissant `make build` / `make up` / `make seed` / `make clean`. |
| Refresh token | ❌ Hors périmètre | JWT à durée de vie fixe (`JWT_EXPIRES_IN`) suffisant ; la rotation ajoute une complexité non justifiée. |
| WebSockets (temps réel) | ❌ Hors périmètre | Aucune fonctionnalité collaborative en direct ; l'API REST couvre tous les besoins. |
| Envoi d'e-mails (nodemailer) | ❌ Hors périmètre | Pas de confirmation d'inscription ni de réinitialisation par e-mail. |

### Décisions D1–D11 (résumé)

| Décision | Sujet |
|----------|-------|
| **D1** | Monorepo `racines-arabes/` — dossiers `backend/` + `frontend/`. |
| **D2** | Pas de bibliothèque UI tierce — modale/dropdown maison en JSX/Tailwind. |
| **D3** | Lecture publique de `Root`/`Word` ; CRUD ouvert à tout utilisateur authentifié + ownership (admin override). |
| **D4** | i18n d'interface = `fr` + `en` uniquement (LTR), pas de RTL d'interface. |
| **D5** | `nativeLanguage` (profil) distinct de la locale i18n. |
| **D6** | Recherche avancée multi-filtres sur `GET /api/words` + `useDebounce`. |
| **D7** | Enum morphologique réduit à 7 types (`NOUN_TIME` et `ADJ_ASSIM` retirés). |
| **D8** | Anti sur-ingénierie : pas de `services/`, pas de `catchAsync`, pas de champs dénormalisés (`wordsCount`, scores). |
| **D9** | Cibles d'exécution et de seed standardisées. |
| **D10** | JWT stocké en `localStorage` + intercepteur axios. |
| **D11** | Système de révision (modèle `Revision` + ratings + score pondéré /100 + stats agrégées à la demande) + suggestions de lettres. |

---

*Document de référence autosuffisant — un développeur peut démarrer le projet « Dictionnaire de Racines Trilitères Arabes » à partir de ce seul fichier. Toutes les décisions critiques D1 à D11 y sont appliquées.*
