# Makefile global — projet racines-arabes
# Usage : make build  ->  make up  ->  (tester)  ->  make down
#
# Tout passe par Docker Compose : aucune dependance au shell Windows.
# Prerequis : Docker Desktop demarre.

COMPOSE := docker compose -f racines-arabes/docker-compose.yml

.PHONY: help build up down restart status seed logs clean

help:
	@echo Cibles disponibles :
	@echo   make build    - construit les images Docker (backend + frontend)
	@echo   make up       - demarre Mongo, peuple la base, lance API + frontend
	@echo   make down     - arrete et supprime les conteneurs
	@echo   make restart  - down puis up
	@echo   make status   - etat des conteneurs
	@echo   make seed     - repeuple la base de donnees
	@echo   make logs     - affiche les logs en continu
	@echo   make clean    - down + supprime images et volume MongoDB

# Construit les images (necessaire la 1re fois ou apres changement de dependances)
build:
	$(COMPOSE) build

# Demarre toute la stack ; le seed s'execute avant le backend.
# Projet testable des que la commande rend la main :
#   Frontend : http://localhost:5173
#   API      : http://localhost:5000/api/health
up:
	$(COMPOSE) up -d
	@echo Projet pret et testable :
	@echo     Frontend    : http://localhost:5173
	@echo     API         : http://localhost:5000/api/health
	@echo     Compte demo : demo@racines.app / demo1234

down:
	$(COMPOSE) down

restart: down up

status:
	$(COMPOSE) ps

# Relance le service de seed seul
seed:
	$(COMPOSE) run --rm seed

logs:
	$(COMPOSE) logs -f

# Nettoyage complet : conteneurs, images et volume de donnees
clean:
	$(COMPOSE) down -v --rmi local
