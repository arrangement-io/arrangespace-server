module.exports = function (app) {
  let arrangementController = require('../controllers/arrangement_controller');

  app.route('/arrangement/:id')
    .get(arrangementController.getArrangement);

  // TODO: Change to /arrangement/:id
  app.route('/arrangement')
    .post(arrangementController.createArrangement);

  app.route('/arrangement/:id/export/:type')
    .get(arrangementController.exportArrangement);
};
