let mongoose = require('mongoose');
let moment = require('moment');


// mongoose.connect('mongodb://heroku_n0ph7jfg:mr65n0aancsfng9gkl2qkc3ehp@ds119220.mlab.com:19220/heroku_n0ph7jfg');
//
// let DayRecord = mongoose.model('DayRecord', {
//    type: String,
//    value: String,
//    date: Date
// });
//
// var dayRecord = new DayRecord({
//    type: 'temperature',
//     value: 30,
//     day: 99999
//
// });

// dayRecord.save((err) => {
//     if (err) mongoose.disconnect();
//     mongoose.disconnect();
// });



let getMaxTempForDay = function(day){       //example 2018
    let start = moment(day).unix();
    let end = moment(day).add(1, 'days').unix();
    console.log(start,end);
}

getMaxTempForDay('2018-04-01');