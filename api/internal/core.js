const USER_FIELDS = [
  'googleId', 'imageUrl', 'email', 'name', 'givenName', 'familyName'
];

exports.sendResourceNotFound = function (request, response) {
  response.status(404);
  let payload = {
    'error': `Could not find resource with id: ${request.params.id}`
  };

  this.setHeaders(response);
  this.sendFailureResponse(payload, response);
};

exports.sendFailureResponse = function (payload, response) {
  this.setHeaders(response);
  response.json(payload);
};

exports.setHeaders = function (response) {
  response.set('Content-Type', 'application/json');
};

exports.sendSuccessResponse = function (results, response) {
  response.status(200);
  this.setHeaders(response);
  response.json(results);
};

exports.sendResponse = function (results, response) {
  if (results.error) {
    this.sendFailureResponse(results, response);
    return;
  }

  this.sendSuccessResponse(results, response);
};

exports.sendFailure = function (status, reason = 'standardError', message, resolve) {
  if (resolve) {
    let results = {
      'error': {
        'status': status,
        'reason': reason,
        'message': message
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

exports.resolveFailure404 = function (model, resourceId, resolve) {
  this.sendFailure(404, 'WRONG', `Could not find ${model.collectionName} with id: ${resourceId}`, resolve);
};

exports.validateGetRequest = function (model, { request, resourceId } = { resourceId: null }) {
  // TODO: Validate headers
  return new Promise(resolve => {
    try {
      (async () => {
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
      })();
    } catch (error) {
      resolve(error);
    };
  });
};

exports.validateCreateUserRequest = function (request) {
  for (let key in request.body) {
    if (key === 'user_data') {
      for (let field in request.body.user_data) {
        if (!USER_FIELDS.includes(field)) {
          return field;
        }
      }
    }
  }
};

exports.validatePostRequest = function (model, { request, resourceId } = { resourceId: null }) {
  return new Promise(resolve => {
    try {
      (async () => {
        if (Object.keys(request.body).length === 0) {
          this.sendFailure(400, 'missingParameters', `This endpoint requires a payload.`, resolve);
          return;
        }

        // Validate request fields
        if (model.collectionName === 'users') {
          let error = this.validateCreateUserRequest(request);
          if (error) {
            this.sendFailure(400, 'invalidParameter', `Unexpected key: ${error}`, resolve);
            return;
          }
        }
        // Passed validation
        resolve({});
      })();
    } catch (error) {
      resolve(error);
    };
  });
};
