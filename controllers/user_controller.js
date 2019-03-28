let api = require('../api/user_api');

exports.getUsers = function (request, response) {
  api.getUsers(request).then(results => {
    response.set('Content-Type', 'text/plain');
    response.status(200).send(JSON.stringify(results));
  });
};

exports.getUser = function (request, response) {
  let userId = request.params.id;

  api.getUser(userId, request).then(results => {
    response.set('Content-Type', 'text/plain');
    response.status(200).send(JSON.stringify(results));
  });
};
