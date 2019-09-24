let core = require('../api/internal/core');
let api = require('../api/cluster_api');

exports.createClusters = function (request, response) {
  api.createClusters(request).then(results => {
    core.sendResponse(results, response);
  });
};
