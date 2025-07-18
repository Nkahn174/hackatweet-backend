const mongoose = require('mongoose');

// const connectionString = process.env.CONNECTION_STRING;

const connectionString='mongodb+srv://nicolascallaghan:RNfXlWUwO2Ymow1p@cluster0.2wp4bta.mongodb.net/hackatweet'

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));
