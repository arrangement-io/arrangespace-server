let db = require('../db/database_mongo');

/**
 * @api {post} /login LogIn User
 * @apiName SessionLogin
 * @apiGroup Session
 *
 * @apiParam {String} access_token User access_token.
 * @apiParam {Object} user_data User Object.
 *
 * @apiSuccess {String} message You are logged in.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    "message": "You are logged in."
 *  }
 */
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

/**
 * @api {post} /logout LogOut User
 * @apiName SessionLogout
 * @apiGroup Session
 * @apiDescription Not Yet Implemented.
 *
 * @apiSuccess {String} message You are logged in.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *    "message": "You are logged out."
 *  }
 */
exports.logOut = function (request) {
  // TODO: Make DB call
  let response = {
    message: 'You are logged out.'
  };

  return new Promise(resolve => {
    resolve(response);
  });
};
