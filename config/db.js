
/**
Description : The file will take care of the database connectivity 
*/
var bluebird = require("bluebird");
var mongoose = require("mongoose");
mongoose.Promise = bluebird;

//Connecting to local database
mongoose.connect(process.env.MONGO_DB_STRING, {
  user: process.env.MONGO_DB_USERNAME,
  pass: process.env.MONGO_DB_PASSWORD,
  useNewUrlParser: true
});

// Creating mongoose connection instance
var db = mongoose.connection;

// CONNECTION EVENTS

// When successfully scheduleconnected
db.on("connected", function () {
  console.log("Mongoose default connection open");
});

// When the connection is disconnected
db.on("disconnected", function () {
  console.log("Mongoose default connection disconnected");
});

// If the connection throws an error
db.on("error", function (err) {
  console.log("Mongoose default connection error: " + err);
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});