var express = require('express');
var db = require('../models');

var router = express.Router();

router.get('/', function(req, res) {
	db.tweet.findAll({
		include: [db.user]
	}).then(function(tweets) {
		console.log(tweets);
		res.render('tweets', {tweets: tweets, alerts: req.flash()});
	});
});

router.get('/new', function(req, res){
	res.render('post-tweet');
});

router.post('/', function(req, res){
	console.log(req.body);

	db.user.find({
		where: { username: req.currentUser.username}
	}).then(function(user) {
		user.createTweet({
			content: req.body.content
		}).then(function(tweet) {
			res.redirect('/tweets');
		});
	}).catch(function(err) {
		res.send(err);
	});
});

module.exports = router;
