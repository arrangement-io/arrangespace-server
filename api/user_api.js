let db = require('../db/database_mongo');

exports.getUsers = function (request) {
  return new Promise(resolve => {
    db.getUsers(request).then(results => {
      resolve(results);
    });
  });
};

exports.getUser = function (userId, request) {
  // TODO: Make DB call
  let response = {
    user: 'David Wosk',
    user_id: userId
  };

  return new Promise(resolve => {
    resolve(response);
  });
};
