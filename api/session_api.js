let db = require('../db/database_mongo');

exports.logIn = function (user) {
  let response = {
    message: 'You are logged in.'
  };

  return new Promise(resolve => {
    db.createUser(user).then(results => {
      resolve(response);
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
