let db = require('../db/database_mongo');
let Export = require('./internal/export');

exports.createArrangement = function (arrangement) {
  return new Promise(resolve => {
    db.createArrangement(arrangement).then(results => {
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

exports.exportArrangement = function (arrangementId, exportType, request) {
  return new Promise(resolve => {
    db.getArrangement(arrangementId, request).then(arrangement => {
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

exports.doesArrangementExist = function (arrangementId) {
  return new Promise(resolve => {
    db.doesArrangementExist(arrangementId).then(results => {
      resolve(results);
    });
  });
};

exports.updateArrangement = function (arrangement) {
  return new Promise(resolve => {
    db.updateArrangement(arrangement).then(results => {
      resolve(results);
    });
  });
};
