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

exports.getResource = function (model, resourceId, request = null, key = '_id') {
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
            resolve(null);
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
          if (error) {
            resolve(error);
          } else if (!objects || objects.length === 0) {
            resolve([]);
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
        if (error) {
          resolve(error);
        } else if (!objects || Object.keys(objects).length === 0) {
          resolve({});
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
        if (error) {
          resolve(error);
        } else if (!objects || Object.keys(objects).length === 0) {
          resolve({});
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
        if (error) {
          resolve(error);
        } else if (!objects || objects.length === 0) {
          resolve([]);
        } else {
          resolve(objects);
        }
      });
    } catch (error) {
      resolve(null);
    }
  });
};

// TODO: Combine both update handlers to use single filter parameter
exports.updateResourceByGoogleId = function (model, payload) {
  return new Promise(resolve => {
    try {
      model.findOneAndUpdate({ googleId: payload.user_data.googleId }, { $set: payload.user_data }, { upsert: true }, function (error, objects) {
        if (error) {
          core.sendFailure(500, 'unknownError', error.stack, resolve);
        } else {
          resolve(payload);
        }
      });
    } catch (error) {
      resolve(null);
    }
  });
};

exports.updateResourceById = function (model, payload) {
  return new Promise(resolve => {
    try {
      model.findOneAndUpdate({ _id: payload._id }, { $set: payload }, { upsert: true }, function (error, objects) {
        if (error) {
          core.sendFailure(500, 'unknownError', error.stack, resolve);
        } else {
          resolve(payload);
        }
      });
    } catch (error) {
      resolve(null);
    }
  });
};
