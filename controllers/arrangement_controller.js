let api = require('../api/arrangement_api');
let core = require('../api/internal/core');

exports.createArrangement = function (request, response) {
  let arrangementId = request.body._id;
  let arrangement = request.body;

  api.doesArrangementExist(arrangementId).then(exists => {
    if (exists) {
      api.updateArrangement(arrangement).then(results => {
        core.sendSuccessResponse(results, response);
      });
    } else {
      api.createArrangement(arrangement).then(results => {
        core.sendSuccessResponse(results, response);
      });
    }
  });
};

exports.exportArrangement = function (request, response) {
  let arrangementId = request.params.id;
  let exportType = request.params.type;

  api.doesArrangementExist(arrangementId).then(exists => {
    if (exists) {
      api.exportArrangement(arrangementId, exportType, request).then(results => {
        response.set('Content-Type', 'text/html');
        response.status(200).send(results);
      });
    } else {
      core.sendResourceNotFound(request, response)
    }
  });
};

exports.getArrangement = function (request, response) {
  let arrangementId = request.params.id;

  api.getArrangement(arrangementId, request).then(results => {
    if (results) {
      response.status(200).send(JSON.stringify(results));
    } else {
      core.sendResourceNotFound(request, response);
    }
  });
};
