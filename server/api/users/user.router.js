'use strict';

var router = require('express').Router(),
	_ = require('lodash');

var HttpError = require('../../utils/HttpError');
var User = require('./user.model');

router.use('/', function(req, res, next){
	console.log(req.ip);
	next();
})

router.param('id', function (req, res, next, id) {
	User.findById(id).exec()
	.then(function (user) {
		if (!user) throw HttpError(404);
		req.requestedUser = user;
		next();
	})
	.then(null, next);
});

router.get('/', function (req, res, next) {
	User.find({}).exec()
	.then(function (users) {
		res.json(users);
	})
	.then(null, next);
});

router.post('/', function (req, res, next) {
	User.create(req.body)
	.then(function (user) {
		res.status(201).json(user);
	})
	.then(null, next);
});

router.get('/:id', function (req, res, next) {
	req.requestedUser.getStories()
	.then(function (stories) {
		var obj = req.requestedUser.toObject();
		obj.stories = stories;
		res.json(obj);
	})
	.then(null, next);
});

router.put('/:id', function (req, res, next) {
	if(req.user._id == req.story.author || req.user.isAdmin){
		_.extend(req.requestedUser, req.body);
		req.requestedUser.save()
		.then(function (user) {
			res.json(user);
		})
		.then(null, next);
	}else{
		res.status(403).send('GO away, evildoer');
	}
});

router.delete('/:id', function (req, res, next) {
	if(!req.user.isAdmin){ res.send('YOU MAY NOT DELETE') }
	req.requestedUser.remove()
	.then(function () {
		res.status(204).end();
	})
	.then(null, next);
});

module.exports = router;
