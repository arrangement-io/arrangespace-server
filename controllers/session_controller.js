let api = require('../api/session_api');

exports.logIn = function (request, response) {
  let user = request.body;

  api.logIn(user).then(results => {
    core.sendSuccessResponse(results, response);
  });
};

exports.logOut = function (request, response) {
  api.logOut(request).then(results => {
    core.sendSuccessResponse(results, response);
  });
};
