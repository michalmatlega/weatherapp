let mongoose = require('mongoose');
let moment = require('moment');
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URI);
//
let Weather = mongoose.model('Weather',{
    latitude: Number,
    longitude: Number,
    timezone: String,
    offset: Number,
    currently: {
        time: Number,
        summary: String,
        icon: String,
        precipIntensity: Number,
        precipProbability: Number,
        precipType: String,
        temperature: Number,
        apparentTemperature: Number,
        dewPoint: Number,
        humidity: Number,
        windSpeed: Number,
        windBearing: Number,
        cloudCover: Number,
        pressure: Number,
        ozone: Number

        }
    }, 'weather'
);

let DayRecord = mongoose.model('DayRecord', {
   type: String,
   value: Number,
   time: String,
    day: String
});
//
// let dayRecord = new DayRecord({
//     type: 'temperature',
//     value: 30,
//
//
//
// });
//
// dayRecord.save((err) => {
//     if (err){
//         console.log(err);
//         mongoose.disconnect();
//     }
//     console.log('saved!');
//     mongoose.disconnect();
// });



let getMaxTempForDay = function(day){       //example 2018
    let start = moment(day).unix();
    let end = moment(day).add(1, 'days').unix();

    Weather.findOne({})
        .where('currently.time')
        .gt(start)
        .lt(end)
        .sort({'currently.temperature': -1})
        .exec((err, value) => {
            if (err) console.log(err);
            //console.log(value);

            if(value){
                let dayRecord = new DayRecord({
                    type: 'maxTemperature',
                    value: value.currently.temperature,
                    time: value.currently.time,
                    day: day
                });

                dayRecord.save().then(() => {
                    console.log(`Max temperature day ${day} saved.`)
                    //mongoose.disconnect();
                }).catch((err) => {
                    console.log(err);
                    //mongoose.disconnect();
                });
            }




        });

    //console.log(start,end);
}

let daysOfYear = [];
let start = moment('2018-04-01');
for (let d = start; d.isBefore(); d + d.add(1, 'days')) {
    let tmp = moment(d);
    daysOfYear.push(tmp);
}

//console.log(daysOfYear);


daysOfYear.forEach((day) => {
    getMaxTempForDay(day);
});

//getMaxTempForDay('2018-04-01');
