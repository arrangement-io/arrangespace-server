var MongoClient = require('mongodb').MongoClient;
let User = null;
let Arrangement = null;
let mCore = require('./core_mongo');

exports.connect = async function (uri) {
  try {
    let client = await MongoClient.connect(uri, { useNewUrlParser: true });
    let db = client.db(process.env.MONGODB_NAME);
    User = db.collection('users');
    Arrangement = db.collection('arrangement');
    mCore.registerResourceHandlers();
  } catch (error) {
    console.log(error);
  }
};

exports.createArrangement = function (arrangementId, payload, request, response) {
  return new Promise(resolve => {
    // If request does not have this, mongo needs it
    if (!payload._id) {
      payload._id = arrangementId;
    }
    mCore.createResource(Arrangement, arrangementId, payload, request).then(results => {
      resolve(results);
    });
  });
};

exports.createUser = function (payload, request, response) {
  return new Promise(resolve => {
    mCore.updateResource(User, payload, 'googleId', request).then(results => {
      resolve(results);
    });
  });
};

exports.doesArrangementExist = function (arrangementId) {
  return new Promise(resolve => {
    // Don't pass request so it is not validated
    mCore.getResource(Arrangement, arrangementId).then(results => {
      resolve(results);
    });
  });
};

exports.getArrangement = function (arrangementId, request) {
  return new Promise(resolve => {
    mCore.getResource(Arrangement, arrangementId, request).then(results => {
      resolve(results);
    });
  });
};

exports.getUser = function (googleId, request) {
  return new Promise(resolve => {
    mCore.getResource(User, googleId, request, 'googleId').then(results => {
      resolve(results);
    });
  });
};

exports.getUserArrangements = function (userId, request) {
  return new Promise(resolve => {
    mCore.getResource(Arrangement, userId, request, 'owner').then(results => {
      resolve(results);
    });
  });
};

exports.getUsers = function (request) {
  return new Promise(resolve => {
    mCore.getAllResources(User, request).then(results => {
      resolve(results);
    });
  });
};

exports.updateArrangement = function (arrangementId, payload, request, response) {
  return new Promise(resolve => {
    mCore.updateResource(Arrangement, payload, '_id', request).then(results => {
      resolve(results);
    });
  });
};
