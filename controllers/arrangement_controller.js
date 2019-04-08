let api = require('../api/arrangement_api');
let core = require('../api/internal/core');

exports.createArrangement = function (request, response) {
  let arrangementId = request.params.id;
  let payload = request.body;

  api.createArrangement(arrangementId, payload, request, response).then(results => {
    core.sendResponse(results, response);
  });
};

exports.exportArrangement = function (request, response) {
  let arrangementId = request.params.id;
  let exportType = request.params.type;

  api.doesArrangementExist(arrangementId, request).then(results => {
    if (Object.keys(results).length > 0) {
      if (results.owner !== request.googleId) {
        core.sendUnauthorizedResponse(response);
        return;
      }

      api.exportArrangement(arrangementId, exportType, request).then(results => {
        core.sendSuccessHtmlResponse(results, response);
      });
    } else {
      core.sendResourceNotFound(request, response);
    }
  });
};

exports.getArrangement = function (request, response) {
  let arrangementId = request.params.id;

  api.getArrangement(arrangementId, request).then(results => {
    if (Object.keys(results).length > 0) {
      if (results.owner !== request.googleId) {
        core.sendUnauthorizedResponse(response);
        return;
      }
    }

    core.sendResponse(results, response);
  });
};
