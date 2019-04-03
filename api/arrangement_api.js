let db = require('../db/database_mongo');
let Export = require('./internal/export');

exports.createArrangement = function (arrangementId, payload, request, response) {
  return new Promise(resolve => {
    db.createArrangement(arrangementId, payload, request, response).then(results => {
      resolve(results);
    });
  });
};

exports.getArrangement = function (arrangementId, request) {
  return new Promise(resolve => {
    db.getArrangement(arrangementId, request).then(results => {
      resolve(results);
    });
  });
};

exports.exportArrangement = function (arrangementId, exportType, payload) {
  return new Promise(resolve => {
    db.getArrangement(arrangementId, payload).then(arrangement => {
      if (arrangement) {
        Export.exportArrangement(arrangement, exportType).then(exportResults => {
          resolve(exportResults);
        });
      } else {
        resolve('Something went wrong.');
      }
    });
  });
};

exports.doesArrangementExist = function (arrangementId, request) {
  return new Promise(resolve => {
    db.doesArrangementExist(arrangementId, request).then(results => {
      resolve(results);
    });
  });
};

exports.updateArrangement = function (arrangementId, payload, request, response) {
  return new Promise(resolve => {
    db.updateArrangement(arrangementId, payload, request, response).then(results => {
      resolve(results);
    });
  });
};
