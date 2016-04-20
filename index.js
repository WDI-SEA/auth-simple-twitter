var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var db = require('./models');

var app = express();
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/static'));

var tweetCtrl = require('./controllers/tweet');
app.use('/tweets', tweetCtrl);

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/auth/signup', function(req, res) {
  res.render('signup');
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
    	res.redirect('/auth/signup');
  	}
  }).catch(function(err) {
    res.send(err);
  });
});

var port = 3000;
app.listen(port, function() {
  console.log("You're listening to the smooth sounds of port " + port);
});