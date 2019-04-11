const core = require('./core');
const sort = require('fast-sort');
const turf = require('@turf/turf');
const NodeGeocoder = require('node-geocoder');
const GeoJSON = require('geojson');
const { GOOGLE_MAPS_API_KEY } = process.env;

/**
  Returns
  {
    feature_collection: FeatureCollection,
    clusters: {
      "0": Array of Location Objects,
      "1": Array of Location Objects
    },
    cars: Array of Car Objects with assigned cluster
  }

  Makes the assumption that each cluster will fit into a car. If not, UI
  should show error for that particular space, which the user can take action on.
*/
exports.create = function (request) {
  return new Promise(resolve => {
    (async () => {
      let results = await getClusters(request);

      resolve(results);
    })();
  });
};

function getClusters (request) {
  return new Promise(resolve => {
    try {
      (async () => {
        let results = {};
        let geocodeOptions = {
          provider: 'google',
          apiKey: GOOGLE_MAPS_API_KEY,
          formatter: null
        };
        let body = request.body;
        let data = body.items;

        // Geocode human readable addresses into latitude and longitude
        let geocoder = NodeGeocoder(geocodeOptions);
        geocoder.batchGeocode(data, function (err, res) {
          if (err) {
            core.error(err);
            core.sendFailure(500, 'unknownError', 'Could not geocode provided addresses.', resolve);
            return;
          }
          for (let result of res) {
            let resultToDataIndex = res.indexOf(result);
            data[resultToDataIndex].lat = result.value['0'].latitude;
            data[resultToDataIndex].lng = result.value['0'].longitude;
          }

          let points = GeoJSON.parse(data, { Point: ['lat', 'lng'] });
          let options = { numberOfClusters: body.containers.length };
          // Magic clustering algorithm
          let clusters = turf.clustersKmeans(points, options);

          // geoJSON FeatureCollection
          results.feature_collection = clusters;
          results.clusters = {};

          // Each location is a feature
          for (let feature of clusters.features) {
            let clusterId = feature.properties.cluster;
            let locationId = feature.properties._id;
            let locationCoords = feature.geometry.coordinates;
            let locationObject = {
              _id: locationId,
              coordinates: locationCoords
            };

            /**
            "clusters":{
            "0":[
               {
                  "id":"zfekidfe",
                  "coordinates":[
                     37.76761219999999,
                     -122.2513694
                  ]
               }
            ]
            */
            if (!results.clusters[clusterId]) {
              results.clusters[clusterId] = [];
            }

            results.clusters[clusterId].push(locationObject);
          }

          /**
          "cars":[
            {
              "name": "Bryan Van",
              "size": 8,
              "_id": "iH34RhRuY",
              "cluster": [
                {
                  "_id":"abcdefgh",
                  "coordinates": [
                    37.7379044,
                    -122.2394204
                  ]
                },
                {
                  "_id":"jjiefjsk",
                  "coordinates": [
                    37.73955,
                    -122.2329
                  ]
                },
                {
                  "_id":"llblah",
                  "coordinates": [
                    37.7336545,
                    -122.2327653
                  ]
                }
              ]
            }
          ]
          */
          results.containers = sortIntoCars(results.clusters, body.containers);

          let includePolygon = true;
          if (Object.keys(body).includes('options') && body.options.includePolygon === false) {
            includePolygon = false;
          }

          // Include polygon feature in FeatureCollection to group location markers.
          //    If cluster only has 2 locations, then return a lineString feature.
          //    If cluster only has 1 location, then return null.
          if (includePolygon) {
            for (const [clusterId, contents] of Object.entries(results.clusters)) {
              let polygon = polygonFromCluster(clusterId, contents);
              if (polygon) {
                results.feature_collection.features.push(polygon);
              }
            }
          }

          resolve(results);
        });
      })();
    } catch (error) {
      core.error(error);
      core.resolveCatchError(error, resolve);
    }
  });
};

function polygonFromCluster (clusterId, cluster) {
  if (cluster.length >= 3) {
    let coords = [];
    for (let loc of cluster) {
      coords.push(loc.coordinates);
    }
    // First and last coordinates must be the same to make a linear "ring"
    coords.push(coords[0]);
    return turf.polygon([coords], { cluster: clusterId });
  } else if (cluster.length === 2) {
    return turf.lineString([cluster[0].coordinates, cluster[1].coordinates], { cluster: clusterId });
  }
}

function sortIntoCars (clusterDict, cars) {
  let clusterSizeObject = [];
  for (const [cluster, contents] of Object.entries(clusterDict)) {
    // Intermediate object mapping clusterId to cluster size
    let object = {
      clusterId: cluster,
      size: contents.length
    };
    clusterSizeObject.push(object);
  }

  // Sort biggest clusters into biggest cars
  let sortedCars = sortArrayOfObjects(cars);
  let sortedClusters = sortArrayOfObjects(clusterSizeObject);

  sortedCars.forEach((car, i) => {
    let clusterIdMap = sortedClusters[i].clusterId;
    car.cluster = clusterDict[clusterIdMap];
  });

  return sortedCars;
};

// Sort objects in array by size value
function sortArrayOfObjects (array) {
  sort(array).desc(o => o.size);
  return array;
}
