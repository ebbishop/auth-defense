'use strict';

var router = require('express').Router();
var crypto = require('crypto');

var getSalt = function() {
	return crypto.randomBytes(16).toString('base64')
}

function hashPassword (password, salt) {
	console.log(password, salt)
	var iterations = 20;
	var bytes = 64;
	var buffer = crypto.pbkdf2Sync(password, salt, iterations, bytes);
	var hash = buffer.toString('base64');
	return hash;
}

var HttpError = require('../utils/HttpError');
var User = require('../api/users/user.model');

router.post('/login', function (req, res, next) {
	console.log('request body: ', req.body)
	User.findOne({email: req.body.email}).exec()
	.then(function (user) {
		if (!user) throw HttpError(401);
		console.log('user password: ', user.password, 'user salt: ', user.salt);
		if (user.password === hashPassword(req.body.password, user.salt) ){
			req.login(user, function () {
				res.json(user);
			});
		} else {
			res.status(401).send('Invalid credentials');
		}
	})
	.then(null, next);
});

router.post('/signup', function (req, res, next) {
	User.findOne(req.body)
	.exec()
	.then(function(user) {
		if (!user) {
			var user = new User(req.body);
			user.salt = getSalt();
			user.password = hashPassword(req.body.password, user.salt);
			console.log('new user: ', user)
			return user.save();
		} else {
			res.send('This user exists');
		}
	})
	.then(function (user) {
		req.login(user, function () {
			res.status(201).json(user);
		});
	})
	.then(null, next);
});

router.get('/me', function (req, res, next) {
	res.json(req.user);
});

router.delete('/me', function (req, res, next) {
	req.logout();
	res.status(204).end();
});

router.use('/google', require('./google.oauth'));

router.use('/twitter', require('./twitter.oauth'));

router.use('/github', require('./github.oauth'));

module.exports = router;