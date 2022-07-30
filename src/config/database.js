const mongoose = require('mongoose');
const { dbDatabase,dbHost,dbConnection,dbPort,dbUsername,dbPassword } = require('./config');

const connectDb = () => {
  //Set up default mongoose connection
  var mongoDB = `${dbConnection}://${dbUsername+":"}${dbPassword}@${dbHost}:${dbPort}/${dbDatabase}?authMechanism=DEFAULT&authSource=admin`;
  console.log(mongoDB);
  return mongoose.connect(mongoDB);
};

module.exports = {connectDb}
