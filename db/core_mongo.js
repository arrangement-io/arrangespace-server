const core = require('../api/internal/core');
let getResourceHandlers = {};
let updateResourceHandlers = {};

exports.registerResourceHandlers = function () {
  getResourceHandlers = {
    '_id': this.getResourceById,
    'owner': this.getResourceByOwner,
    'googleId': this.getResourceByGoogleId
  };
  updateResourceHandlers = {
    '_id': this.updateResourceById,
    'googleId': this.updateResourceByGoogleId
  };
};

exports.getResource = function (model, resourceId, request=null, key = '_id') {
  return new Promise(resolve => {
    (async () => {
      try {
        if (request) {
          let results = await core.validateGetRequest(model, request);
          // Failed validation
          if (results.error) {
            resolve(results);
            return;
          }
        }

        let resourceHandler = getResourceHandlers[key];
        let object = await resourceHandler(model, resourceId, request);
        resolve(object);
      } catch (error) {
        core.resolveCatchError(error.stack, resolve);
      };
    })();
  });
};

exports.createResource = function (model, resourceId, payload, request) {
  return new Promise(resolve => {
    (async () => {
      try {
        let results = await core.validatePostRequest(model, request);
        // Failed validation
        if (results.error) {
          resolve(results);
          return;
        }

        model.insertOne(payload, function (error, objects) {
          if (error) {
            resolve(error);
          } else if (objects.insertedCount === 1) {
            resolve({});
          } else {
            // TODO: throw error
          }
        });
      } catch (error) {
        core.resolveCatchError(error.stack, resolve);
      }
    })();
  });
};

exports.updateResource = function (model, payload, key = '_id', request) {
  return new Promise(resolve => {
    (async () => {
      try {
        let results = await core.validatePostRequest(model, request);
        // Failed validation
        if (results.error) {
          resolve(results);
          return;
        }

        let resourceHandler = updateResourceHandlers[key];
        let object = await resourceHandler(model, payload);
        resolve(object);
      } catch (error) {
        core.resolveCatchError(error.stack, resolve);
      };
    })();
  });
};

exports.getAllResources = function (model, request) {
  return new Promise(resolve => {
    (async () => {
      try {
        let results = await core.validateGetRequest(model, request);
        // Failed validation
        if (results.error) {
          resolve(results);
          return;
        }

        model.find({}).toArray(function (error, objects) {
          if (error || !objects) {
            resolve(null);
          } else {
            resolve(objects);
          }
        });
      } catch (error) {
        core.resolveCatchError(error.stack, resolve);
      }
    })();
  });
};

exports.getResourceById = function (model, resourceId, request) {
  return new Promise(resolve => {
    try {
      model.findOne({ _id: resourceId }, function (error, objects) {
        if (error || !objects) {
          core.resolveFailure404(model, resourceId, resolve);
        } else {
          resolve(objects);
        }
      });
    } catch (error) {
      resolve(null);
    }
  });
};

exports.getResourceByGoogleId = function (model, resourceId, request) {
  return new Promise(resolve => {
    try {
      model.findOne({ googleId: resourceId }, function (error, objects) {
        if (error || !objects) {
          // return empty results not an error if objects is empty
          core.resolveFailure404(model, resourceId, resolve);
        } else {
          resolve(objects);
        }
      });
    } catch (error) {
      resolve(null);
    }
  });
};

exports.getResourceByOwner = function (model, resourceId, request) {
  return new Promise(resolve => {
    try {
      model.find({ owner: resourceId }).toArray(function (error, objects) {
        if (error || !objects) {
          core.resolveFailure404(model, resourceId, resolve);
        } else {
          resolve(objects);
        }
      });
    } catch (error) {
      resolve(null);
    }
  });
};

// Find by googleId and if does not exist then create
exports.updateResourceByGoogleId = function (model, payload) {
  return new Promise(resolve => {
    try {
      model.updateOne({ googleId: payload.user_data.googleId }, { $set: payload.user_data }, { upsert: true }, function (error, objects) {
        if (error || !objects) {
          core.resolveFailure404(model, payload.user_data.googleId, resolve);
        } else {
          resolve({});
        }
      });
    } catch (error) {
      resolve(null);
    }
  });
};

// Find by _id and if does not exist then create
// TODO: updateOne fails if finding by _id and request has _id as well
exports.updateResourceById = function (model, payload) {
  return new Promise(resolve => {
    try {
      model.updateOne({ _id: payload._id }, { $set: payload }, { upsert: true }, function (error, objects) {
        if (error) {
          core.sendFailure(500, 'mongoError', error.stack, resolve);
          // This is wrong
          // core.resolveFailure404(model, resourceId, resolve);
        } else {
          resolve({});
        }
      });
    } catch (error) {
      resolve(null);
    }
  });
};
