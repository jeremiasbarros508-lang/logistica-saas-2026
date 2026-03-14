.PHONY: heroku-login heroku-create heroku-addons heroku-config heroku-deploy heroku-logs heroku-open heroku-restart heroku-rollback heroku-destroy

APP_NAME ?= logistica-saas

heroku-login:
	heroku login

heroku-create:
	heroku create $(APP_NAME)

heroku-addons:
	heroku addons:create heroku-postgresql:hobby-dev --app=$(APP_NAME)
	heroku addons:create heroku-redis:premium-0 --app=$(APP_NAME)

heroku-config:
	heroku config:set ENVIRONMENT=production --app=$(APP_NAME)
	heroku config:set JWT_SECRET=$(shell openssl rand -base64 32) --app=$(APP_NAME)

heroku-deploy: heroku-create heroku-addons heroku-config
	git push heroku main

heroku-logs:
	heroku logs --tail --app=$(APP_NAME)

heroku-open:
	heroku open --app=$(APP_NAME)

heroku-restart:
	heroku restart --app=$(APP_NAME)

heroku-rollback:
	heroku releases --app=$(APP_NAME)
	@echo "Use: heroku releases:rollback vX --app=$(APP_NAME)"

heroku-destroy:
	heroku apps:destroy $(APP_NAME) --confirm $(APP_NAME)
