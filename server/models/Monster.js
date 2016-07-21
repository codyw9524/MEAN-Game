var mongoose = require('mongoose');

var MonsterSchema = mongoose.Schema({
	name: String,
	hitPoints: Number,
	abilities: [{name: String, damage: Number}]
})

var Monster = mongoose.model('Monster', MonsterSchema);