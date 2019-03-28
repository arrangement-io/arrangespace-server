var MongoClient = require('mongodb').MongoClient;
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
  // TODO: Make DB call
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
