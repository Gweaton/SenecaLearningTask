require('dotenv').load();

let config = require('./config/config');

if(process.env.NODE_ENV === "test"){
  console.log(config.TEST_DATABASE_URI);
} else {
  console.log(config.DEV_DATABASE_URI);
}
