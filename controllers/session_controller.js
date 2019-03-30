let api = require('../api/session_api');
let core = require('../api/internal/core');

exports.logIn = function (request, response) {
  api.logIn(request, response).then(results => {
    core.sendResponse(results, response);
  });
};

exports.logOut = function (request, response) {
  api.logOut(request).then(results => {
    core.sendResponse(results, response);
  });
};
