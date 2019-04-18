const core = require('../api/internal/core');
let updateResourceHandlers = {};

exports.registerResourceHandlers = function () {
  updateResourceHandlers = {
    '_id': this.updateResourceById,
    'googleId': this.updateResourceByGoogleId
  };
};

exports.getResource = function (model, query, request = null) {
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

        model.findOne(query, function (error, objects) {
          if (error) {
            resolve(error);
          } else if (!objects || Object.keys(objects).length === 0) {
            resolve({});
          } else {
            resolve(objects);
          }
        });
      } catch (error) {
        core.resolveCatchError(error.stack, resolve);
      };
    })();
  });
};

exports.getResources = function (model, query, request) {
  return new Promise(resolve => {
    (async () => {
      try {
        let results = await core.validateGetRequest(model, request);
        // Failed validation
        if (results.error) {
          resolve(results);
          return;
        }

        model.find(query).toArray(function (error, objects) {
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

exports.updateResource = function (model, payload, key, request) {
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
