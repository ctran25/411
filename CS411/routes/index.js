var express = require('express');
var router = express.Router();
var request = require('request');
var mysql = require('mysql');
var Sequelize = require("sequelize");
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');


var lat;
var lng;
// sequelize initialization
var sequelize = new Sequelize("mysql://root:@localhost:3306/CS411");
// model definition
var Users = sequelize.define("Users", {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    lat: Sequelize.DECIMAL,
    lng: Sequelize.DECIMAL
});



router.post('/create', function(req,res,next) {
    Users.findOne({where: { username: req.body.username }}).then(function(user) {
        console.log(user);
        if (user) {
            res.render('create', { error: 'Username has been taken, please select another.' });
        } else {
            sequelize.sync().then(function (err) {
                Users.create({username: req.body.username, password: req.body.password}).then(function () {
                    res.redirect('/');
                });
            });
        }
    });
});

router.post('/point', function(req,res,next) {
    sequelize.sync().then(function (err) {
        Users.update({lat: req.body.lat, lng: req.body.lng}, {username: req.body.username, password: req.body.password}).then(function () {
        });
    });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/addpoint', function(req, res, next) {
    res.render('addpoint', { title: 'Add Point' });
});

router.get('/create', function(req, res, next) {
    res.render('create', { title: 'Create Account' , error: ''});
});


/* GET map page. */
router.get('/map', function(req, res) {
    res.render('Map', {'lat':lat ,'lng':lng })
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
