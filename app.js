var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

require('./server/config/mongoose');

app.use(express.static(__dirname + '/client'));

app.use(bodyParser.json());

require('./server/config/routes')(app);

app.listen(4500, function(){
	console.log('listening on port 4500...');
})