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

## Déploiement en production (VPS OVH)

Fichiers dédiés : `docker-compose.prod.yml`, `backend/Dockerfile.prod`,
`site-vitrine/Dockerfile.prod` + `nginx.conf`, `intranet/Dockerfile.prod` + `nginx.conf`.
Contrairement au setup de dev, `db` et `backend` ne sont **pas** exposés sur des ports
publics — seuls `site-vitrine` (8084) et `intranet` (8085) le sont ; chacun sert ses
fichiers statiques compilés via nginx et proxy `/api/*` vers `backend` en interne.

```bash
# Sur le VPS
git clone https://github.com/csp-prodiges/applications.git csp-prodiges
cd csp-prodiges

cp .env.production.example .env.production
nano .env.production   # POSTGRES_PASSWORD, JWT_SECRET, ADMIN_EMAIL/ADMIN_PASSWORD,
                        # CORS_ORIGINS et PUBLIC_IP (déjà pré-remplis avec 79.137.54.238)
                        # Générer des secrets forts : openssl rand -base64 48

docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

- Site vitrine : http://79.137.54.238:8084
- Intranet : http://79.137.54.238:8085
- `ENABLE_DEMO_SEED=false` en prod (par défaut dans `.env.production.example`) : les
  comptes de démo (mots de passe publiés sur GitHub) ne sont **jamais** créés. Le seul
  compte créé au démarrage est celui défini par `ADMIN_EMAIL` / `ADMIN_PASSWORD` —
  changez son mot de passe depuis l'intranet dès la première connexion, puis créez les
  vrais comptes enseignants/parents depuis Utilisateurs.
- Pour mettre à jour après un nouveau `git push` :
  `git pull && docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build`
- Firewall OVH : n'ouvrir que 22 (SSH), 8084 et 8085 — pas besoin d'exposer le port
  Postgres ni celui du backend.
- Étape suivante recommandée (non faite ici) : domaine + reverse-proxy Traefik/Nginx
  devant les deux ports avec certificats TLS (Let's Encrypt), pour ne plus exposer
  l'app en HTTP brut sur une IP.

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
