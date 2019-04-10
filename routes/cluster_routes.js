module.exports = function (app) {
  let clusterController = require('../controllers/cluster_controller');

  app.route('/clusters')
    .post(clusterController.getClusters);
};
