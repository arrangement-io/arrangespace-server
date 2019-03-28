module.exports = function (request, response, next) {
  // TODO: Check if user is logged in
  console.log('Full perm mode...');
  next();
};
