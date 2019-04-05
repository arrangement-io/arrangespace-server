module.exports = function (app) {
  let arrangementController = require('../controllers/arrangement_controller');

  app.route('/arrangement/:id')
    .get(arrangementController.getArrangement);

  app.route('/arrangement/:id')
    .post(arrangementController.createArrangement);

  app.route('/arrangement/:id/export/:type')
    .get(arrangementController.exportArrangement);
};
