let api = require('../api/session_api');

exports.logIn = function (request, response) {
  let user = request.body;

  api.logIn(user).then(results => {
    response.set('Content-Type', 'application/json');
    response.status(200).send(JSON.stringify(results));
  });
};

exports.logOut = function (request, response) {
  api.logOut(request).then(results => {
    response.set('Content-Type', 'application/json');
    response.status(200).send(JSON.stringify(results));
  });
};
