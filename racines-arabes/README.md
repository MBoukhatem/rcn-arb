# نظام الجذور العربية — Dictionnaire de Racines Trilitères Arabes

Application web fullstack permettant d'**explorer les racines trilitères** de la langue arabe
(جَذْر ثُلَاثِيّ) et leurs mots dérivés, classés par type morphologique. L'utilisateur saisit
trois lettres arabes, modifie librement la combinaison, et obtient instantanément les mots
dérivés organisés par catégorie (verbe, masdar, nom d'agent, nom de lieu…). Au-delà de la
consultation, l'application offre **favoris**, **système de révision par cartes mémoire** et
**suggestions de lettres** pour compléter une racine valide.

## Sommaire

- [Stack](#stack)
- [Fonctionnalités](#fonctionnalités)
- [Structure du monorepo](#structure-du-monorepo)
- [Démarrage rapide (Docker · recommandé)](#démarrage-rapide-docker--recommandé)
- [Démarrage manuel (Node local)](#démarrage-manuel-node-local)
- [Comptes de démo](#comptes-de-démo)
- [API REST — vue d'ensemble](#api-rest--vue-densemble)
- [Documentation détaillée](#documentation-détaillée)

## Stack

- **Backend** : Node.js 22 LTS · Express 4 · MongoDB 7 / Mongoose 8 · JWT · Joi · bcryptjs
- **Frontend** : React 18 · Vite 6 · React Router v6 · axios · Tailwind CSS 3 · framer-motion · react-i18next
- **Infrastructure** : Docker Compose (4 services : mongo, seed, backend, frontend)

## Fonctionnalités

| Domaine | Détail |
|---------|--------|
| **Explorateur** | Sélection des 3 lettres arabes ; **suggestion en rouge** des lettres complétant une racine existante ; création d'une nouvelle racine (admin). |
| **Recherche avancée** | Page `/search` multi-filtres : type morphologique, temps verbal, racine, texte libre, tri, pagination. |
| **CRUD racines & mots** | Lecture publique, écriture protégée par JWT + ownership (admin ou créateur). |
| **Favoris** | Racines et mots ajoutables aux favoris, scopés à l'utilisateur. |
| **Révisions** | Carte mémoire recto/verso avec **chrono**, 4 boutons rating (**raté / difficile / moyen / facile**), score pondéré /100, **stats globales** par utilisateur. |
| **Comptes** | Inscription, connexion JWT, profil, changement de mot de passe. **Console admin** (liste/édition/suppression d'utilisateurs). |
| **i18n** | Interface FR/EN, contenu arabe préservé. |
| **Thème** | Clair/sombre persistant (classe `dark` sur `<html>`). |

## Structure du monorepo

```
rcn-arb/
├── Makefile                     # Commandes Docker simplifiées
├── PROJET.md                    # Spécification technique complète
└── racines-arabes/
    ├── backend/                 # API Express + Mongoose (port 5000)
    ├── frontend/                # SPA React + Vite (port 5173)
    ├── docker-compose.yml       # Stack 4 services
    ├── DESIGN_SYSTEM.md         # Système de design (palette, composants, animations)
    └── README.md                # Ce fichier
```

## Démarrage rapide (Docker · recommandé)

**Prérequis** : Docker Desktop démarré.

```bash
# Depuis la racine du repo
cd /chemin/vers/rcn-arb

# Construit les images (1ère fois ou après changement de dépendances)
make build

# Démarre Mongo + seed + API + frontend
make up
```

Une fois la commande revenue :
- **Frontend** : http://localhost:5173
- **API** : http://localhost:5000/api/health
- **MongoDB** : localhost:27017

Pendant `make up`, le service `seed` (one-shot) peuple automatiquement la base avec **102
racines** et **900 mots dérivés** avant de démarrer le backend.

### Cibles `make` disponibles

| Cible | Action |
|-------|--------|
| `make build` | Construit les images Docker (backend + frontend) |
| `make up` | Démarre toute la stack |
| `make down` | Arrête et supprime les conteneurs |
| `make restart` | `down` puis `up` |
| `make status` | État des conteneurs |
| `make seed` | Re-peuple la base (102 racines / 900 mots) |
| `make logs` | Logs en continu |
| `make clean` | Nettoyage complet (conteneurs + images + volume Mongo) |

### Commandes utiles dans le conteneur backend

```bash
# Re-créer le compte admin (admin@racines.app / admin1234)
docker exec racines-arabes-backend npm run seed:admin

# Lint
docker exec racines-arabes-backend npm run lint
```

## Démarrage manuel (Node local)

**Prérequis** : Node.js 22.x LTS, npm 10.x, MongoDB 7.0 démarré localement.

```bash
# 1. Backend
cd racines-arabes/backend
npm install
cp .env.example .env       # renseigner MONGO_URI, JWT_SECRET…
npm run seed               # 102 racines, 900 mots, utilisateur démo
npm run dev                # http://localhost:5000 (sonde /api/health)

# 2. Frontend (nouveau terminal)
cd racines-arabes/frontend
npm install
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm run dev                # http://localhost:5173
```

## Comptes de démo

| Compte | Email | Mot de passe | Origine |
|--------|-------|--------------|---------|
| Utilisateur | `demo@racines.app` | `demo1234` | Créé automatiquement par `npm run seed` |
| Administrateur | `admin@racines.app` | `admin1234` | À créer via `npm run seed:admin` |

## API REST — vue d'ensemble

Toutes les routes sont préfixées par **`/api`**. Format de réponse uniforme : `{ success, data }`
ou `{ success, message }`. Pagination standard `?page=&limit=` retourne `{ data, total, page,
totalPages }`.

| Ressource | Endpoints principaux | Accès |
|-----------|----------------------|-------|
| `auth` | `POST /register` · `POST /login` · `GET /me` | Public / Protégé |
| `users` | `PATCH /me` · `PATCH /me/password` · `DELETE /me` · `GET /` (admin) · `PATCH /:id` (admin) · `DELETE /:id` (admin) | Protégé |
| `roots` | `GET /` · `GET /:slug` · `GET /:slug/words` · **`GET /suggestions`** · `POST /` · `PUT /:slug` · `DELETE /:slug` | Lecture publique, écriture JWT + ownership |
| `words` | `GET /` (filtres avancés) · `GET /:id` · `POST /` · `PUT /:id` · `DELETE /:id` | Idem |
| `favorites` | `GET /` · `POST /` · `DELETE /:id` | Protégé, scopé user |
| `revisions` | `GET /` · `GET /session` · **`GET /stats`** · `POST /` · `POST /session/complete` · `DELETE /:id` | Protégé, scopé user |
| `health` | `GET /` | Public |

L'endpoint **`GET /api/roots/suggestions`** alimente le surlignage rouge des lettres
compatibles dans l'explorateur ; il accepte `?l0=ك&l1=ت` et retourne, pour chaque slot encore
vide, l'ensemble des lettres qui mènent à une racine existante.

## Documentation détaillée

| Document | Contenu |
|----------|---------|
| [PROJET.md](../PROJET.md) | Spécification technique complète : architecture, modèles de données, API, décisions D1–D11, matrice de conformité. |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Système de design : palette turquoise + or, typographie Inter + Cairo, composants UI, animations, accessibilité. |
