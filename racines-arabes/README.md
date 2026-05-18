# نظام الجذور العربية — Dictionnaire de Racines Trilitères Arabes

Application web fullstack permettant d'explorer les racines trilitères de la langue arabe
(جَذْر ثُلَاثِيّ) et leurs mots dérivés, classés par type morphologique. L'utilisateur saisit
trois lettres arabes, les modifie librement, et obtient instantanément les mots dérivés
organisés par catégorie (verbe, masdar, nom d'agent, nom de lieu, etc.).

## Stack technique

- **Backend** : Node.js 22 LTS, Express 4, MongoDB 7 / Mongoose 8, JWT, Joi, bcryptjs.
- **Frontend** : React 18, Vite 6, React Router v6, axios, Tailwind CSS 3, react-i18next.
- **Architecture** : client-serveur découplée, API REST JSON, authentification JWT.

## Structure du monorepo

```
racines-arabes/
├── backend/      # API Express + Mongoose (port 5000)
├── frontend/     # SPA React + Vite (port 5173)
└── README.md     # Ce fichier
```

## Prérequis

- Node.js 22.x LTS et npm 10.x
- MongoDB 7.0 Community en cours d'exécution localement (ou une URI Atlas)

## Mise en route

```bash
# 1. Backend — installation et configuration
cd backend
npm install
cp .env.example .env          # renseigner JWT_SECRET, MONGO_URI, etc.

# 2. Peupler la base de données (>= 5 racines, >= 20 mots, 7 types)
npm run seed

# 3. Lancer l'API en développement
npm run dev                   # http://localhost:5000  (santé : /api/health)

# 4. Frontend — installation et configuration (nouveau terminal)
cd ../frontend
npm install
cp .env.example .env          # VITE_API_URL=http://localhost:5000/api

# 5. Lancer le frontend
npm run dev                   # http://localhost:5173
```

## Vérification rapide

| Vérification | Attendu |
|--------------|---------|
| `GET http://localhost:5000/api/health` | `{ "status": "ok", ... }` |
| `GET http://localhost:5000/api/roots` | Liste paginée des racines seedées |
| Ouvrir `http://localhost:5173` | Page d'accueil ; `/explorer` permet de sélectionner 3 lettres |

## Documentation

La spécification complète et autosuffisante du projet (architecture, modèles de données,
API REST, décisions D1–D10, matrice de conformité) se trouve dans
[PROJET.md](./PROJET.md).
