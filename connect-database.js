var mongoose = require('mongoose');
var config_default = require('./config/config');
// import config_default from "./config/config"
var connection = null;

function establishConnection() {
  if(!connection) {
    mongoose.connect(config_default.env.mongoDBUri, {})
    .then(databaseConnection => {
      connection = databaseConnection
      console.log('Connected to Database..!!')
    })
    .catch(err => {
      connection = null;
      console.log(err)
    })
  }
};

module.exports = {
  establishConnection,
  connection
};
