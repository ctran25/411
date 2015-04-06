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
    lat: Sequelize.DECIMAL(10,6),
    lng: Sequelize.DECIMAL(10,6)
});

router.post('/login', function(req, res) {
    Users.findOne({where: { username: req.body.username }}).then(function(user) {
        if (!user) {
            res.render('/', { error: 'Invalid username or password.' });
        } else {
            if (req.body.password === user.password) {
                // sets a cookie with the user's info
                req.session.user = user;
                res.redirect('/');
            } else {
                res.render('login.jade', { error: 'Invalid email or password.' });
            }
        }
    });
});

router.post('/create', function(req,res,next) {
    Users.findOne({where: { username: req.body.username }}).then(function(user) {
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
        Users.update({lat: req.body.lat, lng: req.body.lng}, {where: {username: req.session.user.username}}).then(function () {
        });
    });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' , error: ''});
});

router.get('/addpoint', function(req, res, next) {
    if (req.session&&req.session.user) { // Check if session exists
        // lookup the user in the DB by pulling their email from the session
        console.log(req.session.user.username);
        Users.findOne({where: { username: req.session.user.username }}).then(function(user) {
            if (!user) {
                console.log('2');
                console.log(user);
                // if the user isn't found in the DB, reset the session info and
                // redirect the user to the login page
                req.session.reset();
                res.redirect('/');
            } else {
                // expose the user to the template
                res.locals.user = user;
                console.log('3');
                // render the dashboard page
                res.redirect('/');
            }
        });
    } else {
        console.log('4');
        res.redirect('/');
    }
});

router.get('/create', function(req, res, next) {
    res.render('create', { title: 'Create Account' , error: ''});
});


/* GET map page. */
router.get('/map', function(req, res) {
    res.render('Map', {'lat':lat ,'lng':lng })
});

router.get('/logout', function(req, res) {
    req.session.reset();
    res.redirect('/');
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
