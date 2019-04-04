var MongoClient = require('mongodb').MongoClient;
let User = null;
let Arrangement = null;
let mCore = require('./core_mongo');

exports.connect = async function (uri) {
  try {
    let client = await MongoClient.connect(uri, { useNewUrlParser: true });
    let db = await client.db(process.env.MONGODB_NAME);
    User = db.collection('users');
    Arrangement = db.collection('arrangement');
    mCore.registerResourceHandlers();
  } catch (error) {
    console.log(error);
  }
};

exports.createUser = function (payload, request, response) {
  return new Promise(resolve => {
    mCore.updateResource(User, payload, 'googleId', request).then(results => {
      resolve(results);
    });
  });
};

exports.createArrangement = function (arrangementId, payload, request, response) {
  return new Promise(resolve => {
    mCore.updateResource(Arrangement, payload, '_id', request).then(results => {
      resolve(results);
    });
  });
};

exports.doesArrangementExist = function (arrangementId) {
  return new Promise(resolve => {
    let query = { _id: arrangementId };
    // Don't pass request so it is not validated
    mCore.getResource(Arrangement, query).then(results => {
      resolve(results);
    });
  });
};

exports.getArrangement = function (arrangementId, request) {
  let query = { _id: arrangementId };

  return new Promise(resolve => {
    mCore.getResource(Arrangement, query, request).then(results => {
      resolve(results);
    });
  });
};

exports.getUser = function (googleId, request) {
  let query = { googleId: googleId };

  return new Promise(resolve => {
    mCore.getResource(User, query, request).then(results => {
      resolve(results);
    });
  });
};

exports.getUserArrangements = function (userId, request) {
  let query = { owner: userId };

  return new Promise(resolve => {
    mCore.getResources(Arrangement, query, request).then(results => {
      resolve(results);
    });
  });
};

exports.getUsers = function (request) {
  let query = {};

  return new Promise(resolve => {
    mCore.getResources(User, query, request).then(results => {
      resolve(results);
    });
  });
};
