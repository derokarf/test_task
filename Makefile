-include .env
export $(shell sed 's/=.*//' .env)

nodejsContainerName=rate-nodejs
testNodejsContainerName=rate-nodejs-test

postgresContainerName=rate-postgres
testPostgresContainerName=rate-postgres-test

testDockerComposeFileName=docker-compose.test.yaml

network-create:
	docker network create test-network || true

init: deps-install migration-run
up:
	docker-compose up --remove-orphans
deps-install:
	docker-compose run ${nodejsContainerName} sh -c "npm install"
exec-nodejs-container:
	docker-compose exec ${nodejsContainerName} sh
test-run-nodejs:
	docker-compose -f ${testDockerComposeFileName} up -d ${testPostgresContainerName}
	sleep 5
	docker-compose -f ${testDockerComposeFileName} exec ${testPostgresContainerName} psql -U postgres -d postgres -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
	docker-compose -f ${testDockerComposeFileName} up -d ${testNodejsContainerName}
	sleep 1
	docker-compose -f ${testDockerComposeFileName} exec ${testNodejsContainerName} sh -c "npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d ormconfig.ts migration:run -t each"
	docker-compose -f ${testDockerComposeFileName} exec -it ${testNodejsContainerName} sh;
migration-run:
	docker-compose up -d ${postgresContainerName}
	sleep 5
	docker-compose exec ${postgresContainerName} psql -U postgres -d postgres -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
	docker-compose up -d ${nodejsContainerName}
	sleep 1
	docker-compose exec ${nodejsContainerName} sh -c "npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d ormconfig.ts migration:run -t each"
migration-revert:
	docker-compose exec ${nodejsContainerName} sh -c "npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d ormconfig.ts migration:revert"
unit-test:
	docker-compose run ${nodejsContainerName} sh -c "npm run unit-tests"
integrational-test:
	docker-compose run ${nodejsContainerName} sh -c "npm run integrational-tests"
