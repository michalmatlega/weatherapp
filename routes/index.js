var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var http = require('http');

var games = [
    'shenzhen-io',
    'undertale',
    'doom'
]


/* GET home page. */
router.get('/', function(req, res, next) {
 	res.send("Howdy! Welcome to Yet Another WeatherApp");

 	
});

router.get('/games', function(req, res, next) {
  var games = getPagesArray();

    Promise.all(
        games.map(loadPage)
    ).then(function(pages){
        return Promise.all(pages.map(getBestPrice))
    }).then(function(render){

        renderr = render.reduce(function(renderr,i){
            return renderr + i;
        },"")

        res.send(renderr);
    });
});

var loadPage = function(options){
    return new Promise(function(resolve, reject){
            http.get(options, function(http_res) {
                var data = "";

                http_res.on("data", function (chunk) {
                    data += chunk;
                });

                http_res.on("end", function () {
                    resolve(data);
                });
        }).on('error', function(e) {
            reject("Got error: " + e.message);
        });
    });
    
}

var getBestPrice = function(data){
    
    return new Promise(function(resolve){
        var render = "";

        var $ = cheerio.load(data);
                
        render += $('.game-title').text() + " ";
        render += $('.local-price-column').eq(1).text();
        render += ' <a href="https://salenauts.com' + $('.price-button').eq(2).attr('href') + '">link</a></br>';

        resolve(render);

    });  
}

var getPagesArray = function(){
    var result;

    result = games.map(function(item){
        var row = [];
        row['host'] = 'salenauts.com';
        row['port'] = 80;
        row['path'] = '/pl/game/' + item +'/';
        return row;
    });

    return result;
}

module.exports = router;
