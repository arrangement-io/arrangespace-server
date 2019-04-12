# Development

```shell
$ yarn install
$ export MONGODB_NAME=<db name>
$ export MONGODB_URL=[username:password@]host1[:port1][/[database][?options]]
$ export GOOGLE_CLIENT_ID=<google client id>
$ npm start

Server listening on port 3000!
```

To view API documentation, visit localhost:3000/docs

# Running Tests

1. Run a local instance of mongod:

```shell
$ mongod
```

2. Seed the local database using the provided seed files:

```shell
$ mongoimport -d test -c users ./test/seed/users_seed.json
$ mongoimport -d test -c arrangement ./test/seed/arrangement_seed.json
```

3. Run the tests:

```shell
$ npm test
```

# Deploy to Now

```shell
$ now secrets add mongodb-url "mongo-url-here"
$ now secrets add mongodb-name "db-name-here"
$ now secrets add google-client-id "client-id-here"
$ now
```
