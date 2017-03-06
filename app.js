var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cron = require('node-cron');

var config = require('./config');

var DarkSky = require('dark-sky');
var forecast = new DarkSky(process.env.DARKSKY_KEY);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');




var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var task = cron.schedule('*/2 * * * *', function(){
  forecast
	    .latitude('49.7999')            
	    .longitude('18.7878') 
	    .exclude('minutely,hourly,daily,alerts,flags')    
	    .units('si')
	    .get()                          
	    .then(res => {                 
	        MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
			  assert.equal(null, err);
			  console.log("Connected successfully to server");
			  insertDocuments(db, res, function() {
			    db.close();
			  });
			});
	    })
	    .catch(err => {                 
	        console.log(err)
	    })
});

task.start();




var insertDocuments = function(db, data, callback) {
  // Get the documents collection
  var collection = db.collection('weather');
  // Insert some documents
  collection.insertOne(
    data
  , function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a weather data.");
    callback(result);
  });
}

module.exports = app;
