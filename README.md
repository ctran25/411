current functionality:

map is same as before - search city, state from home page and display map centered on that location

login - checks if username and password is in database and sets session cookie

logout - deletes session cookie

add point to map - stored users location in database as latitude and longitude if they are logged in, else remains on homepage

create account - adds username and password to database if username does not already exist, else displays error



using MySQL on localhost - will need to have this installed and ensure that the password for root directory in sequalize command matched yours

also: create account requires existing table 'users' in database CS411
      to do this first create the database then change this
      
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

to this

router.post('/create', function(req,res,next) {
sequelize.sync().then(function (err) {
                Users.create({username: req.body.username, password: req.body.password}).then(function () {
                    res.redirect('/');
                });
            });
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


and create a user with the form on the site - this will initialize the table with the appropriate values

change the code back to the original
