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

exports.getUser = function (userId, user) {
  try {
    return new Promise(resolve => {
      User.findOne({ '_id': ObjectId(userId) }, function (err, user) {
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
        resolve(docs);
      });
    });
  } catch (error) {
    console.log(error);
  }
};
