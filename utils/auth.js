module.exports = async function (request, response, next) {
  try {
    const { authorization } = request.headers;
    if (!authorization) throw new Error('You must send an Authorization header');
    
    const [authType, token] = authorization.trim().split(' ');
    if (authType !== 'Bearer') throw new Error('Expected a Bearer token');
    
    // TODO: Verify id token
    // https://developers.google.com/identity/sign-in/web/backend-auth
    console.log(token);
    next();
  } catch (error) {
    next(error.message);
  }
};
