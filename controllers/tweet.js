var express = require('express');
var db = require('../models');

var router = express.Router();

router.get('/', function(req, res) {
	var fakeTweets = [
	  {username: 'spock', content: 'live long and prosper'},
	  {username: 'worf', content: 'FIRE!'},
	  {username: 'picard', content: 'engage'},
	  {username: 'picard', content: 'make it so'},
	];
	res.render('tweets', {tweets: fakeTweets});
});

router.get('/new', function(req, res){
	res.render('post-tweet');
});

router.post('/', function(req, res){
	console.log(req.body);
	res.send(req.body);
});

module.exports = router;