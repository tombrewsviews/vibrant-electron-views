# Wellness data

## Pre-Setup Dependencies

- [Install Docker](https://docs.docker.com/docker-for-mac/install/)
- [Install the Hasura CLI](https://docs.hasura.io/1.0/graphql/manual/hasura-cli/index.html)
- [Install Node and Yarn](https://github.com/viewstools/docs/blob/master/DevEnvironmentSetup.md#if-you-dont-have-any-development-environment-setup)

## Setup
- _Make sure the Docker app is running._

- Install the project's dependencies. In a terminal, run:
```
yarn install
```

- Start the project. In a terminal, run:
```
yarn start
```
- Copy `.env.sample` to `.env`
```
cp .env.sample .env
```

- Bootstrap the database with some mock data. In a new terminal, run:
```
yarn setup
```

- Open the Hasura console. In a new terminal, run:
```
yarn hasura
```

## Dev mode

_Make sure the Docker app is running._

There's a `package.json` with a few scripts for convenience:

- `yarn start`: Start the Hasura and PostgreSQL servers in Docker. To stop it,
  press `ctrl+c`. Your data will be kept.
- `yarn hasura`: Open the Hasura console on http://localhost:9695
- `yarn migrate`: Apply migrations to the database - use this to update (or bootstrap) your
  db with the latest changes
- `yarn migrate:status`: See the migrations status in Hasura
- `yarn sample:data`: Setup some sample data
- `yarn down`: Tears down (removing the data!) the Hasura and PostgreSQL
  instances in Docker. Your database will be wiped.


## Staging

https://api.greyfinch.health

```
x-hasura-admin-secret cGGzO6qZ2HeRq3qdOrfApKkd00AGXvSZgbyVfjSevqWsfBr572snAjr68P9lZQcp
```

## Sample users
https://bitbucket.org/vaxiom/wellness-data/src/0b4dffba0f26a5b7bd3b41bb048203ae89be417c/sample-data/make.js#lines-29:102

## Bulk upload providers and professionals

Files needed:
- `Locations.csv` eg:
```
Company Name (legal entity),DBA (brand),Physical Address,City,State,Zip,Website URL
"Rock Dental Arkansas, PLLC",Children's Dentistry of Jonesboro,"1150 E. Matthews, Suite 102",Jonesboro,AR,72401,http://childrensdentistryjonesboro.com/
```

- `Professionals.csv` eg:
```
First Name,Last Name,Mobile Number,Email,License Type,AR License #,Location #1,Location #2,Location #3,Location#4,Location #5
Michelle ,Clinton,214-215-0558,michelle.clinton@westrockortho.com,Orthodontist,4321,"906 S. Pine St, Ste 5 --- Westrock Orthodontics","2415 Prince Street, Ste 100 --- Westrock Orthodontics",3700 S. University --- Westrock Orthodontics,3241 E. Race St. --- Westrock Orthodontics,
```

Run:
```
npx env-cmd -f .env node bulk-upload-provider-locations-and-professionals.js
```
