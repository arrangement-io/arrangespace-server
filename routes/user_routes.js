module.exports = function (app) {
  let userController = require('../controllers/user_controller');

  app.route('/users')
    .get(userController.getUsers);

  app.route('/users/:id')
    .get(userController.getUser);

  app.route('/users/:id/arrangements')
    .get(userController.getUserArrangements);
};
