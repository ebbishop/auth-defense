'use strict';

var   fs = require("fs"),
      http = require('http'),
      https = require("https");

var privateKey = fs.readFileSync(__dirname + '/../key.pem').toString();
var certificate = fs.readFileSync(__dirname + '/../cert.pem').toString();

var credentials = {key: privateKey, cert: certificate};

var app = require('./app');

// var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);


// httpServer.listen(8000);
httpsServer.listen(8080);

var db = require('./db');


module.exports = httpsServer;