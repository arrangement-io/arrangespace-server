var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
let User = null;
let Arrangement = null;

exports.connect = async function (uri) {
  try {
    let client = await MongoClient.connect(uri, { useNewUrlParser: true });
    let db = client.db(process.env.MONGODB_NAME);
    User = db.collection('users');
    Arrangement = db.collection('arrangement');
  } catch (error) {
    console.log(error);
  }
};

exports.createUser = function (user) {
  let googleId = user.googleId;

  try {
    return new Promise(resolve => {
      User.updateOne({ 'googleId': googleId }, { $set: user }, function (err, user) {
        if (err) {
          console.log(err.stack);
        };
        resolve(user);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getUser = function (userId, request) {
  try {
    return new Promise(resolve => {
      User.findOne({ '_id': ObjectId(userId) }, function (err, user) {
        if (err) {
          console.log(err.stack);
        };
        resolve(user);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getUsers = function (model, request) {
  try {
    return new Promise(resolve => {
      User.find({}).toArray(function (err, docs) {
        if (err) {
          console.log(err.stack);
        };
        resolve(docs);
      });
    });
  } catch (error) {
    console.log(error);
  }
};
