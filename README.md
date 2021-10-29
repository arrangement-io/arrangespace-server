# Backend

## Table of Contents

For the Backend-end side, we use JavaScript and Node JS and MongoDB. This project also support NodeJS version. See Development Set Up


### Authors and Contributors
- [David Wosk](https://www.linkedin.com/in/david-wosk-90613154/) - Full Stack
- [Gideon Chia](https://www.linkedin.com/in/gideon-chia-8573bb30/) - Full Stack
- [Jeff Chiu](https://www.linkedin.com/in/jeffchiu2022) - Full Stack


# Development Setup

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

# Deploy to NextJS


