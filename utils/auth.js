const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('206945578523-0h8t8i7k5d09j0vg31ncspa4pbrddff6.apps.googleusercontent.com');

module.exports = async function (request, response, next) {
  try {
    const { authorization } = request.headers;
    if (!authorization) throw new Error('You must send an Authorization header');

    const [authType, token] = authorization.trim().split(' ');
    if (authType !== 'Bearer') throw new Error('Expected a Bearer token');

    // https://developers.google.com/identity/sign-in/web/backend-auth
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '206945578523-0h8t8i7k5d09j0vg31ncspa4pbrddff6.apps.googleusercontent.com'
    });

    const payload = ticket.getPayload();
    const googleId = payload['sub'];

    request.googleId = googleId;
    console.log(`API request from ${googleId}`);
    next();
  } catch (error) {
    next(error.message);
  }
};
