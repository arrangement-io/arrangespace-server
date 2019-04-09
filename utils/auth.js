const { OAuth2Client } = require('google-auth-library');
const { GOOGLE_CLIENT_ID } = process.env;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const core = require('../api/internal/core');
const WHITELIST_DOMAINS = ['gpmail.org'];

module.exports = async function (request, response, next) {
  try {
    const { authorization } = request.headers;
    if (!authorization) throw new Error('You must send an Authorization header');

    const [authType, token] = authorization.trim().split(' ');
    if (authType !== 'Bearer') throw new Error('Expected a Bearer token');

    // https://developers.google.com/identity/sign-in/web/backend-auth
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const googleId = payload['sub'];
    const domain = payload['hd'];

    if (WHITELIST_DOMAINS.indexOf(domain) === -1) {
      let error = {
        error: {
          status: 401,
          reason: 'Unauthorized',
          message: 'Invalid domain'
        }
      };
      core.sendFailureResponse(error, response);
      return;
    }

    request.googleId = googleId;
    next();
  } catch (error) {
    next(error.message);
  }
};
