let api = require('../api/arrangement_api');
let core = require('../api/internal/core');

exports.createArrangement = function (request, response) {
  let arrangementId = request.params.id;
  let payload = request.body;

  api.doesArrangementExist(arrangementId, request).then(results => {
    console.log(results)
    if (!results.error) {
      console.log('update')
      api.updateArrangement(arrangementId, payload, request, response).then(results => {
        core.sendSuccessResponse(results, response);
      });
    } else {
      console.log('create')
      api.createArrangement(arrangementId, payload, request, response).then(results => {
        core.sendSuccessResponse(results, response);
      });
    }
  });
};

exports.exportArrangement = function (request, response) {
  let arrangementId = request.params.id;
  let exportType = request.params.type;

  api.doesArrangementExist(arrangementId, request).then(exists => {
    if (exists) {
      api.exportArrangement(arrangementId, exportType, request).then(results => {
        response.set('Content-Type', 'text/html');
        response.status(200).send(results);
      });
    } else {
      core.sendResourceNotFound(request, response);
    }
  });
};

exports.getArrangement = function (request, response) {
  let arrangementId = request.params.id;

  api.getArrangement(arrangementId, request).then(results => {
    core.sendResponse(results, response);
  });
};
