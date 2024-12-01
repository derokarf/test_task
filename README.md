Create a microservice that returns the current price of Bitcoin upon request.

The initial quote must be obtained from the Binance exchange API.

https://binance-docs.github.io/apidocs/spot/en/#symbol-order-book-ticker
After obtaining the price, it is necessary to apply a 0.01% service commission to the bid and ask, and calculate the mid price. These values should be returned by the microservice via an HTTP request.

The price needs to be updated every 10 seconds.

The update frequency, service commission, and HTTP port should be configurable through environment variables. The project should include a Dockerfile to run the application.

Upload the result to GitHub.

Done.

How to run:
    1. If you have "make":
	        - make init
	        - make up
	        - go to point 3
    2. If you don't have "make":
	        - docker-compose run rate-nodejs sh -c "npm install"
	        - docker-compose up -d rate-postgres
	    	- docker-compose exec rate-postgrespsql -U postgres -d postgres -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
	    	- docker-compose up -d rate-nodejs
	    	- docker-compose exec rate-nodejs sh -c "npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d ormconfig.ts migration:run -t each"
        	- docker-compose up --remove-orphans
        	- go to point 3
    3. Wait defaul schedule updating period (10 sec)
    4. Send GET request to 127.0.0.1:50000/rates/last-rates
