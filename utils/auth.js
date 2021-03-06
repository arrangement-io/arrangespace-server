const core = require('../api/internal/core');

module.exports = async function (request, response, next) {
  try {
    if (request.path !== '/health' && request.path !== '/auth/google') {
      if (request.isAuthenticated()) {
        next();
      } else {
        request.logout();
        response.clearCookie('connect.sid');
        core.sendUnauthorizedResponse('Not Logged In', response);
      }
    }
  } catch (error) {
    core.debug(error.message);
    if (error.message.indexOf('Token used too late') !== -1) {
      request.logout();
      response.clearCookie('connect.sid');
      core.sendUnauthorizedResponse('Token expired', response);
      return;
    }
    next(error.message);
  }
};
