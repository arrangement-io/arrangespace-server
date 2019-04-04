# Development

```shell
$ yarn install
$ export MONGODB_NAME=<db name>
$ export MONGODB_URI=<mongodb uri>
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
