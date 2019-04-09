module.exports = function (app) {
  app.route('/health')
    .get((req, res) => res.json({ status: 'UP' }));
};
