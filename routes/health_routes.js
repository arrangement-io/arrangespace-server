module.exports = function (app) {
  app.route('/health')
    .get((req, res) => res.send('GOOD'));
};
