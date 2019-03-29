let api = require('../api/user_api');
let core = require('../api/internal/core');

exports.getUsers = function (request, response) {
  api.getUsers(request).then(results => {
    core.sendSuccessResponse(results, response);
  });
};

exports.getUser = function (request, response) {
  let userId = request.params.id;

  api.getUser(userId, request).then(results => {
    core.sendSuccessResponse(results, response);
  });
};

exports.getUserArrangements = function (request, response) {
  let userId = request.params.id;

  api.getUserArrangements(userId, request).then(results => {
    core.sendSuccessResponse(results, response);
  });
};
