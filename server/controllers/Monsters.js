var mongoose = require('mongoose');
var Monster = mongoose.model('Monster');

module.exports = {
	getAvatar: function(req, res){
		Monster.findOne({name: 'The Avatar'}).exec(function(err, doc){
			if(err){
				console.log(err);
			} else {
				res.json(doc);
			}
		})
	},
	getMonster: function(req, res){
		Monster.findOne({name: req.params.name}).exec(function(err, doc){
			if(err){
				console.log(err);
			} else {
				res.json(doc);
			}
		})
	},
	upgradeSwordDamage: function(req, res){
		Monster.findOne({name: 'The Avatar'}).exec(function(err,doc){
			if(err){
				console.log(err);
			} else {
				var modifier = parseInt(req.body.modifier);
				doc.abilities[0].damage += modifier;
				doc.save(function(err, doc){
					if(err){
						console.log(err);
					} else {
						res.json(doc);
					}
				})
			}
		})
	}
}