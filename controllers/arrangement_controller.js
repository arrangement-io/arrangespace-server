let api = require('../api/arrangement_api');

exports.createArrangement = function (request, response) {
  let arrangementId = request.body._id;
  let arrangement = request.body;

  api.doesArrangementExist(arrangementId).then(exists => {
    response.set('Content-Type', 'text/plain');
    if (exists) {
      api.updateArrangement(arrangement).then(results => {
        response.status(200).send(JSON.stringify(results));
      });
    } else {
      api.createArrangement(arrangement).then(results => {
        response.status(200).send(JSON.stringify(results));
      });
    }
  });
};

exports.getArrangement = function (request, response) {
  let arrangementId = request.params.id;

  api.getArrangement(arrangementId, request).then(results => {
    response.set('Content-Type', 'text/plain');
    if (results) {
      response.status(200).send(JSON.stringify(results));
    } else {
      let results = {
        'arrangement': 'no arrangement found'
      };
      response.status(404).send(JSON.stringify(results));
    }
  });
};
