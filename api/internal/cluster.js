const core = require('./core');
const turf = require('@turf/turf');
const NodeGeocoder = require('node-geocoder');
const GeoJSON = require('geojson');
const { GOOGLE_MAPS_API_KEY } = process.env;
const defaultOpts = {
  includePolygon: true,
  optimizeSpace: true, // Use as few cars as possible
  optimizeComfort: false, // Use as many cars as possible
  optimizeSize: false // Fill up cars as much as possible
};
const polyProps = [
  { fill: '#00ffff', stroke: '#0000ff' },
  { fill: '#ff0000', stroke: '#800000' },
  { fill: '#00ff00', stroke: '#008000' },
  { fill: '#ffff00', stroke: '#ffff00' },
  { fill: '#ff00ff', stroke: '#800080' }
];

//  Makes the assumption that each cluster will fit into a car. If not, UI
//    should show error for that particular space, which the user can take action on.
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
        let body = request.body;
        let options = { ...defaultOpts, ...body.options };

        // Geocode human readable addresses into latitude and longitude
        let data = await toCoordinates(body.items);

        // Batch function to turn array of objects with geometry data into geoJSON points.
        let points = GeoJSON.parse(data, { Point: ['lat', 'lng'] });
        // let points = turf.randomPoint(21, { bbox: [-180, -90, 180, 90] })

        /**
        DETERMINE K-VALUE
        */

        let k = null;
        // Set k to # of containers available
        if (options.optimizeComfort) {
          k = body.containers.length;
        } else if (options.optimizeSpace) {
          // Set k to minimum # of containers needed for total # of items.
          // Fill up biggest containers first
          let descArrayOfContainers = body.containers.sort((a, b) => b.size - a.size);
          let x = 1;
          let totalSpace = descArrayOfContainers[0].size;

          while (body.items.length > totalSpace) {
            if (descArrayOfContainers[x]) {
              totalSpace += descArrayOfContainers[x].size;
              x++;
            } else {
              core.sendFailure(400, 'badRequest', 'You do not have enough containers!', resolve);
              break;
            }
          }
          k = x;
        } else if (options.optimizeSize) {
          // Fill up car size with items closest to each other
          resolve({});
          return;
        }

        // Safety catch
        if (k > body.containers.length) {
          k = body.containers.length;
        }

        /**
        CREATE THE CLUSTERS
        */

        // Returns geoJSON FeatureCollection
        let clustered = clustersKMeans(points, k);
        if (!clustered) {
          core.sendFailure(500, 'unknownError', 'Could not geocluster given locations.', resolve);
        }

        results.feature_collection = clustered;

        let clustersResult = parseClustered(clustered);

        // Add polygon features to FeatureCollection
        if (options.includePolygon) {
          let polygons = polygonsFromClustered(clustered);
          if (polygons) {
            polygons.forEach((currentPolygon) => {
              results.feature_collection.features.push(currentPolygon);
            });
          }
        }
        results.clusters = clustersResult;

        /**
        SORT CLUSTERS INTO CONTAINERS
        */

        // Sort biggest clusters into biggest cars
        results.containers = sortIntoCars(clustersResult, body.containers);

        resolve(results);
      })();
    } catch (error) {
      core.error(error);
      core.resolveCatchError(error, resolve);
    }
  });
};

function clustersKMeans (points, kMeans) {
  let options = { numberOfClusters: kMeans };

  // Magic clustering algorithm
  return turf.clustersKmeans(points, options);
}

// Parse a feature collection and create object with clusters mapped to items
function parseClustered (clustered) {
  let results = {};
  let collection = [];
  turf.clusterEach(clustered, 'cluster', function (cluster, clusterValue, currentIndex) {
    let clusterContents = [];

    turf.featureEach(cluster, function (currentFeature, featureIndex) {
      let item = {};
      let geoCoords = currentFeature.geometry.coordinates;
      item._id = currentFeature.properties._id;
      item.name = currentFeature.properties.name;
      item.cluster = currentIndex;
      // We want [lat, lng]. Don't mutate original.
      item.coordinates = geoCoords.slice().reverse();
      clusterContents.push(item);
    });

    collection.push(clusterContents);
  });
  results.size = collection.length;
  results.results = collection;
  return results;
}

function polygonsFromClustered (clustered) {
  let result = [];
  turf.clusterEach(clustered, 'cluster', function (cluster, clusterValue, currentIndex) {
    let coords = turf.coordAll(cluster);
    let props = null;
    if (polyProps[currentIndex]) {
      props = { ...{ cluster: clusterValue, 'stroke-width': 1 }, ...polyProps[currentIndex] };
    } else {
      props = { ...{ cluster: clusterValue, 'stroke-width': 1 }, ...polyProps[4] };
    }

    // let props = { cluster: clusterValue };
    let shape = null;
    if (coords.length >= 3) {
      // First and last coordinates must be the same to make a linear "ring"
      coords.push(coords[0]);
      shape = turf.polygon([coords], props);
    } else if (coords.length === 2) {
      shape = turf.lineString(coords, props);
    }

    if (shape) {
      result.push(shape);
    }
  });
  return result;
}

function sortIntoCars (clusters, containers) {
  // Descending order
  let sortedClusters = clusters.results.sort((a, b) => b.length - a.length);
  let sortedContainers = containers.sort((a, b) => b.size - a.size);

  sortedContainers.forEach((currentContainer, i) => {
    if (sortedClusters[i]) {
      currentContainer.cluster = sortedClusters[i];
    }
  });

  return sortedContainers;
};

function toCoordinates (data) {
  return new Promise(resolve => {
    try {
      (async () => {
        let geocodeOptions = {
          provider: 'google',
          apiKey: GOOGLE_MAPS_API_KEY,
          formatter: null
        };
        let geocoder = NodeGeocoder(geocodeOptions);
        let res = await geocoder.batchGeocode(data);

        for (let result of res) {
          let resultToDataIndex = res.indexOf(result);
          data[resultToDataIndex].lat = result.value['0'].latitude;
          data[resultToDataIndex].lng = result.value['0'].longitude;
        }

        resolve(data);
      })();
    } catch (error) {
      core.error(error);
      core.resolveCatchError(error, resolve);
    }
  });
}
