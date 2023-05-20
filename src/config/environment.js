const dotenv = require('dotenv');
dotenv.config();

const environment = {
  MONGODB_DATABASE: process.env.MONGODB_DATABASE || '',
  MONGODB_URI: process.env.MONGODB_URI || '',
  PORT: process.env.PORT || 8001,
};

module.exports = environment;
