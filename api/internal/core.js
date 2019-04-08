const validate = require('./schema');

exports.sendResourceNotFound = function (request, response) {
  response.status(404);
  let payload = {
    error: {
      status: 404,
      reason: 'notFound',
      message: `Could not find resource with id: ${request.params.id}`
    }
  };

  this.sendFailureResponse(payload, response);
};

exports.sendFailureResponse = function (payload, response) {
  response.status(payload.error.status);
  response.json(payload);
};

exports.setHeaders = function (response) {
  response.set('Content-Type', 'application/json');
};

exports.sendSuccessHtmlResponse = function (results, response) {
  response.set('Content-Type', 'text/html');
  response.status(200);
  response.send(results);
};

exports.sendSuccessResponse = function (results, response) {
  response.status(200);
  response.json(results);
};

exports.sendResponse = function (results, response) {
  if (!results || results.error) {
    this.sendFailureResponse(results, response);
    return;
  }

  this.sendSuccessResponse(results, response);
};

exports.sendUnauthorizedResponse = function (response) {
  let results = {
    error: {
      status: 401,
      reason: 'Unauthorized',
      message: 'Wrong credentials'
    }
  };

  this.sendFailureResponse(results, response);
};

exports.sendFailure = function (status, reason = 'standardError', message, resolve) {
  if (resolve) {
    let results = {
      error: {
        status: status,
        reason: reason,
        message: message
      }
    };

    resolve(results);
  } else {
    console.log('Missing resolve: ' + message);
  }
};

exports.resolveCatchError = function (error, resolve) {
  this.sendFailure(500, 'unknownFailure', error, resolve);
};

exports.validateGetRequest = function (model, request) {
  return new Promise(resolve => {
    try {
      (async () => {
        if (request) {
          if (Object.keys(request.query).length > 0) {
            this.sendFailure(400, 'invalidParameters', `This endpoint does not support query parameters.`, resolve);
            return;
          }
          if (Object.keys(request.body).length > 0) {
            this.sendFailure(400, 'invalidParameters', `request.body not supported for method GET.`, resolve);
            return;
          }
          // Passed validation
          resolve({});
        }
      })();
    } catch (error) {
      resolve(error);
    };
  });
};

exports.validatePostRequest = function (model, request) {
  return new Promise(resolve => {
    try {
      (async () => {
        let data = request.body;
        let errors = validate(model, data);

        if (errors) {
          this.sendFailure(400, 'validationError', errors, resolve);
          return;
        }
        resolve({});
      })();
    } catch (error) {
      resolve(error);
    };
  });
};
