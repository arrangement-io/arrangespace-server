let db = require('../db/database_mongo');

/**
 * @api {get} /users Retrieve All Users
 * @apiName GetUsers
 * @apiGroup User
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {user-object},
 *       {user-object}
 *     ]
 */
exports.getUsers = function (request) {
  return new Promise(resolve => {
    db.getUsers(request).then(results => {
      resolve(results);
    });
  });
};

/**
 * @api {get} /users/:id Retrieve User
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} _id Id of the User.
 * @apiSuccess {String} familyName Last Name of the User.
 * @apiSuccess {String} imageUrl URL to the Users Gravatar.
 * @apiSuccess {String} name Name of the User.
 * @apiSuccess {String} googleId GoogleId of the User.
 * @apiSuccess {String} email Email of the User.
 * @apiSuccess {String} givenName First name of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "5c8834497a09b7bf2ca1d98b",
 *       "familyName": "Chia",
 *       "imageUrl": "https://lh3.googleusercontent.com/-CIJl6ntqVg4/AAAAAAAAAAI/AAAAAAAAABY/Jfd1E76bbhA/s96-c/photo.jpg",
 *       "name": "Gideon Chia",
 *       "googleId": "116550101409368732312",
 *       "email": "gideon.chia@gmail.com",
 *       "givenName": "Gideon"
 *     }
 */
exports.getUser = function (userId, request) {
  return new Promise(resolve => {
    db.getUser(userId, request).then(results => {
      resolve(results);
    });
  });
};

/**
 * @api {get} /users/:id/arrangements Retrieve Users Arrangements
 * @apiName GetArrangements
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {arrangement-object},
 *       {arrangement-object}
 *     ]
 */
exports.getUserArrangements = function (userId, request) {
  return new Promise(resolve => {
    db.getUserArrangements(userId, request).then(results => {
      resolve(results);
    });
  });
};
