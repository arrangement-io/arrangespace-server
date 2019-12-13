let api = require('../api/session_api');
let core = require('../api/internal/core');

exports.logIn = function (request, response) {
  let payload = request.body;

  api.logIn(payload, request, response).then(results => {
    core.sendResponse(results, response);
  });
};

exports.logOut = function (request, response) {
  request.session.destroy(function (e) {
    request.logout();
    response.clearCookie('connect.sid');
    return response.json({ status: 'LOGGED OUT' });
  });
};
