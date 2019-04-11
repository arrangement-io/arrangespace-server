const Cluster = require('./internal/cluster');

exports.createClusters = function (request) {
  return new Promise(resolve => {
    Cluster.create(request).then(results => {
      resolve(results);
    });
  });
};
