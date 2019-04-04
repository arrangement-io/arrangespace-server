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

// TODO: Check for foreign fields
exports.validatePostRequest = function (model, request) {
  return new Promise(resolve => {
    try {
      (async () => {
        // TODO: Use schemas
        // let userSchema = request.check(schema)
        if (model.collectionName === 'users') {
          request.checkBody('access_token', 'access_token is required').notEmpty();
          request.checkBody('user_data', 'user_data is required').notEmpty();
          request.checkBody('user_data.googleId', 'googleId is required').notEmpty();
          request.checkBody('user_data.imageUrl', 'imageUrl is required').notEmpty();
          request.checkBody('user_data.email', 'email is required').notEmpty();
          request.checkBody('user_data.name', 'name is required').notEmpty();
          request.checkBody('user_data.givenName', 'givenName is required').notEmpty();
          request.checkBody('user_data.familyName', 'familyName is required').notEmpty();
        } else if (model.collectionName === 'arrangement') {
          request.checkBody('_id', '_id is required').notEmpty();
          request.checkBody('containers', 'containers is required').exists();
          request.checkBody('is_deleted', 'is_deleted is required').notEmpty();
          request.checkBody('items', 'items is required').exists();
          request.checkBody('modified_timestamp', 'modified_timestamp is required').notEmpty();
          request.checkBody('name', 'name is required').notEmpty();
          request.checkBody('owner', 'owner is required').notEmpty();
          request.checkBody('snapshots', 'snapshots is required').notEmpty();
          request.checkBody('timestamp', 'timestamp is required').notEmpty();
          request.checkBody('user', 'user is required').notEmpty();
          request.checkBody('users', 'users is required').notEmpty();
        }

        var errors = request.validationErrors();
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
