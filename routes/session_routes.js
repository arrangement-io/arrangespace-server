module.exports = function (app) {
  let sessionController = require('../controllers/session_controller');

  app.route('/login')
    .post(sessionController.logIn);

  app.route('/logout')
    .post(sessionController.logOut);
};
