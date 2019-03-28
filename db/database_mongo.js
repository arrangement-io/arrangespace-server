let mongoose = require('mongoose');

exports.connect = function (host, port, dbName) {
  let db = 'mongodb://' + host + port + '/' + dbName;
  mongoose.connect(db, { useNewUrlParser: true });
};

exports.createUser = function (user) {
  // TODO: Make DB call
};

exports.getUsers = function () {
  // TODO: Make DB call
};
