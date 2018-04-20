let express = require('express');
let router = express.Router();
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');


/* GET home page. */
router.get('/', function(req, res, next) {
	

	MongoClient.connect(process.env.MONGODB_URI)
  				.then(function (client) { // <- db as first argument
                    let db = client.db();
    			getCurrentWeather(db, function(currentWeather) {
			    	//res.send(currentWeather);
                    res.render('index', currentWeather);
			  	});
  			})
  			.catch(function (err) {
  				console.log(err);
  			});

 	
});

let getCurrentWeather = function(db, callback) {

  let collection = db.collection('weather');

  collection.findOne(
    {},{sort: [['_id', -1]]}
  , function(err, result) {
    assert.equal(err, null);
    console.log("Fetched a weather data.");
    callback(result);
  });
}

module.exports = router;
