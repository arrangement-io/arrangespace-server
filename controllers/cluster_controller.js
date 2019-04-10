let core = require('../api/internal/core');
const turf = require('@turf/turf');
const NodeGeocoder = require('node-geocoder');
const GeoJSON = require('geojson');
const { GOOGLE_MAPS_API_KEY } = process.env;

exports.getClusters = function (request, response) {
  let geocodeOptions = {
    provider: 'google',
    apiKey: GOOGLE_MAPS_API_KEY,
    formatter: null
  };
  let body = {
    cars: 2,
    locations: [
      { name: 'David Home', address: '2038 Central Ave', zipcode: '94501' },
      { name: 'Safeway', address: '867 Island Dr', zipcode: '94502' },
      { name: 'Corica Park Golf Course', address: '1 Clubhosue Memorial Rd', zipcode: '94502' },
      { name: 'Godfrey Park', address: '281 Beach Rd', zipcode: '94502' }
    ]
  };
  let data = body.locations;

  let geocoder = NodeGeocoder(geocodeOptions);
  geocoder.batchGeocode(data, function (err, res) {
    if (err) {
      response.status(500).json(err);
    }
    for (let result of res) {
      let resultToDataIndex = res.indexOf(result);
      data[resultToDataIndex].lat = result.value['0'].latitude;
      data[resultToDataIndex].lng = result.value['0'].longitude;
    }

    let points = GeoJSON.parse(data, { Point: ['lng', 'lat'] });
    let options = { numberOfClusters: body.cars };
    let clusters = turf.clustersKmeans(points, options);
    core.sendResponse(clusters, response);
  });
};
