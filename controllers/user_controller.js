let api = require('../api/user_api');
let core = require('../api/internal/core');

exports.getUsers = function (request, response) {
  api.getUsers(request).then(results => {
    core.sendResponse(results, response);
  });
};

exports.getUser = function (request, response) {
  let userId = request.params.id;

  if (userId !== request.googleId) {
    core.sendUnauthorizedResponse(response);
    return;
  }

  api.getUser(userId, request).then(results => {
    core.sendResponse(results, response);
  });
};

exports.getUserArrangements = function (request, response) {
  let userId = request.params.id;

  if (userId !== request.googleId) {
    core.sendUnauthorizedResponse(response);
    return;
  }

  api.getUserArrangements(userId, request).then(results => {
    core.sendResponse(results, response);
  });
};
