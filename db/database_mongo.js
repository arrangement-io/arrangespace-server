var MongoClient = require('mongodb').MongoClient;
let User = null;
let Arrangement = null;
let mCore = require('./core_mongo');
const core = require('../api/internal/core');
var app = require('../index');
const { MONGODB_URL, MONGODB_NAME } = process.env;

exports.connect = async function () {
  try {
    if (MONGODB_URL && MONGODB_NAME) {
      mCore.registerResourceHandlers();
      let client = await MongoClient.connect(`mongodb://${MONGODB_URL}`, { useNewUrlParser: true });
      let db = await client.db(MONGODB_NAME);
      User = db.collection('users');
      Arrangement = db.collection('arrangement');
      app.emit('ready');
      core.log('Successfully made connection to database...');
    } else {
      core.error('Please set MONGODB_URI and MONGODB_NAME before attempting to start the server.');
    }
  } catch (error) {
    core.error(error);
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
