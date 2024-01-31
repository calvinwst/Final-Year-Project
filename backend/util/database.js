// const mongoose = require('mongoose');
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

const uri = process.env.MONGO_URI;

console.log(typeof uri);

// "mongodb+srv://wong25472:<password>@fypdb.9rfeakd.mongodb.net/?retryWrites=true&w=majority";
const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://wong25472:kr56ifbLI@fypdb.9rfeakd.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected!");
      callback(client);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
