let db = require('../db/database_mongo');

exports.createUser = function (request) {
  return new Promise(resolve => {
    db.getUsers(request).then(results => {
      resolve(results);
    });
  });
};

exports.getUsers = function (request) {
  return new Promise(resolve => {
    db.getUsers(request).then(results => {
      resolve(results);
    });
  });
};

exports.getUser = function (userId, request) {
  return new Promise(resolve => {
    db.getUser(userId, request).then(results => {
      resolve(results);
    });
  });
};

exports.getUserArrangements = function (userId, request) {
  return new Promise(resolve => {
    db.getUserArrangements(userId, request).then(results => {
      resolve(results);
    });
  });
};
