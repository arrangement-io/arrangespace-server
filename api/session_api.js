let db = require('../db/database_mongo');

exports.logIn = function (payload, request, response) {
  let success = {
    message: 'You are logged in.'
  };

  return new Promise(resolve => {
    db.createUser(payload, request, response).then(results => {
      if (!results.error) {
        resolve(success);
      } else {
        resolve(results);
      }
    });
  });
};

exports.logOut = function (request) {
  // TODO: Make DB call
  let response = {
    message: 'You are logged out.'
  };

  return new Promise(resolve => {
    resolve(response);
  });
};
