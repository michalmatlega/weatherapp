var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


/* GET home page. */
router.get('/', function(req, res, next) {
	

	MongoClient.connect(process.env.MONGODB_URI)
  				.then(function (db) { // <- db as first argument
    			getCurrentWeather(db, function(currentWeather) {
			    	db.close();
			    	//res.send(currentWeather);
                    res.render('index', currentWeather);
			  	});
  			})
  			.catch(function (err) {
  				console.log(err);
  			});

 	
});

var getCurrentWeather = function(db, callback) {

  var collection = db.collection('weather');

  collection.findOne(
    {},{sort: [['_id', -1]]}
  , function(err, result) {
    assert.equal(err, null);
    console.log("Fetched a weather data.");
    callback(result);
  });
}

module.exports = router;
