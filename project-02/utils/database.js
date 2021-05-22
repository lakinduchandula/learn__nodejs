const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db; // "_" means that this variable is only use in this file

const mongoConnect = callback => {
  MongoClient.connect(
    "mongodb+srv://lakinduchandula:befUUaXreUAbXmSb@cluster0.fjhfb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
    .then(client => {
      console.log("Connected!");
      _db = client.db;
      callback();
    })
    .catch(err => {
      console.log(err);
    });
};

const getDb = _db => {
  if (_db) {
    return _db;
  }
  throw "Database Not Found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
