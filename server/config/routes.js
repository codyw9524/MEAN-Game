var mongoose = require('mongoose');
var Monsters = require('./../controllers/Monsters');
var Logs = require('./../controllers/Logs');


module.exports = function(app){
	app.get('/avatar', Monsters.getAvatar);

	app.get('/monster/:name', Monsters.getMonster);

	app.get('/logs', Logs.index);

	app.post('/logs', Logs.create);
}