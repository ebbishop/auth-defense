'use strict';

var router = require('express').Router();

router.use('/', function(req, res, next){
    if(!req.headers.referer){
      res.status(403);
      res.send('GET OFF MY LAWN!');
    };
    next();
});

router.use('/users', require('./users/user.router'));

router.use('/stories', require('./stories/story.router'));

module.exports = router;
