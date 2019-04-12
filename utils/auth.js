const { OAuth2Client } = require('google-auth-library');
const { GOOGLE_CLIENT_ID } = process.env;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const core = require('../api/internal/core');
const WHITELIST_DOMAINS = ['gpmail.org'];

module.exports = async function (request, response, next) {
  try {
    if (request.path !== '/health') {
      const { authorization } = request.headers;
      if (!authorization) {
        core.sendUnauthorizedResponse('You must send an Authorization header', response);
        return;
      }

      const [authType, token] = authorization.trim().split(' ');
      if (authType !== 'Bearer') {
        core.sendUnauthorizedResponse('Expected a Bearer token', response);
        return;
      }

      // https://developers.google.com/identity/sign-in/web/backend-auth
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      const googleId = payload['sub'];
      const domain = payload['hd'];

      if (WHITELIST_DOMAINS.indexOf(domain) === -1) {
        core.sendUnauthorizedResponse('Invalid domain', response);
        return;
      }

      core.debug(`Received API request from ${googleId}`);
      request.googleId = googleId;
    }

    next();
  } catch (error) {
    core.debug(error.message);
    if (error.message.indexOf('Token used too late') !== -1) {
      core.sendUnauthorizedResponse('Token expired', response);
      return;
    }
    next(error.message);
  }
};
