let api = require('../api/session_api');

exports.logIn = function (request, response) {
  api.logIn(request).then(results => {
    response.set('Content-Type', 'text/plain');
    response.status(200).send(JSON.stringify(results));
  });
};

exports.logOut = function (request, response) {
  api.logOut(request).then(results => {
    response.set('Content-Type', 'text/plain');
    response.status(200).send(JSON.stringify(results));
  });
};
