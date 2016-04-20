var express = require('express');
var db = require('../models');

var router = express.Router();

var fakeTweets = [
  {username: 'spock', content: 'live long and prosper'},
  {username: 'worf', content: 'FIRE!'},
  {username: 'picard', content: 'engage'},
  {username: 'picard', content: 'make it so'},
];

router.get('/', function(req, res) {
	res.render('tweets', {tweets: fakeTweets});
});

router.get('/new', function(req, res){
	res.render('post-tweet');
});

router.post('/', function(req, res){
	console.log(req.body);
	fakeTweets.push(req.body);

	res.redirect('/tweets');
});

module.exports = router;