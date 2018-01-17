require('dotenv').load();

let express = require('express');
let app = express();

let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

let bodyParser = require('body-parser');
let config = require('./config/config');

let port = 3000;

let stat = require('./routes/stat');

let options = { useMongoClient: true };

if(process.env.NODE_ENV === "test"){
  mongoose.connect(config.TEST_DATABASE_URI, options);
} else {
  mongoose.connect(config.DEV_DATABASE_URI, options);
}

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

app.route('/courses/:courseId').post(stat.createStat);

app.listen(port);
console.log("Listening on port " + port);

module.exports = app;
