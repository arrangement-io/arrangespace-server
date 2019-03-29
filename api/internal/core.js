exports.sendResourceNotFound = function (request, response) {
  response.status(404);
  payload = {
    'error': `Could not find resource with id: ${request.params.id}`
  };
  
  this.setHeaders(response);
  this.sendFailureResponse(payload, response)
};

exports.sendFailureResponse = function (payload, response) {
  response.json(payload);
};

exports.setHeaders = function (response) {
  response.set('Content-Type', 'application/json');
};

exports.sendSuccessResponse = function (results, response) {
  response.status(200);
  this.setHeaders(response);
  response.json(results);
}