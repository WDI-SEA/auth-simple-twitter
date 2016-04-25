// external dependencies
var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var flash = require('connect-flash');
var session = require('express-session');

// local dependencies 
var tweetCtrl = require('./controllers/tweet');
var db = require('./models');

var app = express();
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/static'));

app.use(session({
  secret: 'dsalkfjasdflkjgdfblknbadiadsnkl',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.use(function(req, res, next) {
  if (req.session.userId) {
    db.user.findById(req.session.userId).then(function(user) {
      req.currentUser = user;
      res.locals.currentUser = user;
      next();
    })
  } else {
    req.currentUser = false;
    res.locals.currentUser = false;
    next();
  }
});


app.use('/tweets', tweetCtrl);

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/auth/signin', function(req, res) {
  // proving we get the username and password
  console.log("sign in:", req.body);
  var user = req.body.username;
  var pass = req.body.password;
  console.log("logging in as", user);
  db.user.authenticate(user, pass, function(err, user) {
    // user successfully logged in.
    if (user) {
      console.log('GOT USER', user.username);
      req.session.userId = user.id;
      req.flash('success', 'Successfully logged in.');
      res.redirect('/tweets');
    }
  });
});

app.get('/auth/signup', function(req, res) {
  res.render('signup', {alerts: req.flash()});
});

app.post('/auth/signup', function(req, res) {
  console.log(req.body);
  db.user.findOrCreate({
  	where: {
  		username: req.body.username,
  	},
  	defaults: {
  		password: req.body.password
  	}
  }).spread(function(user, isNew) {
  	if (isNew) {
    	res.redirect('/tweets');
  	} else {
  		req.flash('danger', 'Username already taken. Please choose another.')
    	res.redirect('/auth/signup');
  	}
  }).catch(function(err) {
    req.flash('danger', err.message);
    res.redirect('/auth/signup')
  });
});

var port = 3000;
app.listen(port, function() {
  console.log("You're listening to the smooth sounds of port " + port);
});