var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var db = require('./database/db');
var request = require('request'); //used to get html


const app = express();

const port = 8000;

app.use(bodyParser.urlencoded({extended: true}));

MongoClient.connect(db.url, (err, database) =>{
	if (err) return console.log(err)
	var db = database.db("massdrop")
	require('./app/routes')(app, database);
	app.listen(port, () => {
	});

})

module.exports = app;