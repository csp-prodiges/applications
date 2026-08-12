# Cité Scolaire Prodiges — Site vitrine + Intranet

Application complète pour la Cité Scolaire Prodiges (CSP), projet éducatif porté par
l'église ICC (Impact Centre Chrétien) : un site vitrine public et un intranet privé
pour les familles et les équipes pédagogiques.

## Stack

- **Backend** : FastAPI (async) + SQLAlchemy 2.0 + PostgreSQL, JWT (access + refresh),
  rôles `parent` / `enseignant` / `admin`.
- **Site vitrine** : React + TypeScript + Vite + Tailwind — public, sans authentification.
- **Intranet** : React + TypeScript + Vite + Tailwind — privé, authentifié.
- **Orchestration** : Docker Compose (4 services : `db`, `backend`, `site-vitrine`, `intranet`).

## Lancer le projet en local

```bash
docker compose up --build
```

- Site vitrine : http://localhost:5175
- Intranet : http://localhost:5176
- API backend (Swagger) : http://localhost:8001/docs
- PostgreSQL (hôte) : localhost:5433

Au premier démarrage, la base est créée et peuplée automatiquement avec des données
de démonstration (`backend/app/seed.py`) — familles, classes, notes, devoirs,
planning, cantine, commandes, actualités, admissions, ressources enseignants,
messagerie.

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Parent (famille Kouassi) | famille.kouassi@example.com | Famille@CSP2026! |
| Enseignant (classe CM1) | prof.dupont@cite-scolaire-prodiges.org | Prof@CSP2026! |
| Admin | admin@cite-scolaire-prodiges.org | Admin@CSP2026! |

## Structure

```
CSP-PRODIGES/
  docker-compose.yml       # orchestration des 4 services
  .env / .env.example      # variables partagées (DB, JWT, URLs front)
  backend/                 # API FastAPI (sert les 2 frontends)
    app/models/            # SQLAlchemy — 1 fichier par entité
    app/schemas/            # Pydantic
    app/routers/             # endpoints par domaine (auth, public, notes, devoirs...)
    app/seed.py               # données de démonstration
  site-vitrine/             # React — public (L'École, Vision, Programme, Admissions...)
  intranet/                 # React — privé (Dashboard, Notes, Planning, Cantine...)
```

## Notes de développement

- Le schéma de base est créé via `Base.metadata.create_all` au démarrage (pas
  d'Alembic pour l'instant) — à remplacer avant tout déploiement partagé durable.
- Les Dockerfiles sont en mode développement (hot-reload). Le `docker-compose.yml`
  active le polling des fichiers (`usePolling` / `WATCHFILES_FORCE_POLLING`), requis
  pour que le hot-reload fonctionne de façon fiable avec les bind-mounts Docker
  Desktop sur Windows.
- Déploiement production (OVH VPS) : prévoir des Dockerfiles multi-stage
  (build + nginx pour les frontends), un reverse-proxy avec TLS, et une migration
  vers Alembic — non fait à ce stade, volontairement reporté.
