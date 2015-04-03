var express = require('express');
var router = express.Router();

var JSON = require('JSON');
var request = require('request');

var lat;
var lng;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET map page. */
router.get('/map', function(req, res) {
    res.render('Map', {'lat':lat ,'lng':lng })
});

//Display simple search form
//
router.get('/search', function(req,res,next) {
    res.render('searchForm');
});

//Perform search and display results
//
router.get('/doSearch', function(req,res,next) {
    console.log(req.query);
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + req.query['searchFor'] + '&apikey=AIzaSyBFqrk77tXyJuA98ZVpg1RauApNXkvYwh0';

    request({
        url: url,
        json: true
    }, function(error, response, body){
        if (!error && response.statusCode === 200) {
            lat = body.results[0].geometry.location.lat;
            lng = body.results[0].geometry.location.lng;
            res.redirect('/map')
        }
    });


});
module.exports = router;
